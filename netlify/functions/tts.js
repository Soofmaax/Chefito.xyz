// Text-to-Speech function for Netlify
const https = require('https');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

exports.handler = async (event, context) => {
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
          message: 'Voice guidance will use browser fallback.',
          fallback: true
        }),
      };
    }

    // Call ElevenLabs API
    const response = await callElevenLabsAPI(text, apiKey);
    
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
      body: response.toString('base64'),
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

// Function to call ElevenLabs API
async function callElevenLabsAPI(text, apiKey) {
  const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Default voice ID
  
  const requestData = JSON.stringify({
    text,
    model_id: 'eleven_monolingual_v1',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
      style: 0.0,
      use_speaker_boost: true,
    },
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${voiceId}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
        'Content-Length': Buffer.byteLength(requestData),
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`ElevenLabs API error: ${res.statusCode} ${res.statusMessage}`));
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', reject);
    req.write(requestData);
    req.end();
  });
}