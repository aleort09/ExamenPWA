import { useState, useEffect } from 'react'
import { addStudent, getAllStudents } from '../db.js'

const DISCIPLINES = [
  'Fútbol', 'Baloncesto', 'Voleibol', 'Atletismo', 'Natación',
  'Béisbol', 'Tenis', 'Gimnasia', 'Ciclismo', 'Artes Marciales', 'Otro'
]

export default function Students() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({ name: '', group: '', discipline: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllStudents().then(setStudents)
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.group.trim() || !form.discipline) {
      setStatus({ type: 'error', msg: 'Todos los campos son obligatorios.' })
      return
    }
    setLoading(true)
    try {
      await addStudent(form)
      const updated = await getAllStudents()
      setStudents(updated)
      setForm({ name: '', group: '', discipline: '' })
      setStatus({ type: 'success', msg: `Estudiante "${form.name}" registrado correctamente.` })
    } catch {
      setStatus({ type: 'error', msg: 'Ocurrió un error al guardar el estudiante.' })
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
          <i className="fa-solid fa-user-graduate"></i>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>Registro de Estudiantes</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Administración de alumnos por grupo y disciplina
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text)' }}>
          Nuevo Estudiante
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
              <span>Nombre completo</span>
            </label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Ej: Juan García López" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>
                <i className="fa-solid fa-layer-group" style={{ fontSize: '0.8rem' }}></i>
                <span>Grupo o Grado</span>
              </label>
              <input name="group" value={form.group} onChange={handleChange} placeholder="Ej: 3°A, Secundaria 2" />
            </div>
            <div className="form-group">
              <label>
                <i className="fa-solid fa-medal" style={{ fontSize: '0.8rem' }}></i>
                <span>Disciplina deportiva</span>
              </label>
              <select name="discipline" value={form.discipline} onChange={handleChange}>
                <option value="">Selecciona una disciplina</option>
                {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
            <i className="fa-solid fa-plus"></i>
            <span>{loading ? 'Guardando...' : 'Registrar Estudiante'}</span>
          </button>
        </form>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text)' }}>Estudiantes Registrados</h3>
          <span className="badge badge-primary">
            <i className="fa-solid fa-users"></i>
            <span>{students.length} alumnos</span>
          </span>
        </div>
        {students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fa-solid fa-folder-open"></i>
            </div>
            <p>No hay estudiantes registrados todavía.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>Nombre</th>
                  <th>Grupo</th>
                  <th>Disciplina</th>
                  <th>Fecha de alta</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td><span className="badge badge-primary">{s.group}</span></td>
                    <td>{s.discipline}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(s.createdAt).toLocaleDateString('es-MX')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
