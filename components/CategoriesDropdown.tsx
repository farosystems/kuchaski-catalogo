'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRight, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { Categoria, Linea } from '@/lib/products'
import { getLineasWithCategorias, getCategoriasWithoutLinea } from '@/lib/supabase-products'

interface CategoriesDropdownProps {
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
}

export default function CategoriesDropdown({ isOpen, onClose, isMobile: isMobileProp }: CategoriesDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const submenuRef = useRef<HTMLDivElement>(null)
  const [lineasWithCategorias, setLineasWithCategorias] = useState<(Linea & { categorias: Categoria[] })[]>([])
  const [categoriasWithoutLinea, setCategoriasWithoutLinea] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredLinea, setHoveredLinea] = useState<number | null>(null)
  const [selectedLinea, setSelectedLinea] = useState<(Linea & { categorias: Categoria[] }) | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Usar el prop isMobile si se proporciona, sino detectar automáticamente
  const isReallyMobile = isMobileProp !== undefined ? isMobileProp : isMobile

  // Cargar líneas con categorías y categorías sin línea
  useEffect(() => {
    const loadData = async () => {
      try {
        const [lineasData, categoriasData] = await Promise.all([
          getLineasWithCategorias(),
          getCategoriasWithoutLinea()
        ])
        setLineasWithCategorias(lineasData)
        setCategoriasWithoutLinea(categoriasData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Detectar si estamos en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Prevenir scroll en el body cuando el modal móvil está abierto
  useEffect(() => {
    if (isReallyMobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isReallyMobile, isOpen])

  // Cerrar dropdown solo al hacer clic fuera, no al pasar el mouse (solo para desktop)
  useEffect(() => {
    // Solo aplicar lógica de click outside en desktop, en móvil se controla manualmente
    if (isReallyMobile) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      // Verificar si el click fue en el dropdown principal
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        return
      }
      
      // Verificar si el click fue en algún submenu
      const submenus = document.querySelectorAll('[data-submenu]')
      for (let submenu of submenus) {
        if (submenu.contains(target)) {
          return
        }
      }
      
      // Si no fue en el dropdown ni en ningún submenu, cerrar
      onClose()
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose, isReallyMobile])

  // Limpiar timeout al desmontar componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Manejar el hover para mostrar submenu (solo desktop)
  const handleLineaMouseEnter = (lineaId: number) => {
    if (isReallyMobile) return // No hacer nada en móvil
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setHoveredLinea(lineaId)
  }

  const handleLineaMouseLeave = () => {
    if (isReallyMobile) return // No hacer nada en móvil
    
    // Delay antes de cerrar para permitir mover el cursor al submenu
    timeoutRef.current = setTimeout(() => {
      setHoveredLinea(null)
    }, 200)
  }

  const handleSubmenuMouseEnter = () => {
    if (isReallyMobile) return // No hacer nada en móvil
    
    // Cancelar el cierre cuando entramos al submenu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleSubmenuMouseLeave = () => {
    if (isReallyMobile) return // No hacer nada en móvil
    
    // Cerrar inmediatamente cuando salimos del submenu
    setHoveredLinea(null)
  }

  // Manejar clic en línea para móvil
  const handleLineaClick = (linea: Linea & { categorias: Categoria[] }) => {
    if (isReallyMobile) {
      if (linea.categorias.length > 0) {
        // Si la línea tiene categorías, navegar a la vista de categorías
        setSelectedLinea(linea)
      } else {
        // Si no tiene categorías, ir directamente a la página (como un enlace)
        const slug = generateSlug(linea.descripcion)
        window.location.href = `/${slug}`
        onClose()
      }
    }
  }

  // Volver a la vista de líneas en móvil
  const handleBackToLineas = () => {
    setSelectedLinea(null)
  }


  if (!isOpen) return null

  const generateSlug = (descripcion: string) => {
    return descripcion?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Modal móvil - Vista única con transiciones
  if (isReallyMobile && isClient) {
    return createPortal(
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" style={{ zIndex: 99999 }}>
        <div className="bg-white w-full h-full flex flex-col relative overflow-hidden">
          
          {/* Vista de Líneas */}
          <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out ${
            selectedLinea ? '-translate-x-full' : 'translate-x-0'
          }`}>
            {/* Header con gradiente violeta */}
            <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Líneas</h2>
              <button onClick={onClose} className="text-white/80 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
              </div>
            ) : (
              /* Lista scrolleable de líneas */
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {/* Líneas con categorías */}
                  {lineasWithCategorias.map((linea) => (
                    <button
                      key={linea.id}
                      onClick={() => handleLineaClick(linea)}
                      className="w-full flex items-center justify-between p-4 hover:bg-violet-50 rounded-xl transition-colors group border border-gray-200 hover:border-violet-300"
                    >
                      <span className="text-gray-900 group-hover:text-violet-700 font-medium text-lg">
                        {linea.descripcion}
                      </span>
                      <ChevronRight className="text-gray-400 group-hover:text-violet-600 size-6" />
                    </button>
                  ))}

                  {/* Categorías sin línea - enlaces directos */}
                  {categoriasWithoutLinea.map((category) => {
                    const slug = generateSlug(category.descripcion)
                    return (
                      <Link 
                        key={category.id}
                        href={`/${slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-4 hover:bg-violet-50 rounded-xl transition-colors group border border-gray-200 hover:border-violet-300"
                      >
                        <span className="text-gray-900 group-hover:text-violet-700 font-medium text-lg">
                          {category.descripcion}
                        </span>
                        <ChevronRight className="text-gray-400 group-hover:text-violet-600 size-6" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Vista de Categorías */}
          <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out ${
            selectedLinea ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Header con gradiente violeta */}
            <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white p-4 flex items-center gap-3">
              <button
                onClick={handleBackToLineas}
                className="text-white/80 hover:text-white"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-xl font-bold flex-1">
                {selectedLinea?.descripcion}
              </h2>
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Lista scrolleable de categorías */}
            {selectedLinea && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {selectedLinea.categorias.map((category) => {
                    const slug = generateSlug(category.descripcion)
                    return (
                      <Link 
                        key={category.id}
                        href={`/${slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-4 hover:bg-violet-50 rounded-xl transition-colors group border border-gray-200 hover:border-violet-300"
                      >
                        <span className="text-gray-900 group-hover:text-violet-700 font-medium text-lg">
                          {category.descripcion}
                        </span>
                        <ChevronRight className="text-gray-400 group-hover:text-violet-600 size-6" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>,
      document.body
    )
  }

  // Vista desktop
  return (
    <div 
      ref={dropdownRef}
      className="bg-white rounded-xl shadow-2xl border border-gray-200 z-50 w-full max-w-[480px] min-w-[400px] relative"
    >
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-3">Todas las Categorías</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Líneas con categorías */}
            {lineasWithCategorias.map((linea) => (
              <div
                key={linea.id}
                className="relative"
                onMouseEnter={() => handleLineaMouseEnter(linea.id)}
                onMouseLeave={handleLineaMouseLeave}
              >
                {/* Línea principal */}
                <div className="flex items-center justify-between px-4 py-3 hover:bg-violet-50 rounded-lg transition-colors group border border-transparent hover:border-violet-200 cursor-pointer">
                  <span className="text-gray-900 group-hover:text-violet-600 font-semibold text-base">
                    {linea.descripcion}
                  </span>
                  <div className="flex items-center gap-2">
                    {linea.categorias.length > 0 && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full min-w-[24px] text-center">
                        {linea.categorias.length}
                      </span>
                    )}
                    <ChevronRight className="text-gray-400 group-hover:text-violet-600 size-5 flex-shrink-0" />
                  </div>
                </div>

                {/* Submenu de categorías (aparece al hacer hover) - Solo en desktop */}
                {hoveredLinea === linea.id && linea.categorias.length > 0 && (
                  <div 
                    data-submenu
                    className="absolute left-full top-0 ml-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-[70] min-w-[320px] max-w-[420px]"
                    onMouseEnter={handleSubmenuMouseEnter}
                    onMouseLeave={handleSubmenuMouseLeave}
                  >
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-gray-800 mb-3 px-2">{linea.descripcion}</h4>
                      <div className="space-y-1 max-h-[320px] overflow-y-auto">
                        {linea.categorias.map((category) => {
                          const slug = generateSlug(category.descripcion)
                          return (
                            <Link 
                              key={category.id}
                              href={`/${slug}`}
                              onClick={onClose}
                              className="flex items-center justify-between px-3 py-2 hover:bg-violet-50 rounded-lg transition-colors group border border-transparent hover:border-violet-200"
                            >
                              <span className="text-gray-700 group-hover:text-violet-600 font-medium text-sm">
                                {category.descripcion}
                              </span>
                              <ChevronRight className="text-gray-400 group-hover:text-violet-600 size-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Separador si hay categorías sin línea */}
            {categoriasWithoutLinea.length > 0 && lineasWithCategorias.length > 0 && (
              <div className="border-t border-gray-200 my-3"></div>
            )}

            {/* Categorías sin línea asignada */}
            {categoriasWithoutLinea.map((category) => {
              const slug = generateSlug(category.descripcion)
              return (
                <Link 
                  key={category.id}
                  href={`/${slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 hover:bg-violet-50 rounded-lg transition-colors group border border-transparent hover:border-violet-200"
                >
                  <span className="text-gray-700 group-hover:text-violet-600 font-medium text-base">
                    {category.descripcion}
                  </span>
                  <ChevronRight className="text-gray-400 group-hover:text-violet-600 size-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}