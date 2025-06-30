import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check subscription status
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (subError && subError.code !== 'PGRST116') {
      throw subError;
    }

    const isPremium = subscription && (
      !subscription.expires_at || 
      new Date(subscription.expires_at) > new Date()
    );

    return NextResponse.json({
      success: true,
      data: {
        isPremium: !!isPremium,
        subscription: subscription || null,
      },
    });
  } catch (error: any) {
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to check subscription status',
      },
      { status: 500 }
    );
  }
}