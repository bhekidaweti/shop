'use client'

import { Product } from '../lib/getProducts'
import Image from 'next/image'

type Props = { product: Product }

export default function ProductCard({ product }: Props) {
  const handleBuy = () => {
    // client‑side redirect to your own PayFast API route
    window.location.href = `/api/payfast?productId=${product.id}`
  }

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <Image
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h2 className="text-xl font-semibold">{product.name}</h2>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="font-bold mb-4">R{product.price.toFixed(2)}</p>
      <button
        onClick={handleBuy}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Buy with PayFast
      </button>
    </div>
  )
}
