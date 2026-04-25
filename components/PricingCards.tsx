'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Zap, Crown, Infinity } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'

const plans = [
  {
    key: 'starter',
    name: 'Starter',
    price: 9,
    interval: '/month',
    icon: Zap,
    gradient: 'from-blue-400 to-cyan-500',
    shadowColor: 'shadow-blue-200',
    badge: null,
    popular: false,
    features: [
      'All subjects covered',
      'Unlimited questions',
      'Step-by-step explanations',
      'Chat history (30 days)',
      'Mobile friendly',
      'Email support',
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 25,
    interval: '/month',
    icon: Crown,
    gradient: 'from-violet-500 to-purple-700',
    shadowColor: 'shadow-violet-200',
    badge: '⭐ Most Popular',
    popular: true,
    features: [
      'Everything in Starter',
      'Faster AI responses',
      'Quiz mode',
      'Save & organize notes',
      'Progress tracker',
      'Unlimited chat history',
    ],
  },
  {
    key: 'max',
    name: 'Max',
    price: 50,
    interval: ' one-time',
    icon: Infinity,
    gradient: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-amber-200',
    badge: '🔥 Best Value',
    popular: false,
    features: [
      'Everything in Pro',
      'Lifetime access',
      'Priority support',
      'Downloadable study guides',
      'Early feature access',
      'No monthly fees ever',
    ],
  },
]

export default function PricingCards({ showTitle = true }: { showTitle?: boolean }) {
  const { isSignedIn } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (planKey: string) => {
    if (!isSignedIn) {
      window.location.href = '/sign-up'
      return
    }
    setLoading(planKey)
    try {
      const res = await fetch('/api/paypal/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })
      const data = await res.json()
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else {
        alert(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      {showTitle && (
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-100 text-amber-700 font-bold text-sm px-4 py-1.5 rounded-full mb-4">
            💰 Simple Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 mb-4">
            Pick Your Plan
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Start free with 3 questions. Upgrade anytime for unlimited access.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <div
              key={plan.key}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? 'bg-gradient-to-b from-violet-600 to-purple-800 text-white shadow-2xl shadow-violet-300 scale-105'
                  : 'bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold px-4 py-1.5 rounded-full ${
                  plan.popular ? 'bg-amber-400 text-amber-900' : 'bg-orange-100 text-orange-700'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className={`text-2xl font-display font-extrabold mb-1 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>

              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-5xl font-display font-extrabold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  ${plan.price}
                </span>
                <span className={`text-sm font-medium ${plan.popular ? 'text-violet-200' : 'text-gray-500'}`}>
                  {plan.interval}
                </span>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.popular ? 'bg-white/20' : 'bg-violet-100'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-white' : 'text-violet-600'}`} />
                    </span>
                    <span className={plan.popular ? 'text-violet-100' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.key)}
                disabled={loading === plan.key}
                className={`w-full py-3 px-6 rounded-2xl font-bold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                  plan.popular
                    ? 'bg-white text-violet-700 hover:bg-violet-50 shadow-lg'
                    : `bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90 shadow-lg ${plan.shadowColor}`
                }`}
              >
                {loading === plan.key ? 'Redirecting…' : `Get ${plan.name}`}
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-center text-gray-400 text-sm mt-8">
        🔒 Secured by PayPal · Pay with PayPal or any credit/debit card · Cancel anytime
      </p>
    </div>
  )
}
