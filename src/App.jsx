import { useState, useEffect } from 'react'
import Splash from './components/Splash.jsx'
import Home from './components/Home.jsx'
import Students from './components/Students.jsx'
import Activities from './components/Activities.jsx'
import History from './components/History.jsx'
import Performance from './components/Performance.jsx'

export default function App() {
  const [page, setPage] = useState('splash')

  useEffect(() => {
    const timer = setTimeout(() => setPage('home'), 1800)
    return () => clearTimeout(timer)
  }, [])

  if (page === 'splash') return <Splash />

  return (
    <div className="container">
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-icon" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="/icon-192.png" alt="El Cuervo PWA" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
          </div>
          <div>
            <h1 className="brand-title">El Cuervo <span>PWA</span></h1>
          </div>
        </div>
      </header>

      <nav className="nav">
        <button className={`nav-btn ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>
          <i className="fa-solid fa-house"></i>
          <span>Inicio</span>
        </button>
        <button className={`nav-btn ${page === 'students' ? 'active' : ''}`} onClick={() => setPage('students')}>
          <i className="fa-solid fa-user-graduate"></i>
          <span>Estudiantes</span>
        </button>
        <button className={`nav-btn ${page === 'activities' ? 'active' : ''}`} onClick={() => setPage('activities')}>
          <i className="fa-solid fa-person-running"></i>
          <span>Actividades</span>
        </button>
        <button className={`nav-btn ${page === 'history' ? 'active' : ''}`} onClick={() => setPage('history')}>
          <i className="fa-solid fa-clipboard-list"></i>
          <span>Historial</span>
        </button>
        <button className={`nav-btn ${page === 'performance' ? 'active' : ''}`} onClick={() => setPage('performance')}>
          <i className="fa-solid fa-chart-column"></i>
          <span>Desempeño</span>
        </button>
      </nav>

      <main>
        {page === 'home' && <Home setPage={setPage} />}
        {page === 'students' && <Students />}
        {page === 'activities' && <Activities />}
        {page === 'history' && <History />}
        {page === 'performance' && <Performance />}
      </main>
    </div>
  )
}
