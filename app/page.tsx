'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getProducts, Product } from '@/lib/getProducts'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [specials, setSpecials] = useState<Product[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data)
      setSpecials(data.filter((item) => item.special)) 
    })
  }, [])

  const handleAdd = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      special: product.special,
      quantity: 1,
    })
  }

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to Wine SA</h1>

      {/* 🎯 Latest Specials */}
      {specials.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-center">🍷 Our Latest Specials</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={specials.length > 3}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {specials.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="border p-4 rounded shadow-sm h-full flex flex-col bg-yellow-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover mb-2 rounded"
                  />
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-red-600 font-bold mt-2">
                    R{product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleAdd(product)}
                    className="mt-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* 🛍️ Regular Products */}
      <section className="mb-8">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={products.length > 3}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="border p-4 rounded shadow-sm h-full flex flex-col">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-blue-600 font-bold mt-2">
                  R{product.price.toFixed(2)}
                </p>
                <button
                  onClick={() => handleAdd(product)}
                  className="mt-auto bg-maroon-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <div className="text-center">
        <Link
          href="/shop"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Explore More Wines
        </Link>
      </div>
    </main>
  )
}

