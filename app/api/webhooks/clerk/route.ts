import { Webhook } from 'svix'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

type ClerkUserEvent = {
  type: string
  data: {
    id: string
    email_addresses: Array<{ email_address: string; id: string }>
    primary_email_address_id: string
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'No webhook secret' }, { status: 500 })
  }

  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const body = await req.text()
  const wh = new Webhook(secret)

  let event: ClerkUserEvent
  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkUserEvent
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'user.created') {
    const { id: clerkId, email_addresses, primary_email_address_id } = event.data
    const email =
      email_addresses.find((e) => e.id === primary_email_address_id)?.email_address ?? ''

    await getSupabaseAdmin().from('users').upsert(
      { clerk_id: clerkId, email, questions_used: 0, subscription_tier: 'free' },
      { onConflict: 'clerk_id' }
    )
  }

  return NextResponse.json({ received: true })
}
