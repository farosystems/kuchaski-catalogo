'use client'

import { useConfiguracionWebContext } from '@/contexts/ConfiguracionWebContext'
import { useIsMobile } from '@/hooks/use-mobile'

export default function DebugConfig() {
  const { configuracion, loading, error } = useConfiguracionWebContext()
  const isMobile = useIsMobile()

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Configuración Web</h3>
      
      <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
      <p><strong>Error:</strong> {error || 'Ninguno'}</p>
      <p><strong>Es Mobile:</strong> {isMobile ? 'Sí' : 'No'}</p>
      
      {configuracion ? (
        <div className="mt-2">
          <p><strong>Configuración cargada:</strong></p>
          <p><strong>Logo URL:</strong> {configuracion.logo_url || 'null'}</p>
          <p><strong>Logo Width:</strong> {configuracion.logo_width}</p>
          <p><strong>Logo Height:</strong> {configuracion.logo_height}</p>
          <p><strong>Mobile Logo Width:</strong> {configuracion.mobile_logo_width}</p>
          <p><strong>Mobile Logo Height:</strong> {configuracion.mobile_logo_height}</p>
          <p><strong>AppBar BG:</strong> {configuracion.appbar_background_color}</p>
          <p><strong>AppBar Text:</strong> {configuracion.appbar_text_color}</p>
          <p><strong>Primary Color:</strong> {configuracion.primary_color}</p>
        </div>
      ) : (
        <p><strong>Configuración:</strong> No cargada</p>
      )}
    </div>
  )
}