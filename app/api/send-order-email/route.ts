import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, address, items, total } = await req.json();
    const adminEmail = process.env.ADMIN_EMAIL;

    const itemsList = items
      .map((item: any) => `<li>${item.name} (x${item.quantity})</li>`)
      .join('');

    const customerHtml = `
      <h2>Order Confirmation</h2>
      <p>Hi ${name},</p>
      <p>Thank you for your order!</p>
      <p><strong>Items:</strong></p>
      <ul>${itemsList}</ul>
      <p><strong>Total:</strong> R ${total.toFixed(2)}</p>
      <p><strong>Delivery Address:</strong> ${address}</p>
      <p>We'll contact you shortly for delivery confirmation.</p>
    `;

    const adminHtml = `
      <h2>New Order Received</h2>
      <p><strong>Customer:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Total:</strong> R ${total.toFixed(2)}</p>
      <p><strong>Items:</strong></p>
      <ul>${itemsList}</ul>
    `;

    // Send confirmation to customer
    await resend.emails.send({
      from: 'Wine SA <onboarding@resend.dev>',
      to: email,
      subject: '✅ We’ve received your order!',
      html: customerHtml,
    });

    // Send notification to admin
    if (!adminEmail) {
      throw new Error('Admin email is not configured.');
    }
    await resend.emails.send({
      from: 'Wine SA <onboarding@resend.dev>',
      to: adminEmail,
      subject: `🛒 New Order from ${name}`,
      html: adminHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending failed:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

