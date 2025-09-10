import { useState, useEffect } from 'react'
import { getTelefono, getOrCreateConfiguracionWeb, ConfiguracionWeb } from '@/lib/supabase-config'

export function useConfiguracion() {
  const [telefono, setTelefono] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTelefono() {
      try {
        setLoading(true)
        const telefonoData = await getTelefono()
        setTelefono(telefonoData)
      } catch (err) {
        setError('Error al cargar la configuración')
        console.error('Error al cargar configuración:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTelefono()
  }, [])

  return { telefono, loading, error }
}

export function useConfiguracionWeb() {
  const [configuracion, setConfiguracion] = useState<ConfiguracionWeb | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchConfiguracion() {
      try {
        setLoading(true)
        setError(null)
        const config = await getOrCreateConfiguracionWeb()
        setConfiguracion(config)
        if (!config) {
          setError('No se pudo obtener la configuración web')
        }
      } catch (err) {
        const errorMessage = 'Error al cargar la configuración web'
        setError(errorMessage)
        console.error(errorMessage, err)
      } finally {
        setLoading(false)
      }
    }

    fetchConfiguracion()
  }, [])

  return { configuracion, loading, error }
}
