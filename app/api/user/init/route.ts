import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST() {
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
      // ignore — email will be empty string, fine for init
    }

    const supabase = getSupabaseAdmin()
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (!existing) {
      await supabase.from('users').insert({
        clerk_id: userId,
        email,
        questions_used: 0,
        subscription_tier: 'free',
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('User init error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
