'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import {
  Send, Sparkles, BookOpen, Calculator, FlaskConical, Code2, Globe,
  Brain, Plus, Trash2, MessageSquare, ChevronLeft, ChevronRight,
  Trophy, Paperclip, X, FileText,
} from 'lucide-react'
import Link from 'next/link'

type Attachment = {
  id: string
  name: string
  type: 'image' | 'document' | 'text'
  mediaType: string
  data: string
  preview?: string
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  attachments?: Attachment[]
}

type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const SUBJECT_CHIPS = [
  { label: 'Math',     icon: Calculator, },
  { label: 'Science',  icon: FlaskConical },
  { label: 'Coding',   icon: Code2 },
  { label: 'History',  icon: Globe },
  { label: 'English',  icon: BookOpen },
  { label: 'General',  icon: Brain },
]

const STARTERS = [
  'Solve: 2x² + 5x − 3 = 0 step by step',
  'How does DNA replication work?',
  'Explain recursion in Python with an example',
  'What caused World War I?',
  'How do I write a strong thesis statement?',
  'What is Ohm\'s Law?',
]

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      <span className="dot-bounce w-1.5 h-1.5 rounded-full bg-zinc-500 inline-block" />
      <span className="dot-bounce w-1.5 h-1.5 rounded-full bg-zinc-500 inline-block" />
      <span className="dot-bounce w-1.5 h-1.5 rounded-full bg-zinc-500 inline-block" />
    </div>
  )
}

