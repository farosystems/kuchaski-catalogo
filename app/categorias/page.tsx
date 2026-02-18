'use client'

import { useState, useEffect } from 'react'
import { Categoria } from '@/lib/products'
import { getCategoriesConProductos } from '@/lib/supabase-products'
import Link from 'next/link'
import GlobalAppBar from '@/components/GlobalAppBar'
import Footer from '@/components/Footer'
import { 
  Home, 
  Tv, 
  Refrigerator, 
  WashingMachine, 
  Microwave, 
  AirVent,
  Lightbulb,
  Volume2,
  Monitor,
  Smartphone,
  Package,
  Wrench,
  Zap,
  Camera,
  Coffee,
  Fan
} from 'lucide-react'

// Mapeo de categorías a iconos
const categoryIcons: { [key: string]: React.ComponentType<any> } = {
  'televisores': Tv,
  'televisión': Tv,
  'tv': Tv,
  'heladeras': Refrigerator,
  'refrigeradores': Refrigerator,
  'freezers': Refrigerator,
  'lavarropas': WashingMachine,
  'lavadoras': WashingMachine,
  'microondas': Microwave,
  'hornos': Microwave,
  'aire acondicionado': AirVent,
  'aires': AirVent,
  'climatización': AirVent,
  'iluminación': Lightbulb,
  'lámparas': Lightbulb,
  'luces': Lightbulb,
  'audio': Volume2,
  'sonido': Volume2,
  'parlantes': Volume2,
  'computadoras': Monitor,
  'notebooks': Monitor,
  'pc': Monitor,
  'celulares': Smartphone,
  'teléfonos': Smartphone,
  'móviles': Smartphone,
  'pequeños electrodomésticos': Package,
  'electrodomésticos': Package,
  'herramientas': Wrench,
  'electricidad': Zap,
  'electrónica': Zap,
  'cámaras': Camera,
  'fotografía': Camera,
  'cafeteras': Coffee,
  'cocina': Coffee,
  'ventiladores': Fan,
  'ventilación': Fan
}

// Función para obtener el icono de una categoría
function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase()
  
  // Buscar coincidencia exacta primero
  if (categoryIcons[name]) {
    return categoryIcons[name]
  }
  
  // Buscar coincidencias parciales
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (name.includes(key) || key.includes(name)) {
      return icon
    }
  }
  
  // Icono por defecto
  return Package
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategoriesConProductos()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando categorías...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <GlobalAppBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Home className="text-emerald-600 mr-3" size={48} />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Mapa del Sitio
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora todas nuestras categorías de productos y encuentra exactamente lo que necesitas
          </p>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Inicio
          </Link>
          <span className="mx-2">•</span>
          <span className="text-gray-900 font-medium">Categorías</span>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const slug = category.descripcion?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
            
            const IconComponent = getCategoryIcon(category.descripcion || '')
            
            return (
              <Link 
                key={category.id}
                href={`/${slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-emerald-200 transform group-hover:scale-105">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full p-4 mb-4 group-hover:from-emerald-600 group-hover:to-blue-600 transition-colors duration-300">
                      <IconComponent className="text-white" size={32} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">
                      {category.descripcion}
                    </h3>
                    
                    <p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-300">
                      Ver categorias
                    </p>
                    
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                        Explorar →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold py-3 px-8 rounded-full hover:from-emerald-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="mr-2" size={20} />
            Volver al Inicio
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}