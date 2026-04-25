'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0A0A0B]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">TutorAI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Features</Link>
          <Link href="/#how" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">How It Works</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/chat"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
          >
            Open Tutor
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button className="md:hidden p-2 text-zinc-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#111113] border-t border-white/5 px-4 py-4 flex flex-col gap-3">
          <Link href="/#features" className="text-zinc-300 font-medium py-2 text-sm" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/#how" className="text-zinc-300 font-medium py-2 text-sm" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link href="/chat" className="bg-indigo-600 text-white font-semibold text-center py-2.5 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Open Tutor</Link>
        </div>
      )}
    </nav>
  )
}
