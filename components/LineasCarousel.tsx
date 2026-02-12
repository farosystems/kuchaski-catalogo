"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Package, ChevronLeft, ChevronRight } from "lucide-react"
import { getLineasConProductos } from "@/lib/supabase-products"
import { Linea } from "@/lib/products"

function getSlug(descripcion: string) {
  return descripcion
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function LineasCarousel() {
  const [lineas, setLineas] = useState<Linea[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLineasConProductos()
        setLineas(data)
      } catch (err) {
        console.error('Error loading lineas:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.6
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    })
  }

  if (loading || lineas.length === 0) return null

  return (
    <section className="py-5 sm:py-6 bg-white relative">
      {/* Flecha izquierda */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md p-1 rounded-full hidden sm:flex items-center justify-center"
        aria-label="Anterior"
      >
        <ChevronLeft size={22} className="text-gray-700" />
      </button>

      {/* Contenedor scroll */}
      <div
        ref={scrollRef}
        className="flex justify-center gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-8 overflow-x-auto"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {lineas.map((linea) => (
          <Link
            key={linea.id}
            href={`/lineas/${getSlug(linea.descripcion)}`}
            className="flex-shrink-0 flex flex-col items-center gap-2 group w-24 sm:w-28 lg:w-40"
          >
            {/* Círculo naranja con imagen */}
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: '#ff8727' }}
            >
              {linea.imagen ? (
                <img
                  src={linea.imagen}
                  alt={linea.descripcion}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package size={34} className="text-white lg:size-12" />
              )}
            </div>

            {/* Nombre de la línea */}
            <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center leading-tight">
              {linea.descripcion}
            </span>
          </Link>
        ))}
      </div>

      {/* Flecha derecha */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md p-1 rounded-full hidden sm:flex items-center justify-center"
        aria-label="Siguiente"
      >
        <ChevronRight size={22} className="text-gray-700" />
      </button>
    </section>
  )
}
