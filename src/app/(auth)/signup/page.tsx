'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'
import { SignupIllustration } from '@/components/auth/SignupIllustration'

type Role = 'student' | 'teacher' | 'parent'

const ROLE_CONFIG: Record<Role, {
  icon: string
  label: string
  sub: string
  activeRing: string
  activeText: string
  activeIcon: string
}> = {
  student: {
    icon: '🎒',
    label: 'Student',
    sub: "I'm here to learn",
    activeRing: 'border-violet-500',
    activeText: 'text-violet-200',
    activeIcon: 'bg-[rgba(124,58,237,0.18)]',
  },
  teacher: {
    icon: '👩‍🏫',
    label: 'Teacher',
    sub: 'I teach students',
    activeRing: 'border-emerald-500',
    activeText: 'text-emerald-200',
    activeIcon: 'bg-[rgba(5,150,105,0.18)]',
  },
  parent: {
    icon: '👨‍👩‍👧',
    label: 'Parent',
    sub: 'I monitor my child',
    activeRing: 'border-amber-500',
    activeText: 'text-amber-200',
    activeIcon: 'bg-[rgba(217,119,6,0.18)]',
  },
}

const ROLE_REDIRECT: Record<Role, string> = {
  student: '/dashboard',
  teacher: '/dashboard',
  parent: '/dashboard',
}

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [roleError, setRoleError] = useState(false)
  const router = useRouter()

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    setRoleError(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) {
      setRoleError(true)
      setError('Please select your role before continuing.')
      return
    }
    if (!fullName.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (!email.trim()) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: selectedRole,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      })

      if (signUpError) {
        const msg = signUpError.message.toLowerCase()
        if (msg.includes('already registered') || msg.includes('already been registered')) {
          setError('An account with this email already exists. Try signing in.')
        } else if (msg.includes('password')) {
          setError('Password is too weak. Please use at least 6 characters.')
        } else if (msg.includes('email')) {
          setError('Please enter a valid email address.')
        } else if (msg.includes('database error')) {
          setError('Account setup failed. Please try again in a moment.')
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      if (data?.session && data?.user) {
        await supabase.from('profiles').upsert(
          {
            id: data.user.id,
            full_name: fullName.trim(),
            role: selectedRole,
            subscription_tier: 'free',
          },
          { onConflict: 'id' }
        )
        router.push(ROLE_REDIRECT[selectedRole])
        return
      }

      if (data?.user) {
        setSubmitted(true)
        setLoading(false)
        return
      }

      setSubmitted(true)
      setLoading(false)
    } catch (err) {
      console.error('Signup error:', err)
      setError('Something went wrong. Please check your connection and try again.')
      setLoading(false)
    }
  }

  if (submitted) {
    const config = selectedRole ? ROLE_CONFIG[selectedRole] : null
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-base)' }}>
        <div
          className="w-full max-w-md rounded-3xl p-10 text-center"
          style={{
            background: 'var(--bg-card)',
            border: '0.5px solid var(--border-md)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          }}
        >
          <div className="mb-5 text-6xl">📬</div>
          <h2 className="text-2xl font-bold" style={{ color: '#fff' }}>Check your inbox!</h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            We sent a confirmation link to
            <br />
            <span className="font-semibold" style={{ color: 'var(--text)' }}>{email}</span>
          </p>

          {config ? (
            <div
              className={`inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full text-sm font-medium border ${config.activeRing}`}
              style={{
                background:
                  selectedRole === 'student'
                    ? 'rgba(124,58,237,0.12)'
                    : selectedRole === 'teacher'
                      ? 'rgba(5,150,105,0.1)'
                      : 'rgba(217,119,6,0.1)',
                color:
                  selectedRole === 'student'
                    ? '#C4B5FD'
                    : selectedRole === 'teacher'
                      ? '#6EE7B7'
                      : '#FDE68A',
              }}
            >
              <span>{config.icon}</span>
              <span>Signing up as {config.label}</span>
            </div>
          ) : null}

          <div className="mt-6 rounded-2xl p-5 text-left space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Next steps</p>
            {[
              'Open the email from TutorAI',
              'Click "Confirm your account"',
              `You'll be taken straight to your ${selectedRole} dashboard`,
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: 'rgba(124,58,237,0.15)', color: '#C4B5FD' }}
                >
                  {index + 1}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{step}</p>
              </div>
            ))}
          </div>

          <p className="text-xs mt-6" style={{ color: 'var(--text-faint)' }}>
            Didn&apos;t receive it? Check your spam folder or{' '}
            <button onClick={() => { setSubmitted(false); setLoading(false) }} className="underline" style={{ color: 'rgba(139,92,246,0.8)' }}>
              try again
            </button>
          </p>
          <Link href="/login" className="block mt-4 text-sm font-medium" style={{ color: 'rgba(139,92,246,0.9)' }}>
            Already confirmed? Sign in -&gt;
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: 'var(--bg-base)' }}>
      <div className="hidden lg:flex lg:w-[44%] flex-col relative overflow-hidden" style={{ background: '#0F172A', minHeight: '100vh' }}>
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.1) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(109,40,217,0.15)', filter: 'blur(90px)', top: -120, right: -80, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(37,99,235,0.1)', filter: 'blur(70px)', bottom: -60, left: -60, pointerEvents: 'none' }} />

        <div className="relative z-10 flex h-full flex-col" style={{ padding: '40px 36px' }}>
          <div>
            <Link href="/" className="mb-0 flex items-center gap-3 no-underline">
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 0 16px rgba(124,58,237,0.35)' }}>
                🎓
              </div>
              <span style={{ color: '#fff', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.3px' }}>
                TutorAI
              </span>
            </Link>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 40, paddingBottom: 40 }}>
            <SignupIllustration />
            <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.6px', textAlign: 'center', marginBottom: 10 }}>
              Learn without limits.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, lineHeight: 1.65, maxWidth: 240, textAlign: 'center' }}>
              AI that builds your thinking — not just gives you the answer.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-screen overflow-y-auto" style={{ background: 'var(--bg-surface)' }}>
        <div className="w-full max-w-lg px-6 py-10 md:px-10">
          <div className="auth-card-enter rounded-3xl px-6 py-8 md:px-10" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-md)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
            <Link href="/" className="mb-8 flex items-center gap-2 no-underline lg:hidden">
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🎓</div>
              <span className="font-bold text-lg" style={{ color: '#fff' }}>TutorAI</span>
            </Link>

            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#fff' }}>Create your account</h1>
            <p className="text-sm mt-2 mb-8" style={{ color: 'var(--text-muted)' }}>Start learning smarter today -- it&apos;s free.</p>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-3" style={{ color: roleError ? 'rgba(239,68,68,0.9)' : 'rgba(255,255,255,0.7)' }}>
                I am a...{roleError ? <span className="font-normal ml-1" style={{ color: 'rgba(252,165,165,1)' }}>(please select one)</span> : null}
              </p>

              <div className="grid grid-cols-3 gap-3">
                {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([role, cfg]) => {
                  const isActive = selectedRole === role
                  const activeBackground =
                    role === 'student'
                      ? 'rgba(124,58,237,0.12)'
                      : role === 'teacher'
                        ? 'rgba(5,150,105,0.1)'
                        : 'rgba(217,119,6,0.1)'
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-150 select-none text-center ${isActive ? `${cfg.activeRing} shadow-sm scale-[1.02]` : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.18)]'}`}
                      style={{ background: isActive ? activeBackground : 'rgba(255,255,255,0.04)' }}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors duration-150 ${isActive ? cfg.activeIcon : 'bg-[rgba(255,255,255,0.08)]'}`}>
                        {cfg.icon}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold transition-colors duration-150 ${isActive ? cfg.activeText : 'text-white/75'}`}>
                          {cfg.label}
                        </p>
                        <p className="text-xs text-white/25 mt-0.5 leading-tight">{cfg.sub}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-[0.5px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Johnson"
                  autoComplete="name"
                  className="auth-input w-full rounded-xl px-4 py-3 text-sm placeholder:text-white/25 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-[0.5px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="auth-input w-full rounded-xl px-4 py-3 text-sm placeholder:text-white/25 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-[0.5px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className="auth-input w-full rounded-xl px-4 py-3 pr-11 text-sm placeholder:text-white/25 focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="text-sm rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.25)', color: 'rgba(252,165,165,1)' }}>
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-3.5 rounded-2xl text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 hover:opacity-90 active:scale-[0.99]"
                style={{ background: 'var(--grad)', boxShadow: '0 8px 20px rgba(124,58,237,0.2)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  `Create ${selectedRole ? `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} ` : ''}Account ->`
                )}
              </button>

              <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                By signing up you agree to our{' '}
                <Link href="/terms" className="underline" style={{ color: 'rgba(139,92,246,0.8)' }}>Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline" style={{ color: 'rgba(139,92,246,0.8)' }}>Privacy Policy</Link>
              </p>
            </form>

            <p className="text-center mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold" style={{ color: 'rgba(139,92,246,0.9)' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
