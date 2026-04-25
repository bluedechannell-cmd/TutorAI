'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import {
  Send, Sparkles, BookOpen, Calculator, FlaskConical, Code2, Globe,
  Brain, Plus, Trash2, MessageSquare, Crown, X, ChevronLeft, ChevronRight,
  FileText, Trophy, Lightbulb, Loader2
} from 'lucide-react'
import Link from 'next/link'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

type UserStatus = {
  questionsUsed: number
  subscriptionTier: 'free' | 'starter' | 'pro' | 'max'
  isAdmin: boolean
  questionsRemaining: number
}

const SUBJECT_PROMPTS = [
  { label: 'Math', icon: Calculator, prompt: 'Help me solve this math problem:', color: 'bg-blue-100 text-blue-700' },
  { label: 'Science', icon: FlaskConical, prompt: 'Explain this science concept:', color: 'bg-green-100 text-green-700' },
  { label: 'Coding', icon: Code2, prompt: 'Help me with this code:', color: 'bg-orange-100 text-orange-700' },
  { label: 'History', icon: Globe, prompt: 'Tell me about this historical event:', color: 'bg-amber-100 text-amber-700' },
  { label: 'English', icon: BookOpen, prompt: 'Help me with this English/writing task:', color: 'bg-purple-100 text-purple-700' },
  { label: 'General', icon: Brain, prompt: 'Explain this concept:', color: 'bg-pink-100 text-pink-700' },
]

const STARTER_PROMPTS = [
  '🔢 Solve: 2x² + 5x - 3 = 0 step by step',
  '🧬 How does DNA replication work?',
  '💻 Explain recursion in Python with an example',
  '📜 What caused World War I?',
  '✍️ How do I write a strong thesis statement?',
  '⚡ What is Ohm\'s Law and how is it used?',
]

function PaywallModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-3xl font-display font-extrabold text-gray-900 mb-2">
            Unlock Unlimited Learning
          </h2>
          <p className="text-gray-500">
            You&apos;ve used your 3 free questions. Subscribe to keep learning with no limits!
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/pricing"
            className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold py-4 rounded-2xl text-center hover:opacity-90 transition-opacity"
          >
            See Plans — Starting at $9/mo
          </Link>
          <button
            onClick={onClose}
            className="w-full border-2 border-gray-200 text-gray-600 font-medium py-3 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            Maybe Later
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '💬', text: 'Unlimited questions' },
            { icon: '⚡', text: 'Faster answers' },
            { icon: '📝', text: 'Save notes' },
          ].map((f) => (
            <div key={f.text} className="bg-violet-50 rounded-xl p-3">
              <div className="text-xl mb-1">{f.icon}</div>
              <p className="text-xs font-medium text-violet-700">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ChatInterface() {
  const { user } = useUser()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null)
  const [showPaywall, setShowPaywall] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [quizMode, setQuizMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const activeConv = conversations.find((c) => c.id === activeConvId)
  const messages = activeConv?.messages ?? []

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  useEffect(() => {
    if (!user) return
    fetch('/api/user/init', { method: 'POST' })
    fetchStatus()
  }, [user])

  const fetchStatus = async () => {
    const res = await fetch('/api/user/status')
    if (res.ok) {
      const data = await res.json()
      setUserStatus(data)
    }
  }

  const createNewConversation = () => {
    const id = crypto.randomUUID()
    const conv: Conversation = {
      id,
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
    }
    setConversations((prev) => [conv, ...prev])
    setActiveConvId(id)
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeConvId === id) {
      const remaining = conversations.filter((c) => c.id !== id)
      setActiveConvId(remaining[0]?.id ?? null)
    }
  }

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || isLoading) return

    if (!activeConvId) createNewConversation()

    const convId = activeConvId ?? (() => {
      const id = crypto.randomUUID()
      const conv: Conversation = { id, title: content.slice(0, 40), messages: [], createdAt: new Date() }
      setConversations((prev) => [conv, ...prev])
      setActiveConvId(id)
      return id
    })()

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content }
    setInput('')
    setError(null)

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              title: c.messages.length === 0 ? content.slice(0, 50) : c.title,
              messages: [...c.messages, userMsg],
            }
          : c
      )
    )

    setIsLoading(true)

    const assistantMsgId = crypto.randomUUID()
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: [...c.messages, { id: assistantMsgId, role: 'assistant', content: '' }] }
          : c
      )
    )

    try {
      const historyMessages = (conversations.find((c) => c.id === convId)?.messages ?? [])
        .concat(userMsg)
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyMessages,
          quizMode,
        }),
      })

      if (res.status === 402) {
        setShowPaywall(true)
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? { ...c, messages: c.messages.filter((m) => m.id !== assistantMsgId && m.id !== userMsg.id) }
              : c
          )
        )
        setIsLoading(false)
        return
      }

      if (!res.ok) {
        throw new Error(await res.text())
      }

      // Stream response
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response body')

      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const current = accumulated
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: current } : m
                  ),
                }
              : c
          )
        )
      }

      fetchStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: c.messages.filter((m) => m.id !== assistantMsgId) }
            : c
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canUsePro = userStatus && (
    userStatus.subscriptionTier === 'pro' ||
    userStatus.subscriptionTier === 'max' ||
    userStatus.isAdmin
  )

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      {/* Sidebar */}
      <div className={`flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="gradient-text font-display font-extrabold text-lg">TutorAI</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Status Banner */}
        {userStatus && !userStatus.isAdmin && userStatus.subscriptionTier === 'free' && (
          <div className="mx-3 mt-3 bg-violet-50 border border-violet-200 rounded-2xl p-3">
            <p className="text-violet-700 text-xs font-bold mb-1">
              🎁 Free Trial
            </p>
            <p className="text-violet-600 text-xs">
              {userStatus.questionsRemaining} of 3 questions remaining
            </p>
            <div className="mt-2 bg-violet-200 rounded-full h-1.5">
              <div
                className="bg-violet-600 h-1.5 rounded-full transition-all"
                style={{ width: `${((3 - userStatus.questionsRemaining) / 3) * 100}%` }}
              />
            </div>
            <Link href="/pricing" className="block mt-2 text-xs font-bold text-violet-700 hover:underline">
              Upgrade for unlimited →
            </Link>
          </div>
        )}

        {userStatus?.isAdmin && (
          <div className="mx-3 mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-3">
            <p className="text-amber-700 text-xs font-bold">⭐ Admin Account</p>
            <p className="text-amber-600 text-xs">Unlimited access</p>
          </div>
        )}

        {userStatus && !userStatus.isAdmin && userStatus.subscriptionTier !== 'free' && (
          <div className="mx-3 mt-3 bg-green-50 border border-green-200 rounded-2xl p-3">
            <p className="text-green-700 text-xs font-bold capitalize">
              ✅ {userStatus.subscriptionTier} Plan Active
            </p>
            <p className="text-green-600 text-xs">Unlimited questions</p>
          </div>
        )}

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={createNewConversation}
            className="w-full flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </button>
        </div>

        {/* Pro Features */}
        {canUsePro && (
          <div className="px-3 mb-2">
            <button
              onClick={() => setQuizMode(!quizMode)}
              className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                quizMode
                  ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Quiz Mode
              {quizMode && <span className="ml-auto text-xs bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full">ON</span>}
            </button>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">Recent</p>
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No conversations yet</p>
          ) : (
            <div className="flex flex-col gap-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-colors ${
                    activeConvId === conv.id
                      ? 'bg-violet-100 text-violet-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setActiveConvId(conv.id)}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm flex-1 truncate">{conv.title}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="p-3 border-t border-gray-100">
          <Link href="/pricing" className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-gray-600">Upgrade Plan</span>
          </Link>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-gray-800">
              {activeConv?.title ?? 'TutorAI'}
            </span>
            {quizMode && (
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                Quiz Mode
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto">
              {/* Welcome */}
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-200">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-display font-extrabold text-gray-900 mb-2">
                  Hi{user?.firstName ? `, ${user.firstName}` : ''}! I&apos;m TutorAI 👋
                </h1>
                <p className="text-gray-500 text-lg">
                  Ask me anything — math, science, coding, history, English, and more!
                </p>
                {userStatus && !userStatus.isAdmin && userStatus.subscriptionTier === 'free' && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold">
                    <Lightbulb className="w-4 h-4" />
                    {userStatus.questionsRemaining} free question{userStatus.questionsRemaining !== 1 ? 's' : ''} remaining
                  </div>
                )}
              </div>

              {/* Subject Chips */}
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {SUBJECT_PROMPTS.map((s) => {
                  const Icon = s.icon
                  return (
                    <button
                      key={s.label}
                      onClick={() => setInput(s.prompt + ' ')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${s.color} hover:opacity-80 transition-opacity`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {s.label}
                    </button>
                  )
                })}
              </div>

              {/* Starter prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt.replace(/^[\S]+\s/, ''))}
                    className="text-left p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all duration-200 text-sm text-gray-700 font-medium"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-violet-200">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-3xl px-5 py-3.5 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-tr-lg'
                        : 'bg-white border border-gray-100 shadow-sm rounded-tl-lg'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : msg.content === '' ? (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    ) : (
                      <div className="prose-custom text-sm">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0 mt-1 text-sm font-bold text-gray-600">
                      {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                </div>
              ))}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-100 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end bg-gray-50 border-2 border-gray-200 rounded-2xl focus-within:border-violet-400 focus-within:bg-white transition-all duration-200">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything... math, science, coding, history, English..."
                rows={1}
                className="flex-1 bg-transparent resize-none px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none max-h-36 overflow-y-auto leading-relaxed"
                style={{ minHeight: '48px' }}
              />
              <div className="flex items-center gap-2 px-2 pb-2">
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-violet-200"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Press Enter to send · Shift+Enter for new line · Supports math equations and code
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
