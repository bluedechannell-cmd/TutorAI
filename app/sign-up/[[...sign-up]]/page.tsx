import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="gradient-text font-display font-extrabold text-3xl">TutorAI</span>
      </Link>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 font-bold text-sm px-4 py-2 rounded-full mb-3">
          🎁 3 free questions — no credit card needed
        </div>
      </div>
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'rounded-3xl shadow-2xl border border-gray-100',
            headerTitle: 'font-display font-extrabold text-gray-900',
            formButtonPrimary: 'bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 transition-opacity',
          },
        }}
      />
    </div>
  )
}
