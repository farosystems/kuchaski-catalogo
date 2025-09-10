'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useConfiguracionWeb } from '@/hooks/use-configuracion'
import { ConfiguracionWeb } from '@/lib/supabase-config'

interface ConfiguracionWebContextType {
  configuracion: ConfiguracionWeb | null
  loading: boolean
  error: string | null
}

const ConfiguracionWebContext = createContext<ConfiguracionWebContextType | undefined>(undefined)

export function ConfiguracionWebProvider({ children }: { children: ReactNode }) {
  const { configuracion, loading, error } = useConfiguracionWeb()

  return (
    <ConfiguracionWebContext.Provider value={{ configuracion, loading, error }}>
      {children}
    </ConfiguracionWebContext.Provider>
  )
}

export function useConfiguracionWebContext() {
  const context = useContext(ConfiguracionWebContext)
  if (context === undefined) {
    throw new Error('useConfiguracionWebContext debe usarse dentro de ConfiguracionWebProvider')
  }
  return context
}