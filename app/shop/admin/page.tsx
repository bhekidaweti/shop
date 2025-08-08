'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  Product
} from '@/lib/getProducts'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

export default function AdminProductUpload() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [success, setSuccess] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [isSpecial, setIsSpecial] = useState(false)

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.email !== ADMIN_EMAIL)) {
      router.push('/shop')
    }
  }, [user, loading, router])

  // Fetch products
  useEffect(() => {
    getProducts().then(setProducts).catch(console.error)
  }, [])

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        name,
        description,
        price: parseFloat(price),
        image,
      }

      if (editingProductId !== null) {
        const updated = await updateProduct(editingProductId, data)
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProductId ? updated : p))
        )
      } else {
        const newProd = await addProduct(data)
        setProducts((prev) => [newProd, ...prev])
      }

      setSuccess(true)
      setEditingProductId(null)
      setName('')
      setPrice('')
      setDescription('')
      setImage('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error adding/updating product:', err)
    }
  }

  // Guard until auth loads
  if (loading || !user || user.email !== ADMIN_EMAIL) {
    return null
  }

  return (
    <main className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Admin: Manage Products</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 border p-6 rounded">
        <h2 className="text-lg font-semibold">
          {success
            ? '✔️ Success!'
            : editingProductId
            ? 'Edit Product'
            : 'Add New Product'}
        </h2>
        {success && (
          <p className="text-green-600">
            {editingProductId ? 'Product updated.' : 'Product added.'}
          </p>
        )}
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full border p-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          className="w-full border p-2"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isSpecial"
            checked={isSpecial}
            onChange={(e) => setIsSpecial(e.target.checked)}
          />
          <label htmlFor="isSpecial">Special</label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingProductId ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      {/* Product list */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Current Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-600">No products yet.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((p) => (
              <li
                key={p.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-sm text-gray-600">R {p.price.toFixed(2)}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingProductId(p.id)
                      setName(p.name)
                      setPrice(p.price.toString())
                      setDescription(p.description)
                      setImage(p.image)
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this product?')) {
                        try {
                          await deleteProduct(p.id)
                          setProducts((prev) =>
                            prev.filter((prod) => prod.id !== p.id)
                          )
                        } catch (err) {
                          console.error('Error deleting product:', err)
                        }
                      }
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
