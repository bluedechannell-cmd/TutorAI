import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/paypal'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headers = req.headers

  // Verify webhook signature with PayPal
  try {
    const valid = await verifyWebhookSignature({
      auth_algo: headers.get('paypal-auth-algo') ?? '',
      cert_url: headers.get('paypal-cert-url') ?? '',
      transmission_id: headers.get('paypal-transmission-id') ?? '',
      transmission_sig: headers.get('paypal-transmission-sig') ?? '',
      transmission_time: headers.get('paypal-transmission-time') ?? '',
      webhook_id: process.env.PAYPAL_WEBHOOK_ID ?? '',
      webhook_event: JSON.parse(body),
    })
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  } catch (err) {
    console.error('Webhook verification error:', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
  }

  const event = JSON.parse(body)
  const supabase = getSupabaseAdmin()

  try {
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        const subscriptionId: string = event.resource.id
        const clerkId: string = event.resource.custom_id
        if (clerkId) {
          await supabase
            .from('users')
            .update({ paypal_subscription_id: subscriptionId })
            .eq('clerk_id', clerkId)
        }
        break
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const subscriptionId: string = event.resource.id
        await supabase
          .from('users')
          .update({ subscription_tier: 'free', paypal_subscription_id: null })
          .eq('paypal_subscription_id', subscriptionId)
        break
      }

      case 'PAYMENT.CAPTURE.REFUNDED': {
        const customId: string = event.resource.custom_id
        if (customId) {
          await supabase
            .from('users')
            .update({ subscription_tier: 'free', paypal_subscription_id: null })
            .eq('clerk_id', customId)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('PayPal webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }
}
