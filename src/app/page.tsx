import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text)' }}>
      <nav
        className="landing-nav px-6 md:px-20"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(7,9,26,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '0.5px solid var(--border)',
          paddingTop: 14,
          paddingBottom: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'var(--grad)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              boxShadow: '0 4px 12px rgba(124,58,237,0.28)',
            }}
          >
            🎓
          </div>
          <span
            style={{
              fontFamily: "var(--font-sora, 'Sora', sans-serif)",
              fontSize: 17,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.4px',
            }}
          >
            TutorAI
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/login"
            style={{
              border: '0.5px solid rgba(255,255,255,0.15)',
              background: 'transparent',
              color: 'var(--text-muted)',
              borderRadius: 9,
              padding: '7px 18px',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            style={{
              background: 'var(--grad)',
              color: '#fff',
              borderRadius: 9,
              padding: '8px 20px',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(124,58,237,0.28)',
            }}
          >
            Get started free
          </Link>
        </div>
      </nav>

      <section
        className="hero-padding px-6 md:px-20"
        style={{
          background: 'linear-gradient(160deg, #07091A 0%, #0F0A24 50%, #07091A 100%)',
          paddingTop: 96,
          paddingBottom: 80,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.06) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.11) 0%, transparent 65%)',
            top: -300,
            left: -200,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 65%)',
            top: -200,
            right: -180,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 65%)',
            bottom: -200,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.35)',
              borderRadius: 100,
              padding: '5px 14px',
              fontSize: 12,
              color: '#C4B5FD',
              fontWeight: 600,
              marginBottom: 28,
              boxShadow: '0 2px 8px rgba(124,58,237,0.1)',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', display: 'inline-block' }} />
            AI-powered education platform
          </div>

          <h1
            style={{
              fontFamily: "var(--font-sora, 'Sora', sans-serif)",
              fontSize: 'clamp(44px, 6.5vw, 80px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-2.5px',
              marginBottom: 22,
              background: 'linear-gradient(160deg, #fff 35%, rgba(255,255,255,0.5))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The smarter way to
            <br />
            learn anything.
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(15px, 1.5vw, 19px)',
              lineHeight: 1.7,
              maxWidth: 640,
              margin: '0 auto 40px',
            }}
          >
            Personalized AI tutoring that guides students to answers instead of giving them away.
            Built for students, teachers, and parents.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 64, flexWrap: 'wrap' }}>
            <Link
              href="/signup"
              style={{
                background: 'var(--grad)',
                borderRadius: 14,
                padding: '15px 38px',
                fontFamily: "var(--font-sora, 'Sora', sans-serif)",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(124,58,237,0.28)',
              }}
            >
              Start learning free →
            </Link>
            <Link
              href="/login"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '0.5px solid rgba(255,255,255,0.14)',
                borderRadius: 14,
                padding: '15px 38px',
                color: 'rgba(255,255,255,0.75)',
                textDecoration: 'none',
                fontSize: 15,
              }}
            >
              Sign in to dashboard
            </Link>
          </div>

          <div
            style={{
              maxWidth: 760,
              margin: '0 auto',
              background: 'var(--bg-surface)',
              border: '0.5px solid rgba(124,58,237,0.22)',
              borderRadius: 22,
              overflow: 'hidden',
              boxShadow: '0 20px 56px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '0.5px solid var(--border)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                {['#FF5F57', '#FFBD2E', '#28C840'].map((color) => (
                  <span key={color} style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                ))}
              </div>
              <div style={{ margin: '0 auto', fontSize: 12, color: 'var(--text-muted)' }}>TutorAI · Math · Grade 8 · Algebra</div>
              <div
                style={{
                  background: 'rgba(52,211,153,0.15)',
                  color: '#34D399',
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 100,
                  padding: '3px 10px',
                }}
              >
                ● Live
              </div>
            </div>

            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { role: 'ai', text: "Hi! Let's tackle this together. When you see x² + 5x + 6 = 0, what's the first thing you'd try?" },
                { role: 'user', text: 'I think I need to factor it?' },
                { role: 'ai', text: 'Exactly! 🎉 Now - can you find two numbers that multiply to 6 and add up to 5?' },
                { role: 'user', text: '2 and 3?' },
                { role: 'ai', text: 'Perfect! 🌟 2 × 3 = 6 and 2 + 3 = 5. So now can you write the factored form? It looks like (x + ?)(x + ?).' },
              ].map((message, index) =>
                message.role === 'ai' ? (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 10,
                        background: 'var(--grad)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      🎓
                    </div>
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '0.5px solid rgba(255,255,255,0.1)',
                        borderRadius: '4px 14px 14px 14px',
                        padding: '10px 13px',
                        fontSize: 13.5,
                        color: 'var(--text)',
                        maxWidth: '82%',
                        lineHeight: 1.6,
                        textAlign: 'left',
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                ) : (
                  <div
                    key={index}
                    style={{
                      alignSelf: 'flex-end',
                      background: 'rgba(124,58,237,0.45)',
                      color: 'rgba(255,255,255,0.92)',
                      borderRadius: '18px 18px 4px 18px',
                      padding: '10px 13px',
                      fontSize: 13.5,
                      maxWidth: '72%',
                      lineHeight: 1.6,
                      textAlign: 'left',
                    }}
                  >
                    {message.text}
                  </div>
                )
              )}
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderTop: '0.5px solid rgba(255,255,255,0.1)',
                padding: '10px 14px',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 9,
                  color: 'var(--text-faint)',
                  padding: '10px 14px',
                  fontSize: 12,
                  textAlign: 'left',
                }}
              >
                Ask your tutor anything...
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'var(--grad)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 13,
                }}
              >
                ↑
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="landing-section-padding"
        style={{
          background: 'linear-gradient(90deg, #7C3AED 0%, #4F46E5 50%, #2563EB 100%)',
          padding: '28px 80px',
          width: '100%',
        }}
      >
        <div className="stats-grid-4" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }}>
          {[
            { value: '10k+', label: 'Active learners' },
            { value: '4', label: 'Core subjects' },
            { value: '3', label: 'Roles supported' },
            { value: 'Free', label: 'To get started' },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.62)', marginTop: 3 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="landing-section-padding"
        style={{
          borderTop: '0.5px solid var(--border)',
          borderBottom: '0.5px solid var(--border)',
          padding: '24px 56px',
          background: 'var(--bg-surface)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 600 }}>
          Designed for
        </span>
        {['Middle School', 'High School', 'Math & Algebra', 'Reading & Writing', 'Science'].map((item, index, arr) => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, fontWeight: 600 }}>{item}</span>
            {index < arr.length - 1 ? <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 16 }}>·</span> : null}
          </div>
        ))}
      </section>

      <section className="landing-section-padding" style={{ background: 'var(--bg-base)', padding: '88px 64px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: '#7C3AED', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>What you get</div>
        <h2 style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, letterSpacing: '-0.8px', color: '#fff', marginTop: 14 }}>
          Everything in one platform.
        </h2>

        <div className="roles-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, maxWidth: 1100, margin: '48px auto 0' }}>
          {[
            { icon: '🎒', title: 'For students', desc: 'Socratic AI that guides thinking, never gives away answers.', background: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.22)', iconBg: 'rgba(124,58,237,0.15)', titleColor: '#C4B5FD', descColor: '#A78BFA' },
            { icon: '👩‍🏫', title: 'For teachers', desc: 'Lesson plans, quizzes, and rubrics generated in minutes.', background: 'rgba(5,150,105,0.07)', border: 'rgba(5,150,105,0.2)', iconBg: 'rgba(5,150,105,0.12)', titleColor: '#6EE7B7', descColor: '#34D399' },
            { icon: '👨‍👩‍👧', title: 'For parents', desc: "Full visibility into your child's learning journey.", background: 'rgba(217,119,6,0.07)', border: 'rgba(217,119,6,0.2)', iconBg: 'rgba(217,119,6,0.12)', titleColor: '#FDE68A', descColor: '#FCD34D' },
            { icon: '📐', title: 'Math & algebra', desc: 'Step-by-step problem solving with hints, not answers.', background: 'rgba(37,99,235,0.07)', border: 'rgba(37,99,235,0.2)', iconBg: 'rgba(37,99,235,0.12)', titleColor: '#93C5FD', descColor: '#60A5FA' },
            { icon: '📖', title: 'Reading & writing', desc: 'Comprehension coaching and essay feedback built in.', background: 'rgba(236,72,153,0.07)', border: 'rgba(236,72,153,0.2)', iconBg: 'rgba(236,72,153,0.12)', titleColor: '#F9A8D4', descColor: '#F472B6' },
            { icon: '🛡️', title: 'Safe & moderated', desc: 'Every conversation monitored automatically for student safety.', background: 'rgba(13,148,136,0.07)', border: 'rgba(13,148,136,0.2)', iconBg: 'rgba(13,148,136,0.12)', titleColor: '#5EEAD4', descColor: '#2DD4BF' },
          ].map((card) => (
            <div key={card.title} style={{ borderRadius: 20, padding: 28, border: `1.5px solid ${card.border}`, background: card.background, textAlign: 'left' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, marginBottom: 16 }}>{card.icon}</div>
              <h3 style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", fontSize: 16, fontWeight: 700, color: card.titleColor, marginBottom: 8 }}>{card.title}</h3>
              <p style={{ color: card.descColor, fontSize: 13, lineHeight: 1.65 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section-padding" style={{ background: 'var(--bg-surface)', padding: '88px 64px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: '#7C3AED', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>How it works</div>
          <h2 style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, letterSpacing: '-0.8px', color: '#fff', marginTop: 14 }}>
            Guided learning, not just answers.
          </h2>

          <div className="how-row-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 64, alignItems: 'center', marginTop: 52 }}>
            <div>
              <div style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", fontSize: 72, fontWeight: 800, lineHeight: 1, marginBottom: -10, background: 'linear-gradient(135deg, #C4B5FD, #93C5FD)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                01
              </div>
              <h3 style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                Ask anything, get guided
              </h3>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Our AI tutor uses the Socratic method - it never just hands you the answer. Instead it
                breaks down your thinking, asks the right follow-up questions, and helps you reach the
                solution yourself.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '0.5px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, background: '#34D399', borderRadius: '50%', display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: '#7C3AED', fontWeight: 600 }}>📐 ALGEBRA SESSION</span>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '9px 12px', fontSize: 12, color: '#C4B5FD' }}>What do you already know about factoring?</div>
                <div style={{ alignSelf: 'flex-end', background: 'var(--grad)', color: '#fff', borderRadius: 10, padding: '9px 12px', fontSize: 12 }}>I know I need two numbers...</div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '9px 12px', fontSize: 12, color: '#C4B5FD' }}>Great start! What should those two numbers add up to?</div>
              </div>
            </div>
          </div>

          <div className="how-row-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 64, alignItems: 'center', marginTop: 64 }}>
            <div style={{ background: 'var(--bg-card)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '0.5px solid var(--border)', padding: '12px 16px' }}>
                <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>📊 PROGRESS OVERVIEW</span>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Math', width: '78%', text: '#A78BFA', gradient: 'linear-gradient(90deg,#7C3AED,#A78BFA)' },
                  { label: 'Reading', width: '62%', text: '#34D399', gradient: 'linear-gradient(90deg,#059669,#34D399)' },
                  { label: 'Science', width: '45%', text: '#FCD34D', gradient: 'linear-gradient(90deg,#D97706,#FCD34D)' },
                  { label: 'Writing', width: '88%', text: '#F9A8D4', gradient: 'linear-gradient(90deg,#EC4899,#F9A8D4)' },
                ].map((bar) => (
                  <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 52, fontSize: 12, color: 'var(--text-muted)' }}>{bar.label}</span>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 100 }}>
                      <div style={{ width: bar.width, height: '100%', background: bar.gradient, borderRadius: 100 }} />
                    </div>
                    <span style={{ fontSize: 12, color: bar.text, fontWeight: 600 }}>{bar.width}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", fontSize: 72, fontWeight: 800, lineHeight: 1, marginBottom: -10, background: 'linear-gradient(135deg, #C4B5FD, #93C5FD)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                02
              </div>
              <h3 style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                Track every step of progress
              </h3>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Teachers and parents get a clear picture of what&apos;s being learned and where students
                need help.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section-padding" style={{ background: 'var(--bg-base)', padding: '88px 64px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: '#7C3AED', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Who it&apos;s for</div>
        <h2 style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, letterSpacing: '-0.8px', color: '#fff', marginTop: 14 }}>
          One platform, three perspectives.
        </h2>

        <div className="roles-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 1100, margin: '48px auto 0' }}>
          {[
            { title: 'Students', icon: '🎒', accent: 'linear-gradient(90deg,#7C3AED,#A78BFA)', background: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.22)', iconBg: 'rgba(124,58,237,0.15)', titleColor: '#C4B5FD', bodyColor: '#A78BFA', dot: '#7C3AED', body: 'Get step-by-step guidance that builds real understanding - not just the right answer.', items: ['Socratic AI tutoring', 'Math, Reading, Science & Writing', 'Progress tracking & streaks'] },
            { title: 'Teachers', icon: '👩‍🏫', accent: 'linear-gradient(90deg,#059669,#34D399)', background: 'rgba(5,150,105,0.07)', border: 'rgba(5,150,105,0.2)', iconBg: 'rgba(5,150,105,0.12)', titleColor: '#6EE7B7', bodyColor: '#34D399', dot: '#059669', body: 'Cut hours of prep time with AI-generated lesson plans, quizzes, and rubrics.', items: ['Lesson plan generator', 'Assignment & quiz creator', 'Class performance analytics'] },
            { title: 'Parents', icon: '👨‍👩‍👧', accent: 'linear-gradient(90deg,#D97706,#FCD34D)', background: 'rgba(217,119,6,0.07)', border: 'rgba(217,119,6,0.2)', iconBg: 'rgba(217,119,6,0.12)', titleColor: '#FDE68A', bodyColor: '#FCD34D', dot: '#D97706', body: "Stay involved and informed with full visibility into your child's learning journey.", items: ['Real-time progress monitoring', 'Conversation safety log', 'Weekly summary reports'] },
          ].map((card) => (
            <div key={card.title} style={{ background: card.background, border: `1.5px solid ${card.border}`, borderRadius: 20, padding: 28, textAlign: 'left', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: card.accent }} />
              <div style={{ width: 52, height: 52, borderRadius: 15, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>{card.icon}</div>
              <h3 style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", fontSize: 18, fontWeight: 700, color: card.titleColor, marginBottom: 6 }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: card.bodyColor, lineHeight: 1.65, marginBottom: 14 }}>{card.body}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {card.items.map((item) => (
                  <div key={item} style={{ fontSize: 12, color: card.bodyColor }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: card.dot, display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section-padding" style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #4F46E5 50%, #2563EB 100%)', padding: '52px 56px' }}>
        <div className="stats-grid-4" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
          {[
            { value: '10k+', label: 'Active learners' },
            { value: '4', label: 'Core subjects' },
            { value: '3', label: 'Roles supported' },
            { value: 'Free', label: 'To get started' },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.8px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section-padding" style={{ background: 'var(--bg-surface)', padding: '80px 64px', textAlign: 'center' }}>
        <div className="cta-card-padding" style={{ maxWidth: 1000, margin: '0 auto', background: 'var(--bg-card)', border: '0.5px solid rgba(124,58,237,0.25)', borderRadius: 28, padding: '64px 48px', boxShadow: '0 16px 48px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", fontSize: 36, fontWeight: 800, letterSpacing: '-0.8px', color: '#fff', marginBottom: 12 }}>
            Start learning smarter.
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.65 }}>
            Join thousands already using TutorAI. Free to start, no credit card needed.
          </p>
          <Link
            href="/signup"
            style={{
              display: 'inline-block',
              background: 'var(--grad)',
              borderRadius: 12,
              padding: '14px 32px',
              fontFamily: "var(--font-sora, 'Sora', sans-serif)",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(124,58,237,0.28)',
            }}
          >
            Create your free account →
          </Link>
        </div>
      </section>

      <footer className="footer-responsive" style={{ background: 'var(--bg-surface)', borderTop: '0.5px solid var(--border)', padding: '28px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: 'var(--grad)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
            }}
          >
            🎓
          </div>
          <span style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)", color: 'rgba(255,255,255,0.45)', fontSize: 14, fontWeight: 700 }}>
            TutorAI
          </span>
        </Link>
        <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>© 2026 TutorAI. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/terms" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
            Terms
          </Link>
          <Link href="/privacy" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  )
}
