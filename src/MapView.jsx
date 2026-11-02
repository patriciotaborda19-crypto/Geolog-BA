
import { useState } from 'react'
import { Map } from 'react-map-gl/maplibre'
import { ScatterplotLayer } from '@deck.gl/layers'
import { DeckGL } from '@deck.gl/react'
import 'maplibre-gl/dist/maplibre-gl.css'

function MapView({ puntos }) {
  const [viewState, setViewState] = useState({
    longitude: -58.44,
    latitude: -34.61,
    zoom: 10,
    pitch: 0,
    bearing: 0
  })

  const maximo = puntos.length
    ? Math.max(...puntos.map(p => Number(p.conteo_promedio || 0)))
    : 1

  const capas = [
    new ScatterplotLayer({
      id: 'puntos-movilidad',
      data: puntos,

      getPosition: d => [
        Number(d.longitud),
        Number(d.latitud)
      ],

     getRadius: d => {
  const intensidad =
    Number(d.conteo_promedio || 0) / maximo

  return 5 + intensidad * 13
},

     radiusUnits: 'pixels',
radiusMinPixels: 5,
radiusMaxPixels: 18,

      getFillColor: d => {
        const intensidad =
          Number(d.conteo_promedio || 0) / maximo

        if (intensidad >= 0.7) {
          return [220, 38, 38, 210]
        }

        if (intensidad >= 0.4) {
          return [245, 158, 11, 210]
        }

        return [37, 99, 235, 190]
      },

      getLineColor: [255, 255, 255, 230],
      lineWidthMinPixels: 1,
      stroked: true,
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 100]
    })
  ]

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '550px'
    }}>

      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) =>
          setViewState(viewState)
        }
        controller={true}
        layers={capas}
        getTooltip={({ object }) => {
          if (!object) return null

          return {
            html: `
              <div style="padding: 5px">
                <strong>${object.nombre}</strong>
                <br/>
                Comuna: ${object.comuna || 'Sin dato'}
                <br/>
                Promedio vehicular:
                ${Number(object.conteo_promedio || 0).toLocaleString('es-AR')}
              </div>
            `,
            style: {
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontSize: '13px',
              borderRadius: '8px',
              padding: '8px'
            }
          }
        }}
      >
        <Map
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        />
      </DeckGL>

      {/* REFERENCIAS DEL MAPA */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        zIndex: 10,
        background: 'rgba(255,255,255,0.95)',
        padding: '14px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
        pointerEvents: 'none'
      }}>
        <p style={{
          margin: '0 0 10px',
          fontSize: '12px',
          fontWeight: '700',
          color: '#0f172a'
        }}>
          INTENSIDAD RELATIVA
        </p>

        {[
          { color: '#2563eb', label: 'Menor volumen' },
          { color: '#f59e0b', label: 'Volumen intermedio' },
          { color: '#dc2626', label: 'Mayor volumen' }
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '7px'
          }}>
            <span style={{
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              background: item.color
            }} />

            <span style={{
              fontSize: '11px',
              color: '#334155'
            }}>
              {item.label}
            </span>
          </div>
        ))}

        <p style={{
          fontSize: '10px',
          color: '#64748b',
          margin: '5px 0 0'
        }}>
          Comparación entre ubicaciones
        </p>
      </div>

    </div>
  )
}

export default MapView
