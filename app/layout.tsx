import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EU AC Compliance | Directive (EU) 2026/1021',
  description: 'Corporate compliance management platform for EU Anti-Corruption Directive (EU) 2026/1021',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
