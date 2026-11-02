import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setWorkerUrl } from 'maplibre-gl'
import maplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import './index.css'
import App from './App.jsx'

setWorkerUrl(maplibreWorker)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)