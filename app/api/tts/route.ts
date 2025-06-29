import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// Rate limiting implementation
const RATE_LIMIT = 30; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const ipRequestCounts = new Map<string, { count: number, resetTime: number }>();

function getRateLimitInfo(ip: string): { count: number, resetTime: number } {
  const now = Date.now();
  let info = ipRequestCounts.get(ip);
  
  if (!info || now > info.resetTime) {
    info = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    ipRequestCounts.set(ip, info);
  }
  
  return info;
}

function isRateLimited(ip: string): boolean {
  const info = getRateLimitInfo(ip);
  info.count++;
  
  return info.count > RATE_LIMIT;
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
          }
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    const voiceId = searchParams.get('voice') || 'default';

    if (!text) {
      return NextResponse.json(
        { error: 'Text parameter is required' },
        { status: 400 }
      );
    }

    // Check user authentication for premium voices
    if (voiceId !== 'default') {
      const supabase = createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required for premium voices' },
          { status: 401 }
        );
      }
      
      // Check if user has premium subscription
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();
        
      if (!subscription) {
        return NextResponse.json(
          { error: 'Premium subscription required for this voice' },
          { status: 403 }
        );
      }
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      // Return a message indicating TTS is not available
      return NextResponse.json(
        { 
          error: 'TTS service not configured',
          message: 'Voice guidance will use browser fallback.',
          fallback: true
        },
        { status: 503 }
      );
    }

    // ElevenLabs API call (when API key is available)
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'TTS service unavailable',
        message: 'Voice guidance will use browser fallback.',
        fallback: true
      },
      { status: 503 }
    );
  }
}