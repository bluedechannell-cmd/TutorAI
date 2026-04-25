'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import {
  Sparkles, Brain, Calculator, FlaskConical, Code2, BookOpen,
  Globe, Music, ArrowRight, Star, Users, Zap, Shield, Trophy,
  ChevronRight, MessageSquare, Check
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import AnimatedSection from '@/components/AnimatedSection'
import PricingCards from '@/components/PricingCards'

const subjects = [
  { icon: Calculator, label: 'Math', color: 'bg-blue-100 text-blue-600' },
  { icon: FlaskConical, label: 'Science', color: 'bg-green-100 text-green-600' },
  { icon: BookOpen, label: 'English', color: 'bg-purple-100 text-purple-600' },
  { icon: Code2, label: 'Coding', color: 'bg-orange-100 text-orange-600' },
  { icon: Globe, label: 'History', color: 'bg-amber-100 text-amber-600' },
  { icon: Music, label: 'Arts', color: 'bg-pink-100 text-pink-600' },
]

const stats = [
  { value: '50+', label: 'Subjects Covered', icon: BookOpen },
  { value: '24/7', label: 'Always Available', icon: Zap },
  { value: '100%', label: 'Personalized', icon: Brain },
]

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Explanations',
    desc: 'Claude AI breaks down every concept into clear, digestible steps tailored to your level.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Calculator,
    title: 'Math & Equations',
    desc: 'Type any equation or math problem and get full step-by-step solutions with explanations.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Code2,
    title: 'Coding Tutor',
    desc: 'Get commented code, debugging help, and clear explanations for any programming language.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Trophy,
    title: 'Quiz Mode (Pro)',
    desc: 'Test your knowledge with AI-generated quizzes tailored to what you just learned.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Save Notes (Pro)',
    desc: 'Bookmark AI explanations as personal study notes to review anytime.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Users,
    title: 'Any Age, Any Level',
    desc: 'Whether you\'re 8 or 80, TutorAI adapts its explanations to your grade level.',
    color: 'from-indigo-500 to-violet-500',
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    grade: '10th Grade',
    text: 'TutorAI helped me go from a C to an A in calculus. The step-by-step breakdowns are amazing!',
    stars: 5,
  },
  {
    name: 'James K.',
    grade: 'College Sophomore',
    text: 'I use it for coding and chemistry. It explains things better than my professors honestly.',
    stars: 5,
  },
  {
    name: 'Maria L.',
    grade: 'Parent',
    text: 'My kids love using TutorAI for homework. It\'s patient, fun, and always available.',
    stars: 5,
  },
]

