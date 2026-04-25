'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Sparkles, XCircle, Loader2 } from 'lucide-react'

function SuccessContent() {
  const params = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const plan = params.get('plan')
    const subscriptionId = params.get('subscription_id')
    const token = params.get('token') // order ID for Max, or subscription BA token

    // No plan param = direct navigation to /success, just show success
    if (!plan) {
      setStatus('success')
      return
    }

    const activate = async () => {
      try {
        const res = await fetch('/api/paypal/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, subscriptionId, token }),
        })
        setStatus(res.ok ? 'success' : 'error')
      } catch {
        setStatus('error')
      }
    }

    activate()
  }, [params])

  if (status === 'loading') {
    return (
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-display font-extrabold text-gray-900 mb-2">
          Activating your plan…
        </h1>
        <p className="text-gray-500">Confirming your payment with PayPal.</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-display font-extrabold text-gray-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-8">
          We couldn&apos;t confirm your payment. If you were charged, please contact support.
        </p>
        <Link href="/pricing" className="btn-primary inline-block">
          Back to Pricing
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="gradient-text font-display font-extrabold text-2xl">TutorAI</span>
      </div>
      <h1 className="text-3xl font-display font-extrabold text-gray-900 mb-3">
        You&apos;re All Set! 🎉
      </h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
        Your subscription is active. You now have full access to TutorAI.
        Start learning anything, anytime!
      </p>
      <Link href="/chat" className="btn-primary block text-center text-lg py-4">
        Start Learning Now
      </Link>
      <p className="text-gray-400 text-sm mt-4">
        Check your email for your PayPal receipt.
      </p>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
        <Suspense fallback={
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-violet-600 animate-spin mx-auto" />
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  )
}
