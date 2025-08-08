import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // This key must have read access to the products table
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  const amountParam = searchParams.get('amount')
  const itemNameParam = searchParams.get('item_name')

  let price: string
  let itemName: string

  if (productId) {
    // Fetch product from Supabase
    const { data: product, error } = await supabase
      .from('products')
      .select('id, name, price')
      .eq('id', productId)
      .single()

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    price = product.price.toFixed(2)
    itemName = product.name
  } else if (amountParam && itemNameParam) {
    // Handle cart purchase
    price = parseFloat(amountParam).toFixed(2)
    itemName = itemNameParam
  } else {
    return NextResponse.json(
      { error: 'Missing productId or amount/item_name' },
      { status: 400 }
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_APP_URL not set' },
      { status: 500 }
    )
  }

  const params = new URLSearchParams({
    merchant_id: process.env.PAYFAST_MERCHANT_ID!,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
    amount: price,
    item_name: itemName,
    return_url: `${appUrl}/shop/success`,
    cancel_url: `${appUrl}/shop/cancel`,
    notify_url: `${appUrl}/api/payfast-ipn`,
  })

  const payfastUrl =
    process.env.PAYFAST_MODE === 'live'
      ? 'https://www.payfast.co.za/eng/process'
      : 'https://sandbox.payfast.co.za/eng/process'

  return NextResponse.redirect(`${payfastUrl}?${params.toString()}`)
}
