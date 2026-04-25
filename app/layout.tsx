import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TutorAI — AI Tutor Powered by Claude',
  description: 'Get instant, step-by-step explanations on any subject with TutorAI powered by Claude AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
