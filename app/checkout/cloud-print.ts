import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { customer, items } = req.body

  if (!customer || !items) {
    return res.status(400).json({ error: 'Missing customer or items' })
  }

  try {
    const orderPayload = {
      reference: `ORDER-${Date.now()}`,
      shipping: {
        firstname: customer.name.split(' ')[0] || customer.name,
        lastname: customer.name.split(' ')[1] || '',
        address1: customer.address,
        city: 'Unknown', // TODO: parse from address if structured
        country: 'ZA',   // adjust if needed
        zip: '0000',     // adjust if needed
      },
      items: items.map((item: any) => ({
        product: item.id,
        count: item.quantity,
        files: [
          // Must be replaced with real print files
          { type: 'cover', url: 'https://example.com/cover.pdf' },
          { type: 'body', url: 'https://example.com/book.pdf' },
        ],
      })),
    }

    const resp = await fetch('https://api.cloudprinter.com/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLOUDPRINTER_API_KEY}`,
      },
      body: JSON.stringify(orderPayload),
    })

    const data = await resp.json()

    if (!resp.ok) {
      return res.status(resp.status).json(data)
    }

    res.status(200).json(data)
  } catch (err: any) {
    console.error('Cloudprint checkout error:', err)
    res.status(500).json({ error: err.message })
  }
}
