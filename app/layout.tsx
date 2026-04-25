import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'TutorAI — Your AI Tutor for Every Subject',
  description: 'Get instant, step-by-step explanations on any subject with TutorAI powered by Claude AI.',
  keywords: 'AI tutor, math help, homework help, online tutoring, Claude AI, study help',
  openGraph: {
    title: 'TutorAI — Your AI Tutor for Every Subject',
    description: 'Get instant, step-by-step explanations on any subject with TutorAI.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
