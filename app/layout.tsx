import { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import './globals.css'

export const metadata = {
  title: 'Wine SA Shop',
  description: 'UnLabaled Wine Sellers ',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800 font-sans">
        <AuthProvider>     
          <CartProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-10">{children}</main>
          <footer className="bg-gray-100 mt-10 py-6 border-t text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Wine SA. All rights reserved.
          </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

