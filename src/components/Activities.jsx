import { useState, useEffect } from 'react'
import { addActivity, getAllStudents } from '../db.js'

const ACTIVITY_TYPES = [
  'Carrera', 'Caminata', 'Ciclismo', 'Natación', 'Fútbol', 'Baloncesto',
  'Voleibol', 'Salto', 'Lanzamiento', 'Flexibilidad', 'Fuerza', 'Otro'
]

export default function Activities() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    activity: '',
    duration: '',
    distance: '',
    observations: '',
    lat: null,
    lng: null
  })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [fetchStatus, setFetchStatus] = useState(null)

  useEffect(() => {
    getAllStudents().then(setStudents)
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setStatus({ type: 'error', msg: 'La geolocalización no está disponible en este dispositivo.' })
      return
    }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }))
        setGeoLoading(false)
        setStatus({ type: 'success', msg: `Ubicación registrada: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` })
      },
      () => {
        setGeoLoading(false)
        setStatus({ type: 'error', msg: 'No se pudo obtener la ubicación. Por favor concede el permiso en el navegador.' })
      }
    )
  }

  const sendDemoFetch = async (activityData) => {
    setFetchStatus({ loading: true, msg: 'Enviando comprobante...' })
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Sesion: ${activityData.activity}`,
          body: `Tiempo: ${activityData.duration} min | Distancia: ${activityData.distance} km`,
          userId: activityData.studentId
        })
      })
      await res.json()
      setFetchStatus({
        loading: false,
        success: true,
        msg: 'Guardado exitosamente.'
      })
    } catch {
      setFetchStatus({
        loading: false,
        success: false,
        msg: 'Sin conexión. La sesión fue guardada localmente de manera segura en tu dispositivo.'
      })
    }
  }

  const triggerNotification = (studentName, activityName) => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') {
      new Notification('El Cuervo PWA', {
        body: `Actividad "${activityName}" registrada para ${studentName}.`,
        icon: '/icon-192.png'
      })
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification('El Cuervo PWA', {
            body: `Actividad "${activityName}" registrada para ${studentName}.`,
            icon: '/icon-192.png'
          })
        }
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.studentId || !form.activity || !form.duration || !form.date) {
      setStatus({ type: 'error', msg: 'Estudiante, fecha, actividad y duración son obligatorios.' })
      return
    }
    setLoading(true)
    setStatus(null)
    try {
      await addActivity({
        studentId: Number(form.studentId),
        date: form.date,
        activity: form.activity,
        duration: Number(form.duration),
        distance: form.distance ? Number(form.distance) : 0,
        observations: form.observations,
        lat: form.lat,
        lng: form.lng
      })
      const student = students.find((s) => s.id === Number(form.studentId))
      triggerNotification(student?.name || 'Estudiante', form.activity)
      await sendDemoFetch(form)
      setForm({
        studentId: '',
        date: new Date().toISOString().split('T')[0],
        activity: '',
        duration: '',
        distance: '',
        observations: '',
        lat: null,
        lng: null
      })
      setStatus({ type: 'success', msg: 'Actividad registrada exitosamente.' })
    } catch {
      setStatus({ type: 'error', msg: 'Error al guardar la actividad.' })
    } finally {
      setLoading(false)
    }
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
          <i className="fa-solid fa-person-running"></i>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>Registro de Actividades</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Captura de sesiones de entrenamiento y mediciones
          </p>
        </div>
      </div>

      {students.length === 0 && (
        <div className="alert alert-info">
          <i className="fa-solid fa-circle-info"></i>
          <span>Para registrar una actividad, primero agrega al menos un alumno en el módulo de Estudiantes.</span>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text)' }}>
          Nueva Sesión Deportiva
        </h3>
        {status && (
          <div className={`alert alert-${status.type === 'error' ? 'error' : 'success'}`}>
            <i className={`fa-solid ${status.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
            <span>{status.msg}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <i className="fa-solid fa-user" style={{ fontSize: '0.8rem' }}></i>
              <span>Estudiante</span>
            </label>
            <select name="studentId" value={form.studentId} onChange={handleChange}>
              <option value="">Selecciona un estudiante</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.group} ({s.discipline})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>
                <i className="fa-regular fa-calendar" style={{ fontSize: '0.8rem' }}></i>
                <span>Fecha</span>
              </label>
              <input type="date" name="date" value={form.date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>
                <i className="fa-solid fa-dumbbell" style={{ fontSize: '0.8rem' }}></i>
                <span>Tipo de actividad</span>
              </label>
              <select name="activity" value={form.activity} onChange={handleChange}>
                <option value="">Selecciona actividad</option>
                {ACTIVITY_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>
                <i className="fa-solid fa-stopwatch" style={{ fontSize: '0.8rem' }}></i>
                <span>Duración (minutos)</span>
              </label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} placeholder="Ej: 45" min="1" />
            </div>
            <div className="form-group">
              <label>
                <i className="fa-solid fa-route" style={{ fontSize: '0.8rem' }}></i>
                <span>Distancia (kilómetros) — opcional</span>
              </label>
              <input type="number" name="distance" value={form.distance} onChange={handleChange} placeholder="Ej: 5.2" step="0.1" min="0" />
            </div>
          </div>

          <div className="form-group">
            <label>
              <i className="fa-solid fa-pen-to-square" style={{ fontSize: '0.8rem' }}></i>
              <span>Observaciones — opcional</span>
            </label>
            <textarea name="observations" value={form.observations} onChange={handleChange} rows={3} placeholder="Condiciones, rendimiento, anotaciones del docente..." style={{ resize: 'vertical' }} />
          </div>

          <div className="form-group">
            <label>
              <i className="fa-solid fa-location-dot" style={{ fontSize: '0.8rem' }}></i>
              <span>Ubicación GPS — opcional</span>
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" onClick={handleGeolocation} disabled={geoLoading}>
                <i className={`fa-solid ${geoLoading ? 'fa-spinner fa-spin' : 'fa-location-crosshairs'}`}></i>
                <span>{geoLoading ? 'Obteniendo coordenadas...' : 'Capturar Ubicación Actual'}</span>
              </button>
              {form.lat && form.lng && (
                <span className="badge badge-success">
                  <i className="fa-solid fa-check"></i>
                  <span>{form.lat}, {form.lng}</span>
                </span>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || students.length === 0} style={{ marginTop: '0.5rem' }}>
            <i className="fa-solid fa-plus"></i>
            <span>{loading ? 'Guardando...' : 'Registrar Actividad'}</span>
          </button>
        </form>

        {fetchStatus && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            background: '#0f182c',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            fontSize: '0.85rem'
          }}>
            <div style={{
              marginTop: '0.15rem',
              color: fetchStatus.success ? 'var(--success)' : fetchStatus.loading ? 'var(--text-muted)' : 'var(--warning)'
            }}>
              <i className={`fa-solid ${fetchStatus.loading ? 'fa-spinner fa-spin' : fetchStatus.success ? 'fa-cloud-arrow-up' : 'fa-cloud'}`}></i>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.15rem' }}>
                Sincronización remota
              </div>
              <div style={{ color: fetchStatus.success ? '#6ee7b7' : 'var(--text-muted)' }}>
                {fetchStatus.msg}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
