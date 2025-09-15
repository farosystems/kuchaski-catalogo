"use client"

import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { useShoppingList } from '@/hooks/use-shopping-list'
import { Product } from '@/lib/products'

interface AddToListButtonProps {
  product: Product
  variant?: 'card' | 'page'
}

export default function AddToListButton({ product, variant = 'card' }: AddToListButtonProps) {
  const { addItem, removeItem, isInList } = useShoppingList()
  const [isAdding, setIsAdding] = useState(false)
  const hasStock = product.tiene_stock === true // Solo true permite agregar, undefined/null/false no permiten
  
  // Debug: log del stock
  console.log('🔍 AddToListButton - Product:', product.descripcion, 'tiene_stock:', product.tiene_stock, 'hasStock:', hasStock)
  console.log('🔍 AddToListButton - Tipo de tiene_stock:', typeof product.tiene_stock)

  const handleToggleList = () => {
    // No permitir acciones si no hay stock
    if (!hasStock) {
      return
    }

    setIsAdding(true)

    if (isInShoppingList) {
      removeItem(product.id)
    } else {
      addItem(product)
    }

    // Mostrar feedback visual
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const isInShoppingList = isInList(product.id)

  if (variant === 'card') {
    return (
      <button
        onClick={handleToggleList}
        disabled={isAdding || !hasStock}
        className={`w-full py-1.5 px-3 rounded-xl font-semibold transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
          !hasStock
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60 pointer-events-none'
            : isInShoppingList
            ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700'
            : isAdding
            ? 'bg-violet-100 text-violet-700 cursor-not-allowed'
            : 'bg-violet-600 text-white hover:bg-violet-700 hover:scale-105 shadow-lg hover:shadow-xl'
        }`}
        title={
          !hasStock
            ? 'Sin stock'
            : isInShoppingList
            ? 'Quitar de la lista'
            : 'Agregar a lista de compra'
        }
      >
        {!hasStock ? (
          <>
            Sin Stock
          </>
        ) : isAdding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            Agregando...
          </>
        ) : isInShoppingList ? (
          <>
            <Check size={16} />
            Quitar de lista
          </>
        ) : (
          <>
            <Plus size={16} />
            Agregar a lista
          </>
        )}
      </button>
    )
  }

  // Variante para página de producto
  return (
    <button
      onClick={handleToggleList}
      disabled={isAdding || !hasStock}
      className={`w-full py-2 px-4 rounded-xl font-semibold transition-all duration-300 text-base shadow-md flex items-center justify-center gap-2 ${
        !hasStock
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60 pointer-events-none'
          : isInShoppingList
          ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700'
          : isAdding
          ? 'bg-violet-100 text-violet-700 cursor-not-allowed'
          : 'bg-violet-600 text-white hover:bg-violet-700 hover:scale-102 hover:shadow-lg'
      }`}
      title={
        !hasStock
          ? 'Sin stock'
          : isInShoppingList
          ? 'Quitar de la lista'
          : 'Agregar a lista de compra'
      }
    >
      {!hasStock ? (
        <>
          Sin Stock
        </>
      ) : isAdding ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
          Agregando...
        </>
      ) : isInShoppingList ? (
        <>
          <Check size={20} />
          Quitar de la lista
        </>
      ) : (
        <>
          <Plus size={20} />
          Agregar a lista de compra
        </>
      )}
    </button>
  )
}
