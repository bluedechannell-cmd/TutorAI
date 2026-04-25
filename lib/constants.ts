export const ADMIN_EMAIL = 'bluedechannell@gmail.com'
export const FREE_QUESTIONS_LIMIT = 3

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 9,
    interval: 'month',
    planId: process.env.PAYPAL_STARTER_PLAN_ID,
    features: [
      'All subjects covered',
      'Unlimited questions',
      'Step-by-step explanations',
      'Chat history (30 days)',
      'Mobile friendly',
    ],
  },
  pro: {
    name: 'Pro',
    price: 25,
    interval: 'month',
    planId: process.env.PAYPAL_PRO_PLAN_ID,
    features: [
      'Everything in Starter',
      'Faster AI responses',
      'Quiz mode',
      'Save notes',
      'Progress tracker',
      'Unlimited chat history',
    ],
  },
  max: {
    name: 'Max',
    price: 50,
    interval: 'one-time',
    planId: null,
    features: [
      'Everything in Pro',
      'Lifetime access',
      'Priority support',
      'Downloadable study guides',
      'Early feature access',
      'No monthly fees ever',
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS
