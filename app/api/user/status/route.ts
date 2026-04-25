import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { ADMIN_EMAIL, FREE_QUESTIONS_LIMIT } from '@/lib/constants'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let email = ''
    try {
      const user = await currentUser()
      email = user?.emailAddresses?.[0]?.emailAddress ?? ''
    } catch {
      // fall back to Supabase
    }
    if (!email) {
      const { data: dbU } = await getSupabaseAdmin()
        .from('users')
        .select('email')
        .eq('clerk_id', userId)
        .single()
      email = dbU?.email ?? ''
    }
    const isAdmin = email === ADMIN_EMAIL

    if (isAdmin) {
      return NextResponse.json({
        questionsUsed: 0,
        subscriptionTier: 'max',
        isAdmin: true,
        questionsRemaining: Infinity,
      })
    }

    const { data: dbUser } = await getSupabaseAdmin()
      .from('users')
      .select('questions_used, subscription_tier')
      .eq('clerk_id', userId)
      .single()

    const questionsUsed = dbUser?.questions_used ?? 0
    const subscriptionTier = dbUser?.subscription_tier ?? 'free'
    const questionsRemaining =
      subscriptionTier === 'free'
        ? Math.max(0, FREE_QUESTIONS_LIMIT - questionsUsed)
        : Infinity

    return NextResponse.json({
      questionsUsed,
      subscriptionTier,
      isAdmin: false,
      questionsRemaining,
    })
  } catch (err) {
    console.error('User status error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
