import Navbar from '@/components/Navbar'
import PricingCards from '@/components/PricingCards'
import Link from 'next/link'
import { Check } from 'lucide-react'

const comparison = [
  { feature: 'All subjects', starter: true, pro: true, max: true },
  { feature: 'Unlimited questions', starter: true, pro: true, max: true },
  { feature: 'Step-by-step explanations', starter: true, pro: true, max: true },
  { feature: 'Chat history (30 days)', starter: true, pro: false, max: false },
  { feature: 'Chat history (unlimited)', starter: false, pro: true, max: true },
  { feature: 'Faster AI responses', starter: false, pro: true, max: true },
  { feature: 'Quiz mode', starter: false, pro: true, max: true },
  { feature: 'Save notes', starter: false, pro: true, max: true },
  { feature: 'Progress tracker', starter: false, pro: true, max: true },
  { feature: 'Priority support', starter: false, pro: false, max: true },
  { feature: 'Downloadable study guides', starter: false, pro: false, max: true },
  { feature: 'Lifetime access', starter: false, pro: false, max: true },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <span className="inline-block bg-amber-100 text-amber-700 font-bold text-sm px-4 py-1.5 rounded-full mb-4">
              💰 Simple, Transparent Pricing
            </span>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-gray-500 text-xl max-w-xl mx-auto mb-8">
              Start free with 3 questions. Upgrade anytime for unlimited learning.
            </p>
          </div>

          {/* Pricing Cards */}
          <PricingCards showTitle={false} />

          {/* Feature Comparison Table */}
          <div className="mt-20">
            <h2 className="text-3xl font-display font-extrabold text-gray-900 text-center mb-10">
              Full Feature Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-4 text-gray-500 font-semibold w-1/2">Feature</th>
                    <th className="text-center py-4 px-4 text-blue-600 font-bold">Starter</th>
                    <th className="text-center py-4 px-4 text-violet-600 font-bold">Pro</th>
                    <th className="text-center py-4 px-4 text-amber-600 font-bold">Max</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="py-3 px-4 text-gray-700 rounded-l-xl">{row.feature}</td>
                      <td className="py-3 px-4 text-center">
                        {row.starter
                          ? <span className="inline-flex w-6 h-6 bg-blue-100 rounded-full items-center justify-center"><Check className="w-3.5 h-3.5 text-blue-600" /></span>
                          : <span className="text-gray-300 text-xl">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.pro
                          ? <span className="inline-flex w-6 h-6 bg-violet-100 rounded-full items-center justify-center"><Check className="w-3.5 h-3.5 text-violet-600" /></span>
                          : <span className="text-gray-300 text-xl">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center rounded-r-xl">
                        {row.max
                          ? <span className="inline-flex w-6 h-6 bg-amber-100 rounded-full items-center justify-center"><Check className="w-3.5 h-3.5 text-amber-600" /></span>
                          : <span className="text-gray-300 text-xl">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-extrabold text-gray-900 text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  q: 'Can I cancel my subscription anytime?',
                  a: 'Yes! You can cancel your Starter or Pro subscription at any time. Your access continues until the end of the billing period.',
                },
                {
                  q: 'What does the free trial include?',
                  a: 'Every new account gets 3 free questions to try TutorAI on any subject. No credit card required.',
                },
                {
                  q: 'Is the Max plan really a one-time payment?',
                  a: 'Yes! The Max plan is a single $50 payment that gives you lifetime access to all Pro features plus extras — no monthly fees ever.',
                },
                {
                  q: 'What subjects are covered?',
                  a: 'TutorAI covers 50+ subjects including all math levels, biology, chemistry, physics, history, English, literature, coding (all languages), foreign languages, test prep, and more.',
                },
                {
                  q: 'Is it suitable for all ages?',
                  a: 'Absolutely! TutorAI adapts its language and explanations based on your questions — whether you\'re in elementary school or pursuing a PhD.',
                },
              ].map((faq) => (
                <div key={faq.q} className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-display font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-500 mb-4">Still have questions?</p>
            <Link href="/sign-up" className="btn-primary inline-flex items-center gap-2">
              Start Free — 3 Questions on Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
