export default function Home({ setPage }) {
  const modules = [
    {
      id: 'students',
      icon: 'fa-solid fa-user-graduate',
      label: 'Registro de Estudiantes',
      desc: 'Alta de alumnos, grupos escolares y disciplinas deportivas asignadas.'
    },
    {
      id: 'activities',
      icon: 'fa-solid fa-person-running',
      label: 'Registro de Actividades',
      desc: 'Control de sesiones deportivas con fecha, tiempo, distancia y ubicación.'
    },
    {
      id: 'history',
      icon: 'fa-solid fa-clipboard-list',
      label: 'Historial Deportivo',
      desc: 'Consulta detallada y filtros por estudiante de todas las sesiones registradas.'
    },
    {
      id: 'performance',
      icon: 'fa-solid fa-chart-column',
      label: 'Indicadores de Desempeño',
      desc: 'Métricas de rendimiento en tiempo real, totales y tabla de posiciones.'
    }
  ]

  return (
    <div>
      <div className="card" style={{
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, rgba(30, 45, 77, 0.8) 0%, rgba(19, 29, 51, 0.95) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '620px' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
            Bienvenido a El Cuervo
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
            Herramienta diseñada para entrenadores y docentes de educación física. Gestiona alumnos, registra entrenamientos y monitorea el avance deportivo de forma ágil y disponible en cualquier momento.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {modules.map((m) => (
          <div
            key={m.id}
            className="card"
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
            onClick={() => setPage(m.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(244, 63, 94, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                marginBottom: '1rem'
              }}>
                <i className={m.icon}></i>
              </div>
              <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', color: 'var(--text)' }}>
                {m.label}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0, lineHeight: 1.5 }}>
                {m.desc}
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              <span>Acceder al módulo</span>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.75rem' }}></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
