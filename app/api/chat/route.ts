import { auth, currentUser } from '@clerk/nextjs/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { ADMIN_EMAIL, FREE_QUESTIONS_LIMIT } from '@/lib/constants'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const SYSTEM_PROMPT = `You are TutorAI, a friendly, patient, and expert AI tutor for students of all ages and skill levels. You help with any academic subject including math, science, history, English, coding, languages, test prep, and more.

Teaching principles:
1. Always give clear, step-by-step explanations — never just state the answer
2. Adapt your language to the apparent age and level of the student
3. For math: show every step of the work and explain why each step is taken
4. For coding: provide well-commented examples and explain the logic
5. Use examples, analogies, and relatable comparisons to make concepts click
6. Encourage the student warmly and celebrate their curiosity
7. If a concept is complex, break it into smaller digestible parts
8. Use markdown formatting: headers for sections, bullet points, code blocks for code
9. For math expressions, use LaTeX notation (wrap in $ for inline, $$ for display)

Tone: friendly, encouraging, enthusiastic about learning. Make education feel fun, not scary.`

const QUIZ_SYSTEM_PROMPT = `${SYSTEM_PROMPT}

QUIZ MODE IS ACTIVE: Instead of explaining concepts directly, first test the student's knowledge with a targeted question. If they answer incorrectly or seem stuck, give a hint. Guide them to discover the answer rather than giving it away. Celebrate when they get it right!`

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let userEmail = ''
    try {
      const user = await currentUser()
      userEmail = user?.emailAddresses?.[0]?.emailAddress ?? ''
    } catch {
      // currentUser() can fail if Clerk's API is unreachable — fall back to Supabase
    }
    if (!userEmail) {
      const { data: dbUserEmail } = await getSupabaseAdmin()
        .from('users')
        .select('email')
        .eq('clerk_id', userId)
        .single()
      userEmail = dbUserEmail?.email ?? ''
    }
    const isAdmin = userEmail === ADMIN_EMAIL

    const { messages, quizMode } = await req.json()

    if (!isAdmin) {
      const supabase = getSupabaseAdmin()
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('questions_used, subscription_tier')
        .eq('clerk_id', userId)
        .single()

      if (error || !dbUser) {
        await supabase.from('users').insert({
          clerk_id: userId,
          email: userEmail,
          questions_used: 1,
          subscription_tier: 'free',
        })
      } else if (dbUser.subscription_tier === 'free' && dbUser.questions_used >= FREE_QUESTIONS_LIMIT) {
        return NextResponse.json(
          { error: 'FREE_LIMIT_REACHED', questionsUsed: dbUser.questions_used },
          { status: 402 }
        )
      } else {
        await supabase
          .from('users')
          .update({ questions_used: dbUser.questions_used + 1 })
          .eq('clerk_id', userId)
      }
    }

    const systemPrompt = quizMode ? QUIZ_SYSTEM_PROMPT : SYSTEM_PROMPT

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          // @ts-expect-error cache_control is valid for prompt caching
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
