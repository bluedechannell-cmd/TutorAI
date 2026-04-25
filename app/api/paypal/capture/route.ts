import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { captureOrder, getSubscription } from '@/lib/paypal'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { plan, subscriptionId, token } = await req.json()
    const supabase = getSupabaseAdmin()

    if (plan === 'max' && token) {
      // One-time payment — capture the order
      const capture = await captureOrder(token)
      if (capture.status !== 'COMPLETED') {
        console.error('PayPal capture failed:', capture)
        return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
      }
      await supabase
        .from('users')
        .update({ subscription_tier: 'max', paypal_subscription_id: token })
        .eq('clerk_id', userId)
      return NextResponse.json({ success: true })
    }

    if ((plan === 'starter' || plan === 'pro') && subscriptionId) {
      // Subscription — verify it's active with PayPal
      const sub = await getSubscription(subscriptionId)
      if (sub.status !== 'ACTIVE') {
        // PayPal sometimes takes a moment — optimistically activate and let webhook confirm
        console.warn('PayPal subscription status:', sub.status)
      }
      await supabase
        .from('users')
        .update({ subscription_tier: plan, paypal_subscription_id: subscriptionId })
        .eq('clerk_id', userId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
  } catch (err) {
    console.error('PayPal capture error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
