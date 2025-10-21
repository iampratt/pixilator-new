import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
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
      return NextResponse.json(
        { error: 'Failed to fetch library images' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      images: data || [],
      total: data?.length || 0,
      hasMore: data?.length === limit
    });

  } catch (error) {
    console.error('Library API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
