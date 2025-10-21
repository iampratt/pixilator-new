// Application configuration

export const APP_CONFIG = {
  name: 'Pixilator',
  description: 'AI-powered image generator with prompt refinement',
  version: '1.0.0',
} as const;

// AI Service Configuration
export const AI_CONFIG = {
  // Hugging Face Inference API configuration
  huggingFace: {
    baseUrl: 'https://api-inference.huggingface.co',
    apiKey: process.env.HUGGING_FACE_API_KEY,
    // Text-to-image models supported in Pixilator
    imageModels: [
      { id: 'tencent/HunyuanImage-3.0', name: 'HunyuanImage 3.0' },
      { id: 'black-forest-labs/FLUX.1-dev', name: 'FLUX.1-dev' },
    ],
    // Optional: LLMs for prompt enhancement if desired later
    models: {
      promptEnhancement: 'microsoft/DialoGPT-medium',
      negativePromptGeneration: 'gpt2',
    },
  },
} as const;

// Style presets for image generation
export const STYLE_PRESETS = [
  {
    id: 'realistic',
    name: 'Realistic',
    description: 'Photorealistic, high-quality images',
    prompt: 'photorealistic, high quality, detailed, professional photography',
    negativePrompt: 'cartoon, anime, painting, drawing, sketch, low quality, blurry',
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Movie-like dramatic scenes',
    prompt: 'cinematic, dramatic lighting, film noir, professional cinematography',
    negativePrompt: 'amateur, low quality, poor lighting, unrealistic',
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Creative and artistic interpretations',
    prompt: 'artistic, creative, unique style, masterful composition',
    negativePrompt: 'generic, boring, uncreative, amateur',
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    description: 'Retro-futuristic aesthetic',
    prompt: 'vaporwave, neon, retro, 80s, synthwave, cyberpunk',
    negativePrompt: 'modern, contemporary, realistic, natural colors',
  },
] as const;

// Aspect ratio options
export const ASPECT_RATIOS = [
  { id: '1:1', name: 'Square (1:1)', value: '1:1', width: 1024, height: 1024 },
  { id: '16:9', name: 'Widescreen (16:9)', value: '16:9', width: 1024, height: 576 },
  { id: '9:16', name: 'Portrait (9:16)', value: '9:16', width: 576, height: 1024 },
  { id: '4:3', name: 'Standard (4:3)', value: '4:3', width: 1024, height: 768 },
  { id: '3:4', name: 'Portrait (3:4)', value: '3:4', width: 768, height: 1024 },
] as const;

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  maxRequestsPerHour: 10, // Free tier limit
  maxRequestsPerDay: 50,
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  localStorageKey: 'pixilator_history',
  maxCachedItems: 10,
  cacheExpiryDays: 30,
} as const;
