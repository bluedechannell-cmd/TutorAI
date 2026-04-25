import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

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

type Attachment = {
  name: string
  type: 'image' | 'document' | 'text'
  mediaType: string
  data: string // base64
}

type IncomingMessage = {
  role: 'user' | 'assistant'
  content: string
  attachments?: Attachment[]
}

function buildContent(msg: IncomingMessage) {
  if (!msg.attachments || msg.attachments.length === 0) {
    return msg.content
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocks: any[] = []

  for (const att of msg.attachments) {
    if (att.type === 'image') {
      blocks.push({
        type: 'image',
        source: { type: 'base64', media_type: att.mediaType, data: att.data },
      })
    } else if (att.type === 'document') {
      blocks.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: att.data },
      })
    } else {
      // text / code file — decode and inline
      const text = Buffer.from(att.data, 'base64').toString('utf-8')
      blocks.push({ type: 'text', text: `[File: ${att.name}]\n\`\`\`\n${text}\n\`\`\`` })
    }
  }

  if (msg.content) {
    blocks.push({ type: 'text', text: msg.content })
  }

  return blocks
}

export async function POST(req: NextRequest) {
  try {
    const { messages, quizMode } = await req.json()
    const systemPrompt = quizMode ? QUIZ_SYSTEM_PROMPT : SYSTEM_PROMPT

    const formatted = (messages as IncomingMessage[]).map((m) => ({
      role: m.role,
      content: buildContent(m),
    }))

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: formatted,
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
