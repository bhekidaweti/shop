export interface CartItem {
  id: number
  name: string
  price: number
  image?: string
  quantity: number
  special?: boolean
  source?: 'local' | 'cloud' 
}
interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  increaseQuantity: (id: number) => void
  decreaseQuantity: (id: number) => void
}
