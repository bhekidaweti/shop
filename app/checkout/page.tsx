'use client'

import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [success, setSuccess] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const notifyOrder = async (orderData: {
    name: string
    email: string
    address: string
    items: any[]
    total: number
  }) => {
    try {
      const res = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Error from send-order-email:', errorText)
        alert('Failed to send order confirmation email.')
      }
    } catch (err) {
      console.error('Error calling send-order-email:', err)
      alert('Something went wrong sending the confirmation email.')
    }
  }

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!name || !email || !address) return alert('Please fill in all fields.')

  // Save order to Supabase
  const { error } = await supabase.from('orders').insert([
    {
      name,
      email,
      address,
      items: cart,
      total,
    },
  ])

  if (error) {
    console.error('Supabase insert error:', error)
    return alert('Something went wrong saving your order.')
  }

  // Send confirmation email
  await notifyOrder({ name, email, address, items: cart, total })

  // Redirect to PayFast
  const params = new URLSearchParams({
    amount: total.toFixed(2),
    item_name: 'Your Cart',
  })

  window.location.href = `/api/payfast?${params.toString()}`
}


  // ✅ Move success screen here (outside the submit handler)
  if (success) {
    return (
      <div className="max-w-xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Thank you for your order!</h1>
        <p>We've received your order and will contact you shortly.</p>
      </div>
    )
  }

  return (
    <main className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <ul className="mb-6">
        {cart.map((item) => (
          <li key={item.id} className="flex justify-between mb-2">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>R {item.price * item.quantity}</span>
          </li>
        ))}
      </ul>

      <p className="font-semibold text-lg mb-4">Total: R {total.toFixed(2)}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          placeholder="Delivery Address"
          className="w-full border p-2 rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Place Order
        </button>
      </form>
    </main>
  )
}
