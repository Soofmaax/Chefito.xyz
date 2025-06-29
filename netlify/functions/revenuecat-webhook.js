// RevenueCat Webhook Handler for Netlify
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// RevenueCat webhook secret for signature verification
const REVENUECAT_WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET;

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-RevenueCat-Signature',
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
    // Verify webhook signature
    const signature = event.headers['x-revenuecat-signature'];
    
    if (REVENUECAT_WEBHOOK_SECRET && !verifySignature(signature, event.body, REVENUECAT_WEBHOOK_SECRET)) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid webhook signature' 
        }),
      };
    }

    // Parse webhook data
    const webhookData = JSON.parse(event.body);
    const eventType = webhookData.event?.type;
    const appUserId = webhookData.app_user_id;
    
    // Log the webhook event
    await supabase.from('subscription_events').insert({
      revenuecat_customer_id: appUserId,
      event_type: eventType,
      product_id: webhookData.product_id,
      raw_data: webhookData,
    });

    // Find the user by RevenueCat ID
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('revenuecat_id', appUserId)
      .single();
      
    if (userError && userError.code !== 'PGRST116') {
      throw new Error(`User lookup error: ${userError.message}`);
    }
    
    const userId = userData?.id;
    
    // Process different event types
    switch (eventType) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'UNCANCELLATION':
        await handleSubscriptionActive(webhookData, userId);
        break;
      
      case 'CANCELLATION':
        await handleSubscriptionCancelled(webhookData, userId);
        break;
      
      case 'EXPIRATION':
        await handleSubscriptionExpired(webhookData, userId);
        break;
      
      case 'PRODUCT_CHANGE':
        await handleProductChange(webhookData, userId);
        break;
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true,
        message: `Webhook processed: ${eventType}`
      }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error'
      }),
    };
  }
};

// Handle subscription activation
async function handleSubscriptionActive(webhookData, userId) {
  if (!userId) return;
  
  const { product_id, entitlements, expires_date_ms } = webhookData;
  
  // Update or create subscription record
  await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      revenuecat_customer_id: webhookData.app_user_id,
      plan_id: product_id,
      status: 'active',
      is_active: true,
      starts_at: new Date().toISOString(),
      expires_at: expires_date_ms ? new Date(expires_date_ms).toISOString() : null,
      canceled_at: null,
    }, { onConflict: 'user_id, plan_id' });
  
  // Update user profile subscription status
  await supabase
    .from('profiles')
    .update({ subscription_status: 'premium' })
    .eq('id', userId);
}

// Handle subscription cancellation
async function handleSubscriptionCancelled(webhookData, userId) {
  if (!userId) return;
  
  const { product_id } = webhookData;
  
  // Update subscription record
  await supabase
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('plan_id', product_id);
}

// Handle subscription expiration
async function handleSubscriptionExpired(webhookData, userId) {
  if (!userId) return;
  
  const { product_id } = webhookData;
  
  // Update subscription record
  await supabase
    .from('user_subscriptions')
    .update({
      status: 'expired',
      is_active: false,
      expires_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('plan_id', product_id);
  
  // Update user profile subscription status
  await supabase
    .from('profiles')
    .update({ subscription_status: 'free' })
    .eq('id', userId);
}

// Handle product change
async function handleProductChange(webhookData, userId) {
  if (!userId) return;
  
  const { product_id } = webhookData;
  
  // Update subscription record with new product
  await supabase
    .from('user_subscriptions')
    .update({
      plan_id: product_id,
      status: 'active',
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('is_active', true);
}

// Verify webhook signature
function verifySignature(signature, payload, secret) {
  if (!signature || !secret) return false;
  
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return signature === digest;
}