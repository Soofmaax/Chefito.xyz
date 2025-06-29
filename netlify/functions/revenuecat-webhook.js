// RevenueCat Webhook Handler for Netlify
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    // Verify webhook signature (in production)
    // const signature = event.headers['x-revenuecat-signature'];
    // if (!verifySignature(signature, event.body, process.env.REVENUECAT_WEBHOOK_SECRET)) {
    //   return {
    //     statusCode: 401,
    //     headers: corsHeaders,
    //     body: JSON.stringify({ 
    //       success: false, 
    //       error: 'Invalid webhook signature' 
    //     }),
    //   };
    // }

    // Parse webhook data
    const webhookData = JSON.parse(event.body);
    const eventType = webhookData.event?.type;
    
    console.log(`📦 RevenueCat webhook received: ${eventType}`);
    
    // Log the webhook event
    await supabase.from('subscription_events').insert({
      revenuecat_customer_id: webhookData.app_user_id,
      event_type: eventType,
      product_id: webhookData.product_id,
      raw_data: webhookData,
    });

    // Process different event types
    switch (eventType) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'UNCANCELLATION':
        await handleSubscriptionActive(webhookData);
        break;
      
      case 'CANCELLATION':
        await handleSubscriptionCancelled(webhookData);
        break;
      
      case 'EXPIRATION':
        await handleSubscriptionExpired(webhookData);
        break;
      
      case 'PRODUCT_CHANGE':
        await handleProductChange(webhookData);
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

// Handle subscription activation
async function handleSubscriptionActive(webhookData) {
  const { app_user_id, product_id, entitlements, expires_date_ms } = webhookData;
  
  // Find user by RevenueCat ID
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('revenuecat_id', app_user_id)
    .single();
  
  if (userError && userError.code !== 'PGRST116') {
    throw new Error(`User lookup error: ${userError.message}`);
  }
  
  const userId = userData?.id;
  if (!userId) {
    console.warn(`No user found for RevenueCat ID: ${app_user_id}`);
    return;
  }
  
  // Update or create subscription record
  const { error: subscriptionError } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      revenuecat_customer_id: app_user_id,
      product_id: product_id,
      is_active: true,
      expires_at: expires_date_ms ? new Date(expires_date_ms).toISOString() : null,
      cancelled_at: null,
    }, { onConflict: 'user_id, product_id' });
  
  if (subscriptionError) {
    throw new Error(`Subscription update error: ${subscriptionError.message}`);
  }
  
  // Update user profile subscription status
  await supabase
    .from('profiles')
    .update({ subscription_status: 'premium' })
    .eq('id', userId);
}

// Handle subscription cancellation
async function handleSubscriptionCancelled(webhookData) {
  const { app_user_id, product_id } = webhookData;
  
  // Find user by RevenueCat ID
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('revenuecat_id', app_user_id)
    .single();
  
  if (userError && userError.code !== 'PGRST116') {
    throw new Error(`User lookup error: ${userError.message}`);
  }
  
  const userId = userData?.id;
  if (!userId) {
    console.warn(`No user found for RevenueCat ID: ${app_user_id}`);
    return;
  }
  
  // Update subscription record
  const { error: subscriptionError } = await supabase
    .from('user_subscriptions')
    .update({
      cancelled_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('product_id', product_id);
  
  if (subscriptionError) {
    throw new Error(`Subscription update error: ${subscriptionError.message}`);
  }
}

// Handle subscription expiration
async function handleSubscriptionExpired(webhookData) {
  const { app_user_id, product_id } = webhookData;
  
  // Find user by RevenueCat ID
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('revenuecat_id', app_user_id)
    .single();
  
  if (userError && userError.code !== 'PGRST116') {
    throw new Error(`User lookup error: ${userError.message}`);
  }
  
  const userId = userData?.id;
  if (!userId) {
    console.warn(`No user found for RevenueCat ID: ${app_user_id}`);
    return;
  }
  
  // Update subscription record
  const { error: subscriptionError } = await supabase
    .from('user_subscriptions')
    .update({
      is_active: false,
      expires_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('product_id', product_id);
  
  if (subscriptionError) {
    throw new Error(`Subscription update error: ${subscriptionError.message}`);
  }
  
  // Update user profile subscription status
  await supabase
    .from('profiles')
    .update({ subscription_status: 'free' })
    .eq('id', userId);
}

// Handle product change
async function handleProductChange(webhookData) {
  const { app_user_id, product_id } = webhookData;
  
  // Find user by RevenueCat ID
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('revenuecat_id', app_user_id)
    .single();
  
  if (userError && userError.code !== 'PGRST116') {
    throw new Error(`User lookup error: ${userError.message}`);
  }
  
  const userId = userData?.id;
  if (!userId) {
    console.warn(`No user found for RevenueCat ID: ${app_user_id}`);
    return;
  }
  
  // Update subscription record with new product
  const { error: subscriptionError } = await supabase
    .from('user_subscriptions')
    .update({
      product_id: product_id,
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('is_active', true);
  
  if (subscriptionError) {
    throw new Error(`Subscription update error: ${subscriptionError.message}`);
  }
}

// Verify webhook signature (for production use)
function verifySignature(signature, payload, secret) {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return signature === digest;
}