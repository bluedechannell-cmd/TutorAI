import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { setupPlans } from '@/lib/paypal'
import { ADMIN_EMAIL } from '@/lib/constants'

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress ?? ''
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const result = await setupPlans()
    return NextResponse.json({
      message: 'Plans created! Add these to your .env.local:',
      ...result,
      env: [
        `PAYPAL_STARTER_PLAN_ID=${result.starterPlanId}`,
        `PAYPAL_PRO_PLAN_ID=${result.proPlanId}`,
      ],
    })
  } catch (err) {
    console.error('PayPal setup error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
