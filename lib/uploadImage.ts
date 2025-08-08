import { supabase } from './supabase'

export async function uploadImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file)

  if (error) throw error

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`
}
