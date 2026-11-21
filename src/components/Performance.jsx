import { useState, useEffect } from 'react'
import { getAllActivities, getAllStudents } from '../db.js'

export default function Performance() {
  const [activities, setActivities] = useState([])
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllActivities(), getAllStudents()]).then(([acts, studs]) => {
      setActivities(acts)
      setStudents(studs)
      setLoading(false)
    })
  }, [])

  const compute = (acts) => ({
    total: acts.length,
    duration: acts.reduce((s, a) => s + (Number(a.duration) || 0), 0),
    distance: acts.reduce((s, a) => s + (Number(a.distance) || 0), 0)
  })

  const globalStats = compute(activities)
  const filteredActs = selectedStudent
    ? activities.filter((a) => a.studentId === Number(selectedStudent))
    : []
  const studentStats = selectedStudent ? compute(filteredActs) : null

  const getStudentName = (id) => students.find((s) => s.id === Number(id))?.name || ''

  const perStudentStats = students.map((s) => {
    const acts = activities.filter((a) => a.studentId === s.id)
    return { ...s, ...compute(acts) }
  }).sort((a, b) => b.duration - a.duration)

  if (loading) {
    return (
      <div className="empty-state">
        <i className="fa-solid fa-circle-notch fa-spin empty-state-icon" style={{ color: 'var(--primary)' }}></i>
        <p>Calculando métricas de desempeño...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'rgba(244, 63, 94, 0.12)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem'
        }}>
          <i className="fa-solid fa-chart-column"></i>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>Indicadores de Desempeño</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Métricas acumuladas globales y evaluación por alumno
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <i className="fa-solid fa-globe" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}></i>
          <h3 style={{ margin: 0, color: 'var(--text)' }}>Métricas Globales</h3>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Total Actividades</span>
              <div className="stat-icon">
                <i className="fa-solid fa-person-running"></i>
              </div>
            </div>
            <div className="stat-value">{globalStats.total}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Tiempo Acumulado</span>
              <div className="stat-icon">
                <i className="fa-solid fa-clock"></i>
              </div>
            </div>
            <div className="stat-value">{globalStats.duration} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>min</span></div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Distancia Total</span>
              <div className="stat-icon">
                <i className="fa-solid fa-route"></i>
              </div>
            </div>
            <div className="stat-value">{globalStats.distance.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>km</span></div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Alumnos Activos</span>
              <div className="stat-icon">
                <i className="fa-solid fa-users"></i>
              </div>
            </div>
            <div className="stat-value">{students.length}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <i className="fa-solid fa-user-check" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}></i>
          <h3 style={{ margin: 0, color: 'var(--text)' }}>Métricas Individuales</h3>
        </div>
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label>
            <i className="fa-solid fa-user" style={{ fontSize: '0.8rem' }}></i>
            <span>Seleccionar estudiante</span>
          </label>
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            <option value="">— Selecciona un alumno para ver su rendimiento —</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {studentStats ? (
          <div>
            <div style={{
              padding: '0.65rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              background: '#0f182c',
              border: '1px solid var(--border)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fa-solid fa-id-badge" style={{ color: 'var(--primary)' }}></i>
              <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                Resultados de <strong>{getStudentName(selectedStudent)}</strong>
              </span>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-label">Sesiones</span>
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)' }}>
                    <i className="fa-solid fa-check-double"></i>
                  </div>
                </div>
                <div className="stat-value" style={{ color: 'var(--success)' }}>{studentStats.total}</div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-label">Minutos</span>
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)' }}>
                    <i className="fa-solid fa-stopwatch"></i>
                  </div>
                </div>
                <div className="stat-value" style={{ color: 'var(--success)' }}>
                  {studentStats.duration} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-muted)' }}>min</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-label">Distancia</span>
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)' }}>
                    <i className="fa-solid fa-route"></i>
                  </div>
                </div>
                <div className="stat-value" style={{ color: 'var(--success)' }}>
                  {studentStats.distance.toFixed(1)} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-muted)' }}>km</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-label">Promedio / Sesión</span>
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)' }}>
                    <i className="fa-solid fa-calculator"></i>
                  </div>
                </div>
                <div className="stat-value" style={{ color: 'var(--success)' }}>
                  {studentStats.total > 0 ? Math.round(studentStats.duration / studentStats.total) : 0} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-muted)' }}>min</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '1.5rem 0' }}>
            <p>Selecciona un alumno en el menú superior para desplegar sus métricas.</p>
          </div>
        )}
      </div>

      {perStudentStats.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <i className="fa-solid fa-ranking-star" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}></i>
            <h3 style={{ margin: 0, color: 'var(--text)' }}>Tabla de Rendimiento Deportivo</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>Lugar</th>
                  <th>Estudiante</th>
                  <th>Disciplina</th>
                  <th>Sesiones</th>
                  <th>Tiempo</th>
                  <th>Distancia</th>
                </tr>
              </thead>
              <tbody>
                {perStudentStats.map((s, i) => (
                  <tr key={s.id}>
                    <td>
                      {i === 0 ? (
                        <i className="fa-solid fa-trophy" style={{ color: '#fbbf24', fontSize: '1rem' }}></i>
                      ) : i === 1 ? (
                        <i className="fa-solid fa-medal" style={{ color: '#cbd5e1', fontSize: '1rem' }}></i>
                      ) : i === 2 ? (
                        <i className="fa-solid fa-medal" style={{ color: '#d97706', fontSize: '1rem' }}></i>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>{s.discipline}</td>
                    <td><span className="badge badge-primary">{s.total}</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{s.duration} min</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{s.distance.toFixed(1)} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