export default function LandingPage() {
  const floatingRef1 = useRef<HTMLDivElement>(null)
  const floatingRef2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame: number
    let t = 0
    const animate = () => {
      t += 0.01
      if (floatingRef1.current) {
        floatingRef1.current.style.transform = `translateY(${Math.sin(t) * 18}px) rotate(${Math.sin(t * 0.5) * 5}deg)`
      }
      if (floatingRef2.current) {
        floatingRef2.current.style.transform = `translateY(${Math.sin(t + 2) * 15}px) rotate(${Math.cos(t * 0.5) * 5}deg)`
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden pt-16">
        {/* Background blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center py-20">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-bold px-4 py-2 rounded-full mb-6 animate-bounce-slow">
              <Sparkles className="w-4 h-4" />
              Powered by Claude AI
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-gray-900 leading-tight mb-6">
              Learn <span className="gradient-text">Anything.</span>{' '}
              Master{' '}
              <span className="gradient-text">Everything.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-xl">
              Your personal AI tutor for every subject and every age. Get instant,
              step-by-step explanations tailored just for you — available 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sign-up" className="btn-primary text-center text-lg px-8 py-4 flex items-center justify-center gap-2">
                Start Now — It&apos;s Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/#features" className="btn-outline text-center text-lg px-8 py-4">
                See How It Works
              </Link>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              ✨ 3 free questions included · No credit card required
            </p>
          </div>

          {/* Right - floating cards */}
          <div className="relative hidden md:flex items-center justify-center h-[480px]">
            {/* Main card */}
            <div
              ref={floatingRef1}
              className="absolute bg-white rounded-3xl shadow-2xl p-6 w-72 transition-none"
              style={{ top: '50px', right: '20px' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-800 font-display">TutorAI</span>
              </div>
              <div className="bg-violet-50 rounded-2xl p-3 mb-2">
                <p className="text-xs font-medium text-gray-500 mb-1">You asked:</p>
                <p className="text-sm text-gray-800">How do I solve quadratic equations?</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-3">
                <p className="text-xs font-medium text-violet-600 mb-1">TutorAI explains:</p>
                <p className="text-sm text-gray-600">Step 1: Write in standard form ax² + bx + c = 0...</p>
              </div>
            </div>

            {/* Secondary card */}
            <div
              ref={floatingRef2}
              className="absolute bg-gradient-to-br from-violet-600 to-blue-600 rounded-3xl shadow-2xl p-5 w-52 text-white transition-none"
              style={{ bottom: '60px', left: '30px' }}
            >
              <div className="text-3xl font-display font-extrabold mb-1">50+</div>
              <p className="text-sm text-violet-200">Subjects covered</p>
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {subjects.slice(0, 4).map((s) => (
                  <span key={s.label} className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats pill */}
            <div className="absolute top-10 left-0 bg-amber-400 text-amber-900 rounded-2xl px-4 py-2 font-bold text-sm shadow-lg">
              ⭐ 5/5 Rating
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xs">Scroll to explore</span>
          <ChevronRight className="w-4 h-4 rotate-90 animate-bounce" />
        </div>
      </section>

      {/* SUBJECTS STRIP */}
      <section className="bg-gradient-to-r from-violet-600 to-blue-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {subjects.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="flex items-center gap-2 text-white/90">
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{s.label}</span>
                </div>
              )
            })}
            <div className="flex items-center gap-2 text-white/90">
              <span className="font-semibold">+ 44 more</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS TUTORAI */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="left">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-blue-100 rounded-3xl transform rotate-3" />
              <div className="relative bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-display font-bold text-gray-800 text-lg">Chat with your tutor</span>
                </div>

                {[
                  { role: 'user', text: 'Can you explain photosynthesis?' },
                  { role: 'ai', text: '🌱 Sure! Photosynthesis is how plants make food using sunlight...\n\nStep 1: Plants absorb sunlight through chlorophyll\nStep 2: Water (H₂O) is absorbed from roots...' },
                  { role: 'user', text: 'What\'s the chemical equation?' },
                  { role: 'ai', text: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n\nBreaking it down: 6 carbon dioxide molecules + 6 water molecules produce glucose + 6 oxygen molecules.' },
                ].map((msg, i) => (
                  <div
                    key={i}
                    className={`mb-3 ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-tr-sm'
                        : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <span className="inline-block bg-violet-100 text-violet-700 font-bold text-sm px-4 py-1.5 rounded-full mb-4">
              🤖 What is TutorAI?
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 mb-6 leading-tight">
              Your personal AI tutor,{' '}
              <span className="gradient-text">available anytime</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              TutorAI uses Claude — one of the world&apos;s most advanced AI models — to give you
              clear, step-by-step explanations on any topic. Whether you&apos;re struggling with
              calculus, writing an essay, or learning to code, TutorAI is ready to help.
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {[
                'Explains concepts at your level',
                'Shows all work for math problems',
                'Supports equations and code',
                'Encourages you every step of the way',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-violet-600" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/sign-up" className="btn-primary inline-flex items-center gap-2">
              Try It Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* STATS */}
      <section className="section-padding bg-gradient-to-br from-violet-50 to-blue-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <AnimatedSection key={stat.label} delay={i * 100}>
                  <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-white card-hover">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-5xl font-display font-extrabold gradient-text mb-2">{stat.value}</div>
                    <div className="text-gray-500 font-medium">{stat.label}</div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block bg-blue-100 text-blue-700 font-bold text-sm px-4 py-1.5 rounded-full mb-4">
              💡 Why TutorAI?
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 mb-4">
              Better than a human tutor<br />
              <span className="gradient-text">and way more affordable</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Traditional tutors cost $50–$150 per hour. TutorAI gives you unlimited help,
              any time, on any subject, for a fraction of the price.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '⚡',
                title: 'Instant Answers',
                desc: 'No scheduling, no waiting. Get answers in seconds, day or night.',
                color: 'bg-amber-50 border-amber-200',
              },
              {
                emoji: '🎯',
                title: 'Perfectly Personalized',
                desc: 'Adapts explanations to your age, grade level, and learning style.',
                color: 'bg-violet-50 border-violet-200',
              },
              {
                emoji: '💰',
                title: 'Fraction of the Cost',
                desc: 'Starting at $9/month vs. $50–$150/hour for a human tutor.',
                color: 'bg-blue-50 border-blue-200',
              },
              {
                emoji: '📚',
                title: 'Every Subject',
                desc: 'Math, science, history, coding, literature, languages — all covered.',
                color: 'bg-green-50 border-green-200',
              },
              {
                emoji: '🔒',
                title: 'Safe & Private',
                desc: 'Your questions are private and your data is secure.',
                color: 'bg-pink-50 border-pink-200',
              },
              {
                emoji: '🌍',
                title: 'All Ages Welcome',
                desc: 'Whether you\'re 8 or 80, TutorAI adjusts to your level.',
                color: 'bg-orange-50 border-orange-200',
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 80}>
                <div className={`rounded-2xl p-6 border-2 ${item.color} card-hover h-full`}>
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section-padding bg-gradient-to-br from-gray-50 to-violet-50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block bg-violet-100 text-violet-700 font-bold text-sm px-4 py-1.5 rounded-full mb-4">
              ✨ Features
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 mb-4">
              Everything you need to{' '}
              <span className="gradient-text">ace any subject</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <AnimatedSection key={f.title} delay={i * 80}>
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 card-hover h-full">
                    <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-2">{f.title}</h3>
                    <p className="text-gray-500">{f.desc}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block bg-amber-100 text-amber-700 font-bold text-sm px-4 py-1.5 rounded-full mb-4">
              ❤️ Students Love TutorAI
            </span>
            <h2 className="text-4xl font-display font-extrabold text-gray-900 mb-4">
              Real students, real results
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 100}>
                <div className="bg-gradient-to-br from-gray-50 to-violet-50 rounded-3xl p-8 border border-gray-100 card-hover">
                  <div className="flex gap-1 mb-4">
                    {Array(t.stars).fill(0).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <p className="text-gray-400 text-sm">{t.grade}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section-padding bg-gradient-to-br from-violet-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <PricingCards showTitle={true} />
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-4 gradient-bg">
        <div className="max-w-3xl mx-auto text-center text-white">
          <AnimatedSection>
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Ready to ace your next exam?
            </h2>
            <p className="text-violet-200 text-xl mb-8">
              Join thousands of students already learning smarter with TutorAI.
            </p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold text-lg px-10 py-4 rounded-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-violet-300 text-sm mt-4">3 free questions · No credit card required</p>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-display font-extrabold text-xl">TutorAI</span>
              </div>
              <p className="text-sm leading-relaxed">
                Your AI tutor for every subject and every age, powered by Claude AI.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="flex flex-col gap-2 text-sm">
                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/sign-up" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Subjects</h4>
              <ul className="flex flex-col gap-2 text-sm">
                <li>Mathematics</li>
                <li>Science</li>
                <li>Coding</li>
                <li>History</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="flex flex-col gap-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2025 TutorAI. All rights reserved.</p>
            <p className="text-sm">Built with ❤️ using Claude AI by Anthropic</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
