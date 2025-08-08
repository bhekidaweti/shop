import { supabase } from './supabase'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  special?: boolean
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Product[]
}

export async function addProduct(data: Omit<Product, 'id'>): Promise<Product> {
  const { data: inserted, error } = await supabase
    .from('products')
    .insert([data])
    .select()
    .single()

  if (error) throw error
  return inserted as Product
}

export async function updateProduct(id: number, data: Omit<Product, 'id'>): Promise<Product> {
  const { data: updated, error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return updated as Product
}

export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}
