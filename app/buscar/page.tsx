"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Package } from "lucide-react"
import GlobalAppBar from "@/components/GlobalAppBar"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import Pagination from "@/components/Pagination"
import { useProducts } from "@/hooks/use-products"

const PRODUCTS_PER_PAGE = 6

export default function BuscarPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [animateProducts, setAnimateProducts] = useState(false)

  const { 
    products, 
    loading, 
    error 
  } = useProducts()

  // Obtener parámetros de la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchParam = urlParams.get('q')
    
    if (searchParam) {
      setSearchTerm(searchParam)
    }
  }, [])

  // Filtrar productos por búsqueda global
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return []
    
    return products.filter((product) => {
      const productName = product.descripcion || ''
      const productDescription = product.descripcion_detallada || ''
      const categoryName = product.categoria?.descripcion || ''
      const brandName = product.marca?.descripcion || ''
      const searchLower = searchTerm.toLowerCase()

      return productName.toLowerCase().includes(searchLower) ||
             productDescription.toLowerCase().includes(searchLower) ||
             categoryName.toLowerCase().includes(searchLower) ||
             brandName.toLowerCase().includes(searchLower)
    })
  }, [products, searchTerm])

  // Calcular paginación
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1)
    setAnimateProducts(true)
    const timer = setTimeout(() => setAnimateProducts(false), 100)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleClearFilters = () => {
    setSearchTerm("")
    setCurrentPage(1)
    // Actualizar URL
    window.history.replaceState({}, '', '/buscar')
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setAnimateProducts(true)
    const timer = setTimeout(() => setAnimateProducts(false), 100)

    // Scroll suave al inicio de los productos
    document.getElementById("productos-grid")?.scrollIntoView({ behavior: "smooth" })

    return () => clearTimeout(timer)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Actualizar URL con el término de búsqueda
    const url = new URL(window.location.href)
    if (value.trim()) {
      url.searchParams.set('q', value)
    } else {
      url.searchParams.delete('q')
    }
    window.history.replaceState({}, '', url.toString())
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <GlobalAppBar />
        <div className="flex items-center justify-center py-20" style={{ marginTop: '10px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900">Cargando productos...</h2>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <GlobalAppBar />
        <div className="flex items-center justify-center py-20" style={{ marginTop: '140px' }}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar productos</h2>
            <p className="text-xl text-red-600">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <GlobalAppBar />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-4" style={{ marginTop: '40px' }}>
        {/* Buscador principal */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              Búsqueda de Productos
            </h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Buscar productos, marcas, categorías..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-16 pr-4 py-6 bg-white border-2 border-gray-200 rounded-2xl shadow-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 text-xl placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* Resultados header */}
        {searchTerm && (
          <div className="mb-8">
            <div className="text-center w-full">
              <p className="text-gray-600 mb-4 text-lg">
                {filteredProducts.length > 0 
                  ? `${filteredProducts.length} resultados para "${searchTerm}"`
                  : `No se encontraron resultados para "${searchTerm}"`
                }
              </p>
              <div className="mt-2">
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  <Package className="mr-2" size={16} />
                  Limpiar búsqueda
                </button>
              </div>
            </div>

            {/* Información de resultados */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-between text-sm text-gray-600 mt-6 bg-white rounded-lg p-4 shadow-sm">
                <span>
                  Mostrando {startIndex + 1}-{Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} productos
                </span>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Estado inicial sin búsqueda */}
        {!searchTerm && (
          <div className="text-center py-20">
            <Search size={80} className="mx-auto mb-6 text-gray-300" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              ¿Qué estás buscando?
            </h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Utiliza el buscador para encontrar productos, marcas o categorías específicas
            </p>
          </div>
        )}

        {/* Grid de Productos */}
        {searchTerm && (
          <div id="productos-grid" className="mb-12">
            {filteredProducts.length > 0 ? (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300 ${
                animateProducts ? 'opacity-50' : 'opacity-100'
              }`}>
                {paginatedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-500 mb-6">
                  No hay productos que coincidan con "{searchTerm}"
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    Intenta con términos más generales o revisa la ortografía
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Nueva búsqueda
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Paginación */}
        {searchTerm && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <Footer />
    </div>
  )
}