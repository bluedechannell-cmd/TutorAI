'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Sparkles, Menu, X } from 'lucide-react'

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
      scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display font-800 text-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text font-extrabold text-2xl">TutorAI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-gray-600 hover:text-violet-600 transition-colors font-medium">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-violet-600 transition-colors font-medium">
            Pricing
          </Link>
          <Link href="/#why-us" className="text-gray-600 hover:text-violet-600 transition-colors font-medium">
            Why Us
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <SignedOut>
            <Link href="/sign-in" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="btn-primary text-sm px-5 py-2">
              Get Started Free
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/chat" className="btn-primary text-sm px-5 py-2">
              Open Tutor
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          <Link href="/#features" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/pricing" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/#why-us" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Why Us</Link>
          <SignedOut>
            <Link href="/sign-in" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link href="/sign-up" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/chat" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Open Tutor</Link>
          </SignedIn>
        </div>
      )}
    </nav>
  )
}
