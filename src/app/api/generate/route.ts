import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { AI_CONFIG } from '@/lib/config';
import { GenerationRequest, GenerationResponse, ApiError } from '@/types';
import axios from 'axios';

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 10; // Free tier limit

  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

async function enhancePrompt(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      `${AI_CONFIG.huggingFace.baseUrl}/models/microsoft/DialoGPT-medium`,
      {
        inputs: `Enhance this image prompt to be more detailed and descriptive: ${prompt}`,
        parameters: {
          max_length: 150,
          temperature: 0.7,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${AI_CONFIG.huggingFace.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data[0]?.generated_text || prompt;
  } catch (error) {
    console.error('Prompt enhancement failed:', error);
    return prompt; // Fallback to original prompt
  }
}

async function generateNegativePrompt(style: string): Promise<string> {
  const negativePrompts = {
    realistic: 'cartoon, anime, painting, drawing, sketch, low quality, blurry, distorted',
    cinematic: 'amateur, low quality, poor lighting, unrealistic, flat lighting',
    artistic: 'generic, boring, uncreative, amateur, low quality',
    vaporwave: 'modern, contemporary, realistic, natural colors, muted tones',
  };

  return negativePrompts[style as keyof typeof negativePrompts] || negativePrompts.realistic;
}

async function generateImageWithHuggingFace(
  prompt: string,
  negativePrompt: string,
  aspectRatio: string,
  modelId: string
): Promise<string> {
  // Map aspect ratio to width/height (HF common params)
  const aspectMap: Record<string, { width: number; height: number }> = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1024, height: 576 },
    '9:16': { width: 576, height: 1024 },
    '4:3': { width: 1024, height: 768 },
    '3:4': { width: 768, height: 1024 },
  };
  const dims = aspectMap[aspectRatio] || aspectMap['1:1'];

  // HF Inference API returns binary image by default; request arraybuffer and convert to base64
  const url = `${AI_CONFIG.huggingFace.baseUrl}/models/${encodeURIComponent(modelId)}`;
  const payload = {
    inputs: prompt,
    parameters: {
      negative_prompt: negativePrompt,
      width: dims.width,
      height: dims.height,
      guidance_scale: 7,
      num_inference_steps: 30,
    },
    options: { wait_for_model: true },
  };

  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${AI_CONFIG.huggingFace.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'image/png',
    },
    responseType: 'arraybuffer',
  });

  const base64Image = Buffer.from(response.data).toString('base64');
  return `data:image/png;base64,${base64Image}`;
}

async function generateImage(
  prompt: string,
  negativePrompt: string,
  aspectRatio: string,
  modelVersion: string
): Promise<string> {
  return generateImageWithHuggingFace(prompt, negativePrompt, aspectRatio, modelVersion);
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body: GenerationRequest = await request.json();
    const { prompt, style = 'realistic', aspectRatio = '1:1', modelVersion = 'tencent/HunyuanImage-3.0' } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Step 1: Enhance the prompt using LLM
    const refinedPrompt = await enhancePrompt(prompt);

    // Step 2: Generate negative prompt
    const negativePrompt = await generateNegativePrompt(style);

    // Step 3: Generate image
    const imageBase64 = await generateImage(refinedPrompt, negativePrompt, aspectRatio, modelVersion);

    const processingTime = Date.now() - startTime;

    // Step 4: Upload image to Supabase Storage and save to database
    let generationId: string | null = null;
    let publicImageUrl: string = imageBase64; // Fallback to base64

    try {
      const supabase = createServerSupabaseClient();
      
      // Convert base64 to blob
      const base64Data = imageBase64.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const blob = new Blob([buffer], { type: 'image/png' });
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `generation-${timestamp}-${randomId}.png`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(fileName, blob, {
          contentType: 'image/png',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
      } else {
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('generated-images')
          .getPublicUrl(fileName);
        
        publicImageUrl = publicUrl;
      }

      // Save to database (always save to public library)
      const { data, error } = await supabase
        .from('generations')
        .insert({
          user_id: 'public', // Public library - no user authentication required
          original_prompt: prompt,
          refined_prompt: refinedPrompt,
          negative_prompt: negativePrompt,
          image_url: publicImageUrl,
          style,
          aspect_ratio: aspectRatio,
          model_version: modelVersion,
          processing_time: processingTime,
        })
        .select()
        .single();

      if (error) {
        console.error('Database save error:', error);
      } else {
        generationId = data.id;
      }
    } catch (error) {
      console.error('Storage/Database operation failed:', error);
    }

    // Return the generation response
    const response: GenerationResponse = {
      id: generationId || `temp_${Date.now()}`,
      imageUrl: publicImageUrl,
      originalPrompt: prompt,
      refinedPrompt,
      negativePrompt,
      style,
      aspectRatio,
      modelVersion,
      userId: 'public', // Public library
      createdAt: new Date().toISOString(),
      processingTime,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Generation API error:', error);
    
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Internal server error',
      code: 'GENERATION_FAILED',
    };

    return NextResponse.json(apiError, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Pixilator Image Generation API' },
    { status: 200 }
  );
}
