'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DEMO_USERS } from '@/types'
import type { DemoUser } from '@/types'

const roleBadgeColour: Record<string, string> = {
  CCO:          'bg-purple-100 text-purple-800',
  CO:           'bg-blue-100 text-blue-800',
  LINE_MANAGER: 'bg-amber-100 text-amber-800',
  EMPLOYEE:     'bg-slate-100 text-slate-700',
  CONF_INV:     'bg-red-100 text-red-800',
  AUDIT:        'bg-green-100 text-green-800',
  SCHEDULER:    'bg-gray-100 text-gray-600',
}

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'

  const [selected, setSelected] = useState<DemoUser>(DEMO_USERS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignIn() {
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email: selected.email,
      password: selected.password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Invalid credentials')
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-8">
      <h2 className="text-lg font-semibold text-[#0F172A] mb-1">Demo Login</h2>
      <p className="text-sm text-[#475569] mb-6">Select a role to explore the compliance platform.</p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#0F172A] mb-2">Demo Account</label>
        <div className="space-y-2">
          {DEMO_USERS.map((user) => (
            <button
              key={user.email}
              onClick={() => setSelected(user)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left ${
                selected.email === user.email
                  ? 'border-[#1D5FAB] bg-[#E8F2FB]'
                  : 'border-[#E2E8F0] hover:border-[#1D5FAB] hover:bg-[#F8FAFC]'
              }`}
            >
              <div>
                <span className="font-medium text-sm text-[#0F172A]">{user.name}</span>
                <span className="block text-xs text-[#475569]">{user.email}</span>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleBadgeColour[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                {user.role}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleSignIn}
        disabled={loading}
        className="w-full py-3 px-4 bg-[#1D5FAB] hover:bg-[#1a5298] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
      >
        {loading ? 'Signing in…' : `Sign in as ${selected.name}`}
      </button>

      <p className="text-center text-xs text-[#94A3B8] mt-4">
        All accounts use password: <code className="bg-slate-100 px-1.5 py-0.5 rounded">demo123</code>
      </p>
    </div>
  )
}
