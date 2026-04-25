'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import {
  Send, Sparkles, BookOpen, Calculator, FlaskConical, Code2, Globe,
  Brain, Plus, Trash2, MessageSquare, ChevronLeft, ChevronRight,
  Trophy, Loader2, Paperclip, X, FileText, Image as ImageIcon,
} from 'lucide-react'
import Link from 'next/link'

type Attachment = {
  id: string
  name: string
  type: 'image' | 'document' | 'text'
  mediaType: string
  data: string // base64
  preview?: string // data URL for image previews
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

export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [quizMode, setQuizMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeConv = conversations.find((c) => c.id === activeConvId)
  const messages = activeConv?.messages ?? []

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  const createNewConversation = () => {
    const id = crypto.randomUUID()
    setConversations((prev) => [{ id, title: 'New conversation', messages: [], createdAt: new Date() }, ...prev])
    setActiveConvId(id)
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeConvId === id) {
      const remaining = conversations.filter((c) => c.id !== id)
      setActiveConvId(remaining[0]?.id ?? null)
    }
  }

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (evt) => {
        const dataUrl = evt.target?.result as string
        const base64 = dataUrl.split(',')[1]
        const isImage = file.type.startsWith('image/')
        const isPdf = file.type === 'application/pdf'

        setAttachments((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            name: file.name,
            type: isImage ? 'image' : isPdf ? 'document' : 'text',
            mediaType: file.type || 'text/plain',
            data: base64,
            preview: isImage ? dataUrl : undefined,
          },
        ])
      }
      reader.readAsDataURL(file)
    })

    // reset so same file can be re-attached
    e.target.value = ''
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim()
    if ((!content && attachments.length === 0) || isLoading) return

    const convId = activeConvId ?? (() => {
      const id = crypto.randomUUID()
      setConversations((prev) => [{ id, title: content.slice(0, 40) || attachments[0]?.name || 'Attachment', messages: [], createdAt: new Date() }, ...prev])
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

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, title: c.messages.length === 0 ? (content.slice(0, 50) || attachments[0]?.name || 'Attachment') : c.title, messages: [...c.messages, userMsg] }
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
      const history = (conversations.find((c) => c.id === convId)?.messages ?? [])
        .concat(userMsg)
        .map((m) => ({ role: m.role, content: m.content, attachments: m.attachments }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, quizMode }),
      })

      if (!res.ok) throw new Error(await res.text())

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
              ? { ...c, messages: c.messages.map((m) => m.id === assistantMsgId ? { ...m, content: current } : m) }
              : c
          )
        )
      }
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

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className={`flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="gradient-text font-display font-extrabold text-lg">TutorAI</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={createNewConversation}
            className="w-full flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </button>
        </div>

        <div className="px-3 mb-2">
          <button
            onClick={() => setQuizMode(!quizMode)}
            className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${quizMode ? 'bg-amber-100 text-amber-700 border-2 border-amber-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            <Trophy className="w-4 h-4" />
            Quiz Mode
            {quizMode && <span className="ml-auto text-xs bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full">ON</span>}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">Recent</p>
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No conversations yet</p>
          ) : (
            <div className="flex flex-col gap-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-colors ${activeConvId === conv.id ? 'bg-violet-100 text-violet-700' : 'hover:bg-gray-100 text-gray-700'}`}
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
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-gray-800">{activeConv?.title ?? 'TutorAI'}</span>
            {quizMode && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">Quiz Mode</span>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-200">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-display font-extrabold text-gray-900 mb-2">Hi! I&apos;m TutorAI 👋</h1>
                <p className="text-gray-500 text-lg">Ask me anything — or attach a photo, PDF, or file!</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {SUBJECT_PROMPTS.map((s) => {
                  const Icon = s.icon
                  return (
                    <button key={s.label} onClick={() => setInput(s.prompt + ' ')} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${s.color} hover:opacity-80 transition-opacity`}>
                      <Icon className="w-3.5 h-3.5" />
                      {s.label}
                    </button>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STARTER_PROMPTS.map((prompt) => (
                  <button key={prompt} onClick={() => handleSend(prompt.replace(/^[\S]+\s/, ''))} className="text-left p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all duration-200 text-sm text-gray-700 font-medium">
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-violet-200">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-3xl px-5 py-3.5 ${msg.role === 'user' ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-tr-lg' : 'bg-white border border-gray-100 shadow-sm rounded-tl-lg'}`}>
                    {/* Attachments in the message bubble */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {msg.attachments.map((att) =>
                          att.preview ? (
                            <img key={att.id} src={att.preview} alt={att.name} className="max-h-48 max-w-xs rounded-xl object-contain bg-white/10" />
                          ) : (
                            <div key={att.id} className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2 py-1 text-xs font-medium">
                              <FileText className="w-3.5 h-3.5" />
                              {att.name}
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {msg.role === 'user' ? (
                      msg.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : msg.content === '' ? (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    ) : (
                      <div className="prose-custom text-sm">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0 mt-1 text-sm font-bold text-gray-600">U</div>
                  )}
                </div>
              ))}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">{error}</div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-100 px-4 py-4">
          <div className="max-w-3xl mx-auto">

            {/* Attachment previews */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {attachments.map((att) => (
                  <div key={att.id} className="relative group">
                    {att.preview ? (
                      <div className="relative">
                        <img src={att.preview} alt={att.name} className="h-16 w-16 object-cover rounded-xl border-2 border-violet-200" />
                        <button onClick={() => removeAttachment(att.id)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative flex items-center gap-1.5 bg-violet-50 border-2 border-violet-200 rounded-xl px-3 py-2 text-xs font-medium text-violet-700">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="max-w-[120px] truncate">{att.name}</span>
                        <button onClick={() => removeAttachment(att.id)} className="ml-1 text-violet-400 hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="relative flex items-end bg-gray-50 border-2 border-gray-200 rounded-2xl focus-within:border-violet-400 focus-within:bg-white transition-all duration-200">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything, or attach a photo/file…"
                rows={1}
                className="flex-1 bg-transparent resize-none px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none max-h-36 overflow-y-auto leading-relaxed"
                style={{ minHeight: '48px' }}
              />
              <div className="flex items-center gap-1 px-2 pb-2">
                {/* Attach button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 text-gray-400 hover:text-violet-600 rounded-xl flex items-center justify-center hover:bg-violet-50 transition-colors"
                  title="Attach image, PDF, or file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Send button */}
                <button
                  onClick={() => handleSend()}
                  disabled={(!input.trim() && attachments.length === 0) || isLoading}
                  className="w-9 h-9 bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-violet-200"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-2 text-center">
              Press Enter to send · Attach photos, PDFs, or text files
            </p>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
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
