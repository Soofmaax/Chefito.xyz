// ElevenLabs TTS function for Netlify
exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    const { queryStringParameters } = event;
    const text = queryStringParameters?.text;
    const voiceId = queryStringParameters?.voice || 'default';

    if (!text) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Text parameter is required' }),
      };
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 503,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'TTS service not configured',
          message: 'ElevenLabs API key not found. Voice guidance will use browser fallback.',
          fallback: true
        }),
      };
    }

    // ElevenLabs API call
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
    
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
      body: Buffer.from(audioBuffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('TTS Error:', error);
    
    return {
      statusCode: 503,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'TTS service unavailable',
        message: 'Voice guidance will use browser fallback.',
        fallback: true
      }),
    };
  }
};