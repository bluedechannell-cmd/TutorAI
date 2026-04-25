const PAYPAL_BASE =
  process.env.PAYPAL_ENVIRONMENT === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const creds = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })
  const data = await res.json()
  if (!data.access_token) throw new Error(`PayPal token error: ${JSON.stringify(data)}`)
  return data.access_token
}

export async function createSubscription(
  planId: string,
  clerkId: string,
  returnUrl: string,
  cancelUrl: string
) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan_id: planId,
      custom_id: clerkId,
      application_context: {
        brand_name: 'TutorAI',
        user_action: 'SUBSCRIBE_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    }),
  })
  return res.json()
}

export async function getSubscription(subscriptionId: string) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function createOrder(
  amount: string,
  clerkId: string,
  returnUrl: string,
  cancelUrl: string
) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: 'USD', value: amount },
          description: 'TutorAI Max — Lifetime Access',
          custom_id: clerkId,
        },
      ],
      application_context: {
        brand_name: 'TutorAI',
        user_action: 'PAY_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    }),
  })
  return res.json()
}

export async function captureOrder(orderId: string) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}

export async function verifyWebhookSignature(body: {
  auth_algo: string
  cert_url: string
  transmission_id: string
  transmission_sig: string
  transmission_time: string
  webhook_id: string
  webhook_event: unknown
}) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return data.verification_status === 'SUCCESS'
}

export async function setupPlans() {
  const token = await getAccessToken()

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  // Create product
  const productRes = await fetch(`${PAYPAL_BASE}/v1/catalogs/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'TutorAI Tutoring',
      type: 'SERVICE',
      category: 'EDUCATIONAL_AND_TEXTBOOKS',
      description: 'AI-powered tutoring for every subject',
    }),
  })
  const product = await productRes.json()

  const makePlan = (name: string, price: string) =>
    fetch(`${PAYPAL_BASE}/v1/billing/plans`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        product_id: product.id,
        name,
        status: 'ACTIVE',
        billing_cycles: [
          {
            frequency: { interval_unit: 'MONTH', interval_count: 1 },
            tenure_type: 'REGULAR',
            sequence: 1,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: { value: price, currency_code: 'USD' },
            },
          },
        ],
        payment_preferences: { auto_bill_outstanding: true },
      }),
    }).then((r) => r.json())

  const [starter, pro] = await Promise.all([
    makePlan('TutorAI Starter', '9'),
    makePlan('TutorAI Pro', '25'),
  ])

  return { productId: product.id, starterPlanId: starter.id, proPlanId: pro.id }
}
