'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const { cart } = useCart()
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const isAdmin = user?.email === 'bheki.daweti@gmail.com' // Replace with your actual admin email

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold flex items-center">
          <Image
            src="https://fcefxcqyzajserstfrxj.supabase.co/storage/v1/object/public/product-image/wine_sa/wine-sa-logo.png"
            alt="logo"
            width={120}
            height={60}
            priority
            className="object-contain"
          />
        </Link>

        {/* Burger menu button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>

        {/* Nav items */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:flex md:items-center md:space-x-4 w-full md:w-auto mt-3 md:mt-0`}
        >
          <Link href="/shop" className="block px-3 py-2 hover:underline">
            Shop
          </Link>

          <Link href="/cart" className="relative block px-3 py-2 hover:underline">
            🛒 Cart
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {itemCount}
              </span>
            )}
          </Link>

          {!user ? (
            <>
              <Link href="/login" className="block px-3 py-2 hover:underline">
                Login
              </Link>
              <Link href="/signup" className="block px-3 py-2 hover:underline">
                Signup
              </Link>
            </>
          ) : (
            <>
              <span className="block px-3 py-2 text-gray-600">
                Hi, {user.email}
              </span>

              {isAdmin && (
                <Link href="shop/admin" className="block px-3 py-2 hover:underline">
                  Admin
                </Link>
              )}

              <button
                onClick={logout}
                className="block px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
