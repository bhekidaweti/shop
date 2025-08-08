'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product, getProducts } from '@/lib/getProducts'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const handleAdd = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <p className="text-center py-10">Loading products...</p>
  }

  if (products.length === 0) {
    return <p className="text-center py-10">No products available.</p>
  }

  return (
    <main className="p-6">
      {/* Admin Button */}
      {!authLoading && user?.email === ADMIN_EMAIL && (
        <div className="mb-6 text-right">
          <button
            onClick={() => router.push('/shop/admin')}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Admin
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-blue-600 font-semibold mt-2">
              R{product.price.toFixed(2)}
            </p>
            <p className="text-xs text-green-600">
              {product.special ? '🌟 Special Offer' : ''}
            </p>

            <button
              onClick={() => handleAdd(product)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
