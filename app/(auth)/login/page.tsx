import { Suspense } from 'react'
import LoginForm from './LoginForm'

export const metadata = { title: 'Sign In | EU AC Compliance' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1D5FAB] mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
            EU AC Compliance
          </h1>
          <p className="text-sm text-[#475569] mt-1">Directive (EU) 2026/1021</p>
        </div>

        <Suspense fallback={<div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-8 text-center text-[#94A3B8]">Loading…</div>}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          This is a prototype for demonstrating compliance management per<br />
          Directive (EU) 2026/1021 on anti-corruption measures.
        </p>
      </div>
    </div>
  )
}
