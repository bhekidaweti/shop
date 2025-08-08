import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Setup Supabase server client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
)

export async function POST(req: Request) {
  const bodyText = await req.text()
  const params = new URLSearchParams(bodyText)

  const paymentStatus = params.get('payment_status') // Should be 'COMPLETE'
  const amountGross = params.get('amount_gross')
  const nameFirst = params.get('name_first')
  const emailAddress = params.get('email_address')

  if (paymentStatus !== 'COMPLETE') {
    return NextResponse.json({ status: 'Payment not completed' })
  }

  // 🔒 Optionally verify PayFast signature here (for production use)

  // ✅ Match order by email and total
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('email', emailAddress)
    .eq('total', Number(amountGross))
    .eq('payment_status', 'pending')

  if (error || !orders || orders.length === 0) {
    console.error('No matching order found:', error)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const order = orders[0]

  // ✅ Update payment status to 'paid'
  const { error: updateError } = await supabase
    .from('orders')
    .update({ payment_status: 'paid' })
    .eq('id', order.id)

  if (updateError) {
    console.error('Failed to update order status:', updateError)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
