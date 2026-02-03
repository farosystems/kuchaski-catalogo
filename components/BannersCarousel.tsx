"use client"

import { useEffect, useState } from "react"
import { getBanners } from "@/lib/supabase-config"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function BannersCarousel() {
  const [banners, setBanners] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Cargar banners
  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoading(true)
        const bannersData = await getBanners()
        setBanners(bannersData)
      } catch (error) {
        console.error('Error al cargar banners:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBanners()
  }, [])

  // Auto-deslizamiento
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 4000) // Cambia cada 4 segundos

    return () => clearInterval(interval)
  }, [banners.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Si no hay banners, no mostrar nada
  if (loading || banners.length === 0) {
    return null
  }

  return (
    <section className="w-full">
      <div className="relative group w-full overflow-hidden">
        {/* Banners */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={index}
              className="min-w-full max-w-full flex-shrink-0 h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px]"
            >
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Botones de navegación - Solo si hay más de 1 banner */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-md opacity-60 hover:opacity-100 transition-opacity duration-300"
              aria-label="Banner anterior"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-md opacity-60 hover:opacity-100 transition-opacity duration-300"
              aria-label="Banner siguiente"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        {/* Indicadores superpuestos sobre el banner */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-6 h-2.5 bg-white"
                    : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Ir al banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
