// RevenueCat Webhook Handler for Netlify (Simplified)
exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    console.log('📦 RevenueCat Webhook received (demo mode)');
    
    // For now, just log the webhook and return success
    // In production, this would handle actual RevenueCat webhooks
    const body = event.body;
    
    if (body) {
      const webhookData = JSON.parse(body);
      console.log('Webhook event type:', webhookData.event?.type || 'unknown');
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true,
        message: 'Webhook received (demo mode)'
      }),
    };
  } catch (error) {
    console.error('❌ Webhook error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
    };
  }
};