export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId]   = useState<string | null>(null)
  const [input, setInput]                 = useState('')
  const [attachments, setAttachments]     = useState<Attachment[]>([])
  const [isLoading, setIsLoading]         = useState(false)
  const [sidebarOpen, setSidebarOpen]     = useState(true)
  const [quizMode, setQuizMode]           = useState(false)
  const [error, setError]                 = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLTextAreaElement>(null)
  const fileInputRef   = useRef<HTMLInputElement>(null)

  const activeConv = conversations.find((c) => c.id === activeConvId)
  const messages   = activeConv?.messages ?? []

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])
  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  const newConv = useCallback(() => {
    const id = crypto.randomUUID()
    setConversations((p) => [{ id, title: 'New conversation', messages: [], createdAt: new Date() }, ...p])
    setActiveConvId(id)
  }, [])

  const deleteConv = (id: string) => {
    setConversations((p) => p.filter((c) => c.id !== id))
    if (activeConvId === id) {
      const rest = conversations.filter((c) => c.id !== id)
      setActiveConvId(rest[0]?.id ?? null)
    }
  }

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (evt) => {
        const dataUrl = evt.target?.result as string
        const base64  = dataUrl.split(',')[1]
        const isImg   = file.type.startsWith('image/')
        const isPdf   = file.type === 'application/pdf'
        setAttachments((p) => [...p, {
          id: crypto.randomUUID(),
          name: file.name,
          type: isImg ? 'image' : isPdf ? 'document' : 'text',
          mediaType: file.type || 'text/plain',
          data: base64,
          preview: isImg ? dataUrl : undefined,
        }])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim()
    if ((!content && attachments.length === 0) || isLoading) return

    const convId = activeConvId ?? (() => {
      const id = crypto.randomUUID()
      const title = content.slice(0, 50) || attachments[0]?.name || 'Attachment'
      setConversations((p) => [{ id, title, messages: [], createdAt: new Date() }, ...p])
      setActiveConvId(id)
      return id
    })()

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    }

    setInput('')
    setAttachments([])
    setError(null)

    setConversations((p) => p.map((c) => c.id === convId ? {
      ...c,
      title: c.messages.length === 0 ? (content.slice(0, 50) || attachments[0]?.name || 'Attachment') : c.title,
      messages: [...c.messages, userMsg],
    } : c))

    setIsLoading(true)
    const aiId = crypto.randomUUID()
    setConversations((p) => p.map((c) => c.id === convId ? { ...c, messages: [...c.messages, { id: aiId, role: 'assistant', content: '' }] } : c))

    try {
      const history = (conversations.find((c) => c.id === convId)?.messages ?? [])
        .concat(userMsg)
        .map((m) => ({ role: m.role, content: m.content, attachments: m.attachments }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, quizMode }),
      })

      if (!res.ok) throw new Error(await res.text())

      const reader  = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('No response body')

      let acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        const cur = acc
        setConversations((p) => p.map((c) => c.id === convId ? {
          ...c,
          messages: c.messages.map((m) => m.id === aiId ? { ...m, content: cur } : m),
        } : c))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setConversations((p) => p.map((c) => c.id === convId ? { ...c, messages: c.messages.filter((m) => m.id !== aiId) } : c))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="flex h-screen bg-[#0A0A0B] font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className={`flex flex-col bg-[#111113] border-r border-white/5 transition-all duration-300 flex-shrink-0 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">TutorAI</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="p-1 text-zinc-600 hover:text-zinc-400 rounded transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* New chat */}
        <div className="px-3 py-3">
          <button onClick={newConv} className="w-full flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-white/5 border border-white/8 hover:border-white/15 py-2 px-3 rounded-lg transition-all text-sm font-medium">
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>

        {/* Quiz toggle */}
        <div className="px-3 mb-1">
          <button onClick={() => setQuizMode(!quizMode)} className={`w-full flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${quizMode ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
            <Trophy className="w-4 h-4" />
            Quiz mode
            {quizMode && <span className="ml-auto text-[10px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded-full">ON</span>}
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {conversations.length === 0 ? (
            <p className="text-zinc-700 text-xs text-center py-6">No conversations yet</p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${activeConvId === conv.id ? 'bg-white/8 text-white' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}
                  onClick={() => setActiveConvId(conv.id)}
                >
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1 truncate text-xs">{conv.title}</span>
                  <button onClick={(e) => { e.stopPropagation(); deleteConv(conv.id) }} className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-600 hover:text-red-400 transition-all rounded">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0D0D0E]">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0D0D0E]">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 text-zinc-600 hover:text-zinc-400 rounded-lg hover:bg-white/5 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">{activeConv?.title ?? 'TutorAI'}</span>
            {quizMode && <span className="text-[10px] font-bold bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">Quiz</span>}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="text-center mb-12">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
                  <Sparkles className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">What do you want to learn?</h1>
                <p className="text-zinc-500 text-sm">Ask any question, or attach a photo, PDF, or file.</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {SUBJECT_CHIPS.map((s) => {
                  const Icon = s.icon
                  return (
                    <button key={s.label} onClick={() => { setInput(s.label + ': '); inputRef.current?.focus() }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 border border-white/8 hover:border-white/15 hover:text-white hover:bg-white/5 transition-all">
                      <Icon className="w-3.5 h-3.5" />
                      {s.label}
                    </button>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTERS.map((p) => (
                  <button key={p} onClick={() => handleSend(p)} className="text-left px-4 py-3 rounded-xl border border-white/6 hover:border-white/12 bg-white/[0.02] hover:bg-white/5 text-zinc-400 hover:text-zinc-200 text-sm transition-all duration-150">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                  )}

                  <div className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-[#18181B] border border-white/6 rounded-tl-sm'
                  }`}>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2.5">
                        {msg.attachments.map((att) =>
                          att.preview ? (
                            <img key={att.id} src={att.preview} alt={att.name} className="max-h-48 max-w-[240px] rounded-xl object-contain" />
                          ) : (
                            <div key={att.id} className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1.5 text-xs font-medium">
                              <FileText className="w-3 h-3" />
                              {att.name}
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {msg.role === 'user' ? (
                      msg.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : msg.content === '' ? (
                      <ThinkingDots />
                    ) : (
                      <div className="prose-ai">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 animate-slide-up">
                  {error}
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {attachments.map((att) => (
                  <div key={att.id} className="group relative animate-slide-up">
                    {att.preview ? (
                      <>
                        <img src={att.preview} alt={att.name} className="h-14 w-14 object-cover rounded-lg border border-white/10" />
                        <button onClick={() => setAttachments((p) => p.filter((a) => a.id !== att.id))} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="max-w-[100px] truncate">{att.name}</span>
                        <button onClick={() => setAttachments((p) => p.filter((a) => a.id !== att.id))} className="ml-1 text-zinc-600 hover:text-red-400 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2 bg-[#18181B] border border-white/8 focus-within:border-indigo-500/50 rounded-2xl transition-all duration-200 px-1 py-1">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-zinc-600 hover:text-zinc-400 rounded-xl hover:bg-white/5 transition-all flex-shrink-0 self-end mb-0.5" title="Attach file">
                <Paperclip className="w-4 h-4" />
              </button>

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything…"
                rows={1}
                className="flex-1 bg-transparent resize-none py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none max-h-40 overflow-y-auto leading-relaxed"
                style={{ minHeight: '40px' }}
              />

              <button
                onClick={() => handleSend()}
                disabled={(!input.trim() && attachments.length === 0) || isLoading}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0 self-end mb-0.5"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-zinc-700 mt-2 text-center">
              Enter to send · Shift+Enter for new line · Attach images, PDFs, files
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf,text/*,.txt,.py,.js,.ts,.jsx,.tsx,.html,.css,.json,.csv,.md"
        className="hidden"
        onChange={handleFileAttach}
      />
    </div>
  )
}
