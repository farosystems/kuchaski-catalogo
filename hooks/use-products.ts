'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Product, Categoria, Marca } from '@/lib/products'
import { 
  getProducts, 
  getFeaturedProducts, 
  getProductsByCategory, 
  getProductsByBrand,
  getCategories,
  getBrands
} from '@/lib/supabase-products'

export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Categoria[]>([])
  const [brands, setBrands] = useState<Marca[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentFilter, setCurrentFilter] = useState<{type: 'category' | 'brand' | null, id: number | null}>({type: null, id: null})

  // Memoizar productos filtrados
  const products = useMemo(() => {
    if (!currentFilter.type || !currentFilter.id) return allProducts
    
    if (currentFilter.type === 'category') {
      return allProducts.filter(p => p.fk_id_categoria === currentFilter.id)
    }
    return allProducts.filter(p => p.fk_id_marca === currentFilter.id)
  }, [allProducts, currentFilter])

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)

      const featuredData = await getFeaturedProducts()
      const productsData = await getProducts()
      const categoriesData = await getCategories()
      const brandsData = await getBrands()

      //console.log('🔍 useProducts - Datos cargados:', {
        //featured: featuredData.length,
       // products: productsData.length,
        //categories: categoriesData.length,
        //brands: brandsData.length
      //})

      // Debug detallado de productos
      //console.log('🔍 useProducts - Primeros 5 productos:', productsData.slice(0, 5).map(p => ({
        //id: p.id,
        //descripcion: p.descripcion,
        //precio: p.precio,
        //categoria: p.categoria?.descripcion,
        //marca: p.marca?.descripcion
      //})))

      // Verificar productos con precio > 0
      const productosConPrecio = productsData.filter(p => (p.precio || 0) > 0)
      //console.log('🔍 useProducts - Productos con precio > 0:', productosConPrecio.length)

      setAllProducts(productsData)
      setFeaturedProducts(featuredData)
      setCategories(categoriesData)
      setBrands(brandsData)
      
    } catch (err) {
      setError('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  // Callbacks memoizados para filtros
  const filterByCategory = useCallback((categoryId: number | null) => {
    setCurrentFilter({type: categoryId ? 'category' : null, id: categoryId})
  }, [])

  const filterByBrand = useCallback((brandId: number | null) => {
    setCurrentFilter({type: brandId ? 'brand' : null, id: brandId})
  }, [])

  const clearFilters = useCallback(() => {
    setCurrentFilter({type: null, id: null})
  }, [])

  return {
    products,
    featuredProducts,
    categories,
    brands,
    loading,
    error,
    filterByCategory,
    filterByBrand,
    clearFilters,
    refresh: loadInitialData
  }
} 