
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import MapView from './MapView'

function App() {
  const [puntos, setPuntos] = useState([])
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function obtenerPuntos() {
      const { data, error } = await supabase
        .from('puntos')
        .select('*')

      if (error) {
        setError(error.message)
      } else {
        setPuntos(data || [])
      }

      setCargando(false)
    }

    obtenerPuntos()
  }, [])

  const promedio = puntos.length
    ? Math.round(
        puntos.reduce(
          (total, p) => total + Number(p.conteo_promedio || 0), 0
        ) / puntos.length
      )
    : 0

  const mayorPunto = puntos.length
    ? puntos.reduce((mayor, actual) =>
        Number(actual.conteo_promedio || 0) >
        Number(mayor.conteo_promedio || 0)
          ? actual
          : mayor
      )
    : null

  const tarjeta = {
    background: '#ffffff',
    padding: '25px',
    borderRadius: '14px',
    boxShadow: '0 3px 12px rgba(15, 23, 42, 0.06)',
    border: '1px solid #e2e8f0',
    flex: '1',
    minWidth: '190px'
  }

  const etiqueta = {
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '600',
    margin: '0 0 12px'
  }

  const numero = {
    color: '#0f172a',
    fontSize: '32px',
    fontWeight: '700',
    margin: 0
  }

  return (
    <main style={{
      fontFamily: 'Arial, sans-serif',
      background: '#f1f5f9',
      minHeight: '100vh',
      padding: '30px',
      boxSizing: 'border-box'
    }}>

      {/* ENCABEZADO */}
      <header style={{
        background: '#0f172a',
        color: '#ffffff',
        padding: '30px',
        borderRadius: '16px',
        marginBottom: '25px',
        boxShadow: '0 5px 15px rgba(15, 23, 42, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <h1 style={{
              fontSize: '34px',
              margin: '0 0 8px',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              GeoLog BA
            </h1>

            <p style={{
              color: '#cbd5e1',
              fontSize: '15px',
              margin: 0
            }}>
              Plataforma de análisis de movilidad urbana
            </p>
          </div>

          <div style={{
            background: '#1e293b',
            padding: '12px 18px',
            borderRadius: '10px',
            color: '#93c5fd',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            DATOS 2024 · BUENOS AIRES
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <section style={{
        background: '#ffffff',
        padding: '28px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 3px 12px rgba(15, 23, 42, 0.04)'
      }}>

        <div style={{ marginBottom: '25px' }}>
          <h2 style={{
            color: '#0f172a',
            fontSize: '23px',
            margin: '0 0 8px'
          }}>
            Panel de movilidad vehicular
          </h2>

          <p style={{
            color: '#64748b',
            fontSize: '14px',
            margin: 0
          }}>
            Ciudad Autónoma de Buenos Aires · Información anual 2024
          </p>
        </div>

        {/* INDICADORES */}
        <h3 style={{
          color: '#334155',
          fontSize: '16px',
          marginBottom: '15px'
        }}>
          Indicadores principales
        </h3>

        {cargando ? (
          <p style={{ color: '#64748b' }}>Cargando indicadores...</p>
        ) : error ? (
          <p style={{ color: '#dc2626' }}>Error: {error}</p>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '18px',
            marginBottom: '35px'
          }}>

            <div style={{
              ...tarjeta,
              borderTop: '4px solid #2563eb'
            }}>
              <p style={etiqueta}>UBICACIONES MONITOREADAS</p>
              <h2 style={numero}>
                {puntos.length}
              </h2>
              <p style={{
                color: '#94a3b8',
                fontSize: '12px',
                marginBottom: 0
              }}>
                Puntos de medición registrados
              </p>
            </div>

            <div style={{
              ...tarjeta,
              borderTop: '4px solid #16a34a'
            }}>
              <p style={etiqueta}>PROMEDIO VEHICULAR</p>
              <h2 style={numero}>
                {promedio.toLocaleString('es-AR')}
              </h2>
              <p style={{
                color: '#94a3b8',
                fontSize: '12px',
                marginBottom: 0
              }}>
                Promedio de los registros por ubicación
              </p>
            </div>

            <div style={{
              ...tarjeta,
              borderTop: '4px solid #d97706'
            }}>
              <p style={etiqueta}>MAYOR REGISTRO PROMEDIO</p>
              <h2 style={numero}>
                {mayorPunto
                  ? Number(mayorPunto.conteo_promedio).toLocaleString('es-AR')
                  : 0}
              </h2>
              <p style={{
                color: '#94a3b8',
                fontSize: '12px',
                marginBottom: 0
              }}>
                {mayorPunto ? mayorPunto.nombre : 'Sin datos disponibles'}
              </p>
            </div>

          </div>
        )}

        {/* MAPA */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '25px'
        }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{
              color: '#0f172a',
              fontSize: '19px',
              margin: '0 0 7px'
            }}>
              Mapa interactivo de movilidad
            </h3>

            <p style={{
              color: '#64748b',
              fontSize: '13px',
              margin: 0
            }}>
              Distribución geográfica de los puntos de medición vehicular.
              Explorá las ubicaciones y consultá sus registros.
            </p>
          </div>

          {!cargando && !error && (
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #cbd5e1'
            }}>
              <MapView puntos={puntos} />
            </div>
          )}
        </div>

      </section>

      {/* PIE DE PÁGINA */}
      <footer style={{
        textAlign: 'center',
        padding: '22px 10px',
        color: '#94a3b8',
        fontSize: '12px'
      }}>
        GeoLog BA · Proyecto de análisis de datos logísticos y movilidad urbana
      </footer>

    </main>
  )
}

export default App
