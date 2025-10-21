import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured');
      return NextResponse.json(
        { 
          error: 'Database not configured',
          images: [],
          total: 0,
          hasMore: false
        },
        { status: 200 } // Return 200 with empty data instead of 500
      );
    }

    const supabase = createServerSupabaseClient();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const style = searchParams.get('style');
    const modelVersion = searchParams.get('modelVersion');

    // Build query
    let query = supabase
      .from('generations')
      .select('*')
      .eq('user_id', 'public') // Only get public library images
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add filters if provided
    if (style) {
      query = query.eq('style', style);
    }
    if (modelVersion) {
      query = query.eq('model_version', modelVersion);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      // If table doesn't exist or other DB error, return empty array instead of 500
      return NextResponse.json({
        images: [],
        total: 0,
        hasMore: false,
        error: 'Database not ready - no images available yet'
      });
    }

    return NextResponse.json({
      images: data || [],
      total: data?.length || 0,
      hasMore: data?.length === limit
    });

  } catch (error) {
    console.error('Library API error:', error);
    // Return empty data instead of 500 error
    return NextResponse.json({
      images: [],
      total: 0,
      hasMore: false,
      error: 'Service temporarily unavailable'
    });
  }
}
