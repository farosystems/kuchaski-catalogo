"use client"

import Link from "next/link"
import { Heart, Tag } from "lucide-react"
import { Product } from "@/lib/products"
import FinancingPlans from "./FinancingPlans"
import { useShoppingList } from "@/hooks/use-shopping-list"
import { formatearPrecio, isOfertaVigente } from "@/lib/supabase-products"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, removeItem, isInList } = useShoppingList()
  const productCategory = product.categoria?.descripcion || product.category || 'Sin categoría'
  const productBrand = product.marca?.descripcion || product.brand || 'Sin marca'
  const productPrice = product.precio || product.price || 0

  // Verificar si tiene oferta individual vigente
  const hasOferta = isOfertaVigente(product)
  const precioOferta = hasOferta ? product.precio_oferta! : productPrice
  const descuentoOferta = hasOferta ? product.descuento_porcentual! : 0

  // Verificar si tiene promoción con descuento significativo (>= 1%)
  const hasPromo = !!product.promo && !!product.precio_con_descuento && product.promo.descuento_porcentaje >= 1

  // Verificar si tiene promoción informativa (con descuento < 1%, incluyendo 0%)
  const hasPromoSinDescuento = !!product.promo && product.promo.descuento_porcentaje < 1

  // Debug log detallado - SIEMPRE mostrar si tiene promo
  if (product.promo) {
    console.log('🔍 ProductCard - Producto con promo:', {
      id: product.id,
      descripcion: product.descripcion?.substring(0, 40),
      'product.promo existe': !!product.promo,
      promo_nombre: product.promo?.nombre,
      'product.promo.descuento_porcentaje': product.promo?.descuento_porcentaje,
      'descuento < 1': product.promo.descuento_porcentaje < 1,
      hasPromo,
      hasPromoSinDescuento,
      'DEBERIA MOSTRARSE BADGE': hasPromoSinDescuento ? 'SI ✅' : 'NO ❌',
    })
  }

  // Determinar precio final: priorizar oferta individual sobre promoción
  const finalPrice = hasOferta ? precioOferta : (hasPromo ? product.precio_con_descuento! : productPrice)
  const hasDiscount = hasOferta || hasPromo
  const discountPercentage = hasOferta ? descuentoOferta : (hasPromo ? product.promo!.descuento_porcentaje : 0)

  const productUrl = product.categoria && product.categoria.descripcion && 
    !product.categoria.descripcion.toLowerCase().includes('categor') &&
    product.categoria.descripcion.trim() !== '' ? 
    `/${productCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/${product.id}` :
    `/varios/${product.id}`

  const isInFavorites = isInList(product.id)
  const hasStock = product.tiene_stock === true // Solo true permite agregar, undefined/null/false no permiten
  
  // Debug: log del stock
  console.log('🔍 ProductCard - Product:', product.descripcion, 'tiene_stock:', product.tiene_stock, 'hasStock:', hasStock)
  console.log('🔍 ProductCard - Tipo de tiene_stock:', typeof product.tiene_stock)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInFavorites) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  return (
    <Link href={productUrl} className="block">
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 group cursor-pointer relative ${
        hasStock
          ? 'hover:shadow-xl hover:scale-[1.03] hover:z-50 active:scale-95'
          : 'opacity-75 grayscale-[0.3]'
      }`}>
        {/* Imagen del producto */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.imagen || product.image || '/placeholder.jpg'}
            alt={product.descripcion || product.name || 'Producto'}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Icono de Favoritos - Esquina superior izquierda (solo si hay stock) */}
          {hasStock && (
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-1.5 left-1.5 p-1.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 ${
                isInFavorites
                  ? 'bg-[#ec3036] text-white'
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:text-[#ec3036]'
              }`}
              title={isInFavorites ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-all duration-300 ${
                  isInFavorites ? 'fill-current' : ''
                }`}
              />
            </button>
          )}

          {/* Badge Sin Stock - Esquina superior derecha */}
          {!hasStock && (
            <div className="absolute top-1.5 right-1.5 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold shadow-lg">
              Sin Stock
            </div>
          )}

          {/* Badge Oferta/Promoción - Esquina superior derecha (prioridad sobre destacado) */}
          {hasDiscount && hasStock && (
            <div className="absolute top-1.5 right-1.5 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <Tag className="w-3 h-3" />
              -{discountPercentage}%
            </div>
          )}

          {/* Badge Destacado - Esquina superior derecha (solo si hay stock y no hay oferta/promo) */}
          {product.destacado && hasStock && !hasDiscount && (
            <div className="absolute top-1.5 right-1.5 bg-yellow-400 text-black px-1.5 py-0.5 rounded-full text-xs font-semibold shadow-lg">
              Destacado
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="p-2">
          {/* Marca */}
          <div className="flex gap-1 mb-1 flex-wrap">
            <span className="text-xs text-white bg-gradient-to-r from-orange-500 to-orange-600 px-1.5 py-0.5 rounded-full truncate font-semibold shadow-sm">
              {productBrand}
            </span>
          </div>

          {/* Título del producto */}
          <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
            {product.descripcion || product.name || 'Sin descripción'}
          </h3>

          {/* Badge de Promoción Sin Descuento - Similar a las imágenes */}
          {(() => {
            if (hasPromoSinDescuento && product.promo) {
              console.log('✅ RENDERIZANDO BADGE para producto:', product.id, product.promo.nombre)
              return (
                <div className="mb-2 bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-400 rounded-lg p-3 shadow-md">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Tag className="w-4 h-4 text-orange-700" />
                    <span className="text-sm font-bold text-orange-900 uppercase tracking-wide">
                      {product.promo.nombre}
                    </span>
                  </div>
                  {product.promo.descripcion && (
                    <p className="text-xs text-orange-800 leading-tight font-medium">
                      {product.promo.descripcion}
                    </p>
                  )}
                  {product.promo.fecha_inicio && product.promo.fecha_fin && (
                    <p className="text-xs text-orange-700 mt-1.5 uppercase font-bold">
                      Válida hasta el {new Date(product.promo.fecha_fin).toLocaleDateString('es-AR')} - PAGO CONTADO
                    </p>
                  )}
                </div>
              )
            }
            return null
          })()}

          {/* Precio - Siempre visible */}
          <div className="mb-2">
            {hasOferta && hasPromo && product.promo && product.precio_con_descuento ? (
              // Tiene AMBOS: oferta individual Y promoción
              <>
                {/* Precio de oferta */}
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-semibold text-red-600 line-through decoration-2">
                      ${formatearPrecio(productPrice)}
                    </span>
                    <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded-full">
                      -{descuentoOferta}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${formatearPrecio(precioOferta)}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">Precio Oferta</div>
                </div>

                {/* Precio de promoción */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-orange-600 line-through decoration-2">
                      ${formatearPrecio(productPrice)}
                    </span>
                    <span className="text-xs font-bold text-white bg-orange-600 px-2 py-0.5 rounded-full">
                      -{product.promo.descuento_porcentaje}%
                    </span>
                  </div>
                  <div className="text-xl font-bold text-orange-600">
                    ${formatearPrecio(product.precio_con_descuento)}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">{product.promo.nombre}</div>
                </div>
              </>
            ) : hasDiscount ? (
              // Solo oferta O solo promoción con descuento
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-semibold text-red-600 line-through decoration-2">
                    ${formatearPrecio(productPrice)}
                  </span>
                  <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded-full">
                    -{discountPercentage}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${formatearPrecio(finalPrice)}
                </div>
              </>
            ) : (
              // Sin oferta ni promoción (o con promo sin descuento): precio normal
              <div className="text-xl font-bold text-orange-600">
                ${formatearPrecio(productPrice)}
              </div>
            )}
          </div>

          {/* Planes de Financiación - Versión simplificada */}
          <FinancingPlans productoId={product.id} precio={hasOferta ? precioOferta : productPrice} />
        </div>
      </div>
    </Link>
  )
}
