import { useState, useEffect } from 'react'
import { getAllActivities, getAllStudents } from '../db.js'

export default function History() {
  const [activities, setActivities] = useState([])
  const [students, setStudents] = useState([])
  const [filterStudent, setFilterStudent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllActivities(), getAllStudents()]).then(([acts, studs]) => {
      setActivities(acts)
      setStudents(studs)
      setLoading(false)
    })
  }, [])

  const getStudentName = (id) => students.find((s) => s.id === id)?.name || 'Desconocido'

  const filtered = filterStudent
    ? activities.filter((a) => a.studentId === Number(filterStudent))
    : activities

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))

  if (loading) {
    return (
      <div className="empty-state">
        <i className="fa-solid fa-circle-notch fa-spin empty-state-icon" style={{ color: 'var(--primary)' }}></i>
        <p>Cargando historial...</p>
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
          <i className="fa-solid fa-clipboard-list"></i>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>Historial Deportivo</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Registro cronológico y consultas por estudiante
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '220px' }}>
            <label>
              <i className="fa-solid fa-filter" style={{ fontSize: '0.8rem' }}></i>
              <span>Filtrar por estudiante</span>
            </label>
            <select value={filterStudent} onChange={(e) => setFilterStudent(e.target.value)}>
              <option value="">Todos los estudiantes</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div style={{ paddingBottom: '0.2rem' }}>
            <span className="badge badge-primary">
              <i className="fa-solid fa-list-check"></i>
              <span>{sorted.length} sesión{sorted.length !== 1 ? 'es' : ''}</span>
            </span>
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fa-solid fa-inbox"></i>
            </div>
            <p>No se encontraron registros de actividades.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Estudiante</th>
                  <th>Actividad</th>
                  <th>Duración</th>
                  <th>Distancia</th>
                  <th>Ubicación</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((a) => (
                  <tr key={a.id}>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(a.date + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ fontWeight: 600 }}>{getStudentName(a.studentId)}</td>
                    <td><span className="badge badge-primary">{a.activity}</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <i className="fa-regular fa-clock" style={{ fontSize: '0.75rem', marginRight: '0.3rem', color: 'var(--text-muted)' }}></i>
                      {a.duration} min
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {a.distance ? (
                        <>
                          <i className="fa-solid fa-route" style={{ fontSize: '0.75rem', marginRight: '0.3rem', color: 'var(--text-muted)' }}></i>
                          {a.distance} km
                        </>
                      ) : '—'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {a.lat && a.lng ? (
                        <span style={{ color: 'var(--accent)' }}>
                          <i className="fa-solid fa-location-dot" style={{ marginRight: '0.25rem' }}></i>
                          {a.lat}, {a.lng}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '240px' }}>
                      {a.observations || '—'}
                    </td>
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
