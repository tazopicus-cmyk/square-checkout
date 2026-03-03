import { NextRequest, NextResponse } from 'next/server';
import { calculateTotal, getProduct } from '@/lib/products';

export async function POST(request: NextRequest) {
  try {
    const { productIds } = await request.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'No products selected' },
        { status: 400 }
      );
    }

    // SECURITY: Calculate total on SERVER, never trust client prices
    const total = calculateTotal(productIds);
    if (total === 0) {
      return NextResponse.json(
        { error: 'Invalid products' },
        { status: 400 }
      );
    }

    // Build line items from product IDs (server-side)
    const lineItems = productIds
      .map((id) => {
        const product = getProduct(id);
        if (!product) return null;
        return {
          name: product.name,
          quantity: '1',
          basePriceMoney: {
            amount: BigInt(product.price),
            currency: 'USD',
          },
        };
      })
      .filter(Boolean);

    // Get Square credentials from environment
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;
    const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox';

    if (!accessToken || !locationId) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const baseUrl =
      environment === 'production'
        ? 'https://connect.squareup.com'
        : 'https://connect.squareupsandbox.com';

    // Create Square order
    const orderResponse = await fetch(`${baseUrl}/v2/orders`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: {
          locationId,
          lineItems,
          checkoutOptions: {
            redirectUrl: `${request.headers.get('origin')}/success`,
          },
        },
        idempotencyKey: crypto.randomUUID(),
      }),
    });

    const orderData = await orderResponse.json();

    if (orderData.errors) {
      console.error('Square order errors:', orderData.errors);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create checkout link
    const checkoutResponse = await fetch(
      `${baseUrl}/v2/online-checkout/payment-links`,
      {
        method: 'POST',
        headers: {
          'Square-Version': '2024-01-18',
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentLink: {
            orderId: orderData.order.id,
            checkoutOptions: {
              redirectUrl: `${request.headers.get('origin')}/success`,
            },
          },
          idempotencyKey: crypto.randomUUID(),
        }),
      }
    );

    const checkoutData = await checkoutResponse.json();

    if (checkoutData.errors) {
      console.error('Square checkout errors:', checkoutData.errors);
      return NextResponse.json(
        { error: 'Failed to create payment link' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutUrl: checkoutData.paymentLink.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
