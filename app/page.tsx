'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Brain, Calculator, Code2, BookOpen, FlaskConical, Globe, Check, MessageSquare, Paperclip, Zap } from 'lucide-react'
import Navbar from '@/components/Navbar'

const features = [
  { icon: Brain,       title: 'Any Subject',        desc: 'Math, science, history, coding, literature, languages — all covered in depth.' },
  { icon: Calculator,  title: 'Step-by-Step Math',  desc: 'Full working shown for every problem. Algebra, calculus, statistics and more.' },
  { icon: Code2,       title: 'Coding Tutor',        desc: 'Debug code, learn new languages, and understand programming concepts clearly.' },
  { icon: Paperclip,   title: 'File Attachments',    desc: 'Upload photos, PDFs, or code files and get explanations based on your actual work.' },
  { icon: Zap,         title: 'Instant Answers',     desc: 'No waiting, no scheduling. Get clear explanations the moment you ask.' },
  { icon: BookOpen,    title: 'Any Level',           desc: 'Adapts explanations from elementary to PhD level based on how you ask.' },
]

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'Computer Science', 'Economics', 'Literature', 'Languages', 'Statistics', 'Philosophy']

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(99,102,241,0.18)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(139,92,246,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_90%,rgba(59,130,246,0.08)_0%,transparent_60%)]" />

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-32">
          <div className="inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold px-4 py-2 rounded-full mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Claude AI — Anthropic
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Your personal
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400" style={{ backgroundSize: '200%', animation: 'gradientShift 5s ease infinite' }}>
              AI tutor
            </span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Ask any academic question. Attach photos, PDFs, or files.
            Get clear, step-by-step explanations instantly — for every subject, every level.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/chat" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25">
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/#features" className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold text-base px-8 py-3.5 rounded-xl transition-all duration-200">
              See Features
            </Link>
          </div>

          {/* Floating chat preview */}
          <div className="mt-20 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-[#111113] border border-white/8 rounded-2xl p-6 text-left shadow-2xl shadow-black/50">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-zinc-600 font-mono">tutorai — chat</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xs">
                    Can you explain how neural networks learn?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="bg-[#18181B] border border-white/6 text-zinc-300 text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-md leading-relaxed">
                    Neural networks learn through a process called <span className="text-indigo-300 font-medium">backpropagation</span>. Here&apos;s how it works step by step:<br /><br />
                    <span className="text-zinc-400">1. Forward pass — data flows through layers<br />
                    2. Loss calculation — measures how wrong the prediction was<br />
                    3. Backward pass — adjusts weights to reduce error</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUBJECTS STRIP */}
      <section className="border-y border-white/5 bg-white/[0.02] py-6 overflow-hidden">
        <div className="flex gap-8 animate-none">
          <div className="flex gap-8 flex-shrink-0 overflow-x-auto px-8 pb-1 w-full justify-center flex-wrap">
            {subjects.map((s) => (
              <span key={s} className="text-zinc-500 text-sm font-medium whitespace-nowrap hover:text-zinc-300 transition-colors cursor-default">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4 block">What it can do</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Everything you need to learn
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              Not a search engine. A real tutor that explains, guides, and adapts to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="group bg-[#111113] hover:bg-[#141416] border border-white/6 hover:border-white/10 rounded-2xl p-6 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-600/30 transition-colors">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-28 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4 block">Simple as it gets</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Open the chat', desc: 'Go to the tutor. No sign-up, no account needed. Just open and start.' },
              { step: '02', title: 'Ask anything', desc: 'Type your question or attach a photo, PDF, or file. Any subject, any level.' },
              { step: '03', title: 'Get your answer', desc: 'Receive a clear, step-by-step explanation tailored to exactly what you asked.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-4">
                <div className="text-6xl font-extrabold text-white/5 font-mono">{item.step}</div>
                <h3 className="text-white font-semibold text-lg -mt-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] absolute inset-0 pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Ready to learn anything?
          </h2>
          <p className="text-zinc-500 text-lg mb-8">
            Open the AI tutor and ask your first question right now.
          </p>
          <Link href="/chat" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25">
            Open TutorAI
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold">TutorAI</span>
          </div>
          <p className="text-zinc-600 text-sm">Powered by Claude AI · Anthropic</p>
          <div className="flex gap-6">
            <Link href="/#features" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">Features</Link>
            <Link href="/chat" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">Chat</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
