import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
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

    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      // Return a message indicating TTS is not available
      return NextResponse.json(
        { 
          error: 'TTS service not configured',
          message: 'ElevenLabs API key not found. Voice guidance will use browser fallback.',
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