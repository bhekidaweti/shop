// app/api/cloudprint/route.ts
import { NextResponse } from "next/server";

// Handle GET request (fetch available products, sizes, colors, etc.)
export async function GET() {
  return NextResponse.json({ message: "Cloudprinter GET endpoint works 🚀" });
}

// Handle POST request (send order to Cloudprinter)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Example: { productId, size, color, quantity }

    // send to Cloudprinter API
    const cloudRes = await fetch("https://api.sandbox.cloudprinter.com/cloudcore/1.0/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CLOUDPRINTER_API_KEY}`, // make sure it's set in .env.local
      },
      body: JSON.stringify({
        product: body.productId,
        options: {
          size: body.size,
          color: body.color,
        },
        quantity: body.quantity,
        shipping: body.shipping,
      }),
    });

    const result = await cloudRes.json();
    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
