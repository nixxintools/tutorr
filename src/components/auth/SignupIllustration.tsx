'use client'

export function SignupIllustration() {
  return (
    <div style={{ position: 'relative', width: 260, height: 260, marginBottom: 32 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '0.5px dashed rgba(124,58,237,0.15)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '14%',
          left: '14%',
          right: '14%',
          bottom: '14%',
          borderRadius: '50%',
          border: '0.5px solid rgba(124,58,237,0.22)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '28%',
          left: '28%',
          right: '28%',
          bottom: '28%',
          borderRadius: '50%',
          border: '1px solid rgba(124,58,237,0.35)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 60,
          height: 60,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
          filter: 'blur(6px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 52,
          height: 52,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#7C3AED,#2563EB)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          boxShadow: '0 0 24px rgba(124,58,237,0.5)',
        }}
      >
        🎓
      </div>

      <div
        style={{
          position: 'absolute',
          top: -6,
          left: '50%',
          width: 28,
          height: 28,
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          background: 'rgba(124,58,237,0.2)',
          border: '0.5px solid rgba(167,139,250,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          boxShadow: '0 0 10px rgba(124,58,237,0.4)',
        }}
      >
        📐
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: -6,
          width: 26,
          height: 26,
          transform: 'translateY(-50%)',
          borderRadius: '50%',
          background: 'rgba(245,158,11,0.15)',
          border: '0.5px solid rgba(252,211,77,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          boxShadow: '0 0 8px rgba(245,158,11,0.3)',
        }}
      >
        🔬
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: -6,
          left: '50%',
          width: 26,
          height: 26,
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          background: 'rgba(236,72,153,0.15)',
          border: '0.5px solid rgba(249,168,212,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          boxShadow: '0 0 8px rgba(236,72,153,0.3)',
        }}
      >
        ✍️
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: -6,
          width: 26,
          height: 26,
          transform: 'translateY(-50%)',
          borderRadius: '50%',
          background: 'rgba(16,185,129,0.15)',
          border: '0.5px solid rgba(52,211,153,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          boxShadow: '0 0 8px rgba(16,185,129,0.3)',
        }}
      >
        📖
      </div>

      <div
        style={{
          position: 'absolute',
          top: '18%',
          right: '10%',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#A78BFA',
          boxShadow: '0 0 10px rgba(167,139,250,0.9)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '18%',
          left: '10%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#34D399',
          boxShadow: '0 0 8px rgba(52,211,153,0.9)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '38%',
          right: -4,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#60A5FA',
          boxShadow: '0 0 8px rgba(96,165,250,0.8)',
        }}
      />
    </div>
  )
}
