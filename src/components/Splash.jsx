import { useEffect, useState } from 'react'

export default function Splash() {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => setOpacity(0), 1400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="splash" style={{ opacity, transition: 'opacity 0.4s ease' }}>
      <div className="splash-icon" style={{ padding: 0, overflow: 'hidden' }}>
        <img src="/icon-192.png" alt="El Cuervo PWA" style={{ width: '100%', height: '100%', borderRadius: '24px', objectFit: 'cover' }} />
      </div>
      <h1>El Cuervo PWA</h1>
      <p>Herramienta digital para docentes de educación física</p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '0.65rem', alignItems: 'center', color: 'var(--text-muted)' }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}></i>
        <span style={{ fontSize: '0.9rem' }}>Iniciando aplicación...</span>
      </div>
    </div>
  )
}
