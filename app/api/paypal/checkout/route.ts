import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createSubscription, createOrder } from '@/lib/paypal'

const PLAN_CONFIG: Record<string, { type: 'subscription' | 'order'; planId?: string; amount?: string }> = {
  starter: { type: 'subscription', planId: process.env.PAYPAL_STARTER_PLAN_ID },
  pro:     { type: 'subscription', planId: process.env.PAYPAL_PRO_PLAN_ID },
  max:     { type: 'order',        amount: '50.00' },
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { plan } = await req.json()
    const config = PLAN_CONFIG[plan]
    if (!config) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const returnUrl = `${appUrl}/success?plan=${plan}`
    const cancelUrl = `${appUrl}/pricing`

    if (config.type === 'subscription') {
      if (!config.planId) {
        return NextResponse.json(
          { error: 'Plan ID not configured. Run /api/paypal/setup first.' },
          { status: 500 }
        )
      }
      const sub = await createSubscription(config.planId, userId, returnUrl, cancelUrl)
      const approvalUrl = sub.links?.find((l: { rel: string }) => l.rel === 'approve')?.href
      if (!approvalUrl) {
        console.error('PayPal subscription error:', sub)
        return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
      }
      return NextResponse.json({ approvalUrl })
    } else {
      const order = await createOrder(config.amount!, userId, returnUrl, cancelUrl)
      const approvalUrl = order.links?.find((l: { rel: string }) => l.rel === 'approve')?.href
      if (!approvalUrl) {
        console.error('PayPal order error:', order)
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
      }
      return NextResponse.json({ approvalUrl })
    }
  } catch (err) {
    console.error('PayPal checkout error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
