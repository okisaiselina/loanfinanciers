// app/api/paystack/initialize/route.ts

export async function POST(request: Request) {
  try {
    console.log('[PAYSTACK] ============================================');
    console.log('[PAYSTACK] PAYMENT INITIALIZATION STARTED');
    console.log('[PAYSTACK] ============================================\n');

    const { amount, email, reference, fullName, phoneNumber } = await request.json();

    // Validate request
    if (!amount || !email || !reference) {
      console.error('[PAYSTACK] Missing required fields');
      return Response.json(
        { error: 'Missing required fields: amount, email, reference' },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      console.error('[PAYSTACK] Invalid amount:', amount);
      return Response.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Load environment variables
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const publicKey = process.env.PAYSTACK_PUBLIC_KEY;

    console.log('[PAYSTACK] Environment check:');
    console.log('[PAYSTACK]   PAYSTACK_SECRET_KEY:', secretKey ? '✓ LOADED' : '✗ NOT SET');
    console.log('[PAYSTACK]   PAYSTACK_PUBLIC_KEY:', publicKey ? '✓ LOADED' : '✗ NOT SET');

    if (!secretKey || !publicKey) {
      console.error('[PAYSTACK] Missing environment variables');
      return Response.json(
        {
          error: 'Payment service not configured',
          missing: {
            secret: !secretKey ? 'PAYSTACK_SECRET_KEY' : null,
            public: !publicKey ? 'PAYSTACK_PUBLIC_KEY' : null,
          },
        },
        { status: 503 }
      );
    }

    // Convert amount to kobo (Paystack uses smallest currency unit)
    const amountInKobo = parsedAmount * 100;

    // Initialize Paystack payment
    const paystackPayload = {
      amount: amountInKobo,
      email: email,
      reference: reference,
      metadata: {
        loan_application_id: reference,
        customer_name: fullName,
        phone_number: phoneNumber,
      },
    };

    console.log('[PAYSTACK] Calling Paystack API:');
    console.log('[PAYSTACK]   URL: https://api.paystack.co/transaction/initialize');
    console.log('[PAYSTACK]   Amount:', parsedAmount, 'KES (', amountInKobo, 'kobo)');
    console.log('[PAYSTACK]   Email:', email);
    console.log('[PAYSTACK]   Reference:', reference);
    console.log('[PAYSTACK]   Authorization Header Format: Bearer <secret_key>');
    console.log('[PAYSTACK]   Secret Key Length:', secretKey.length, 'characters');
    console.log('[PAYSTACK]   Secret Key Starts With:', secretKey.substring(0, 10) + '...');

    const headers = {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    };

    console.log('[PAYSTACK]   Headers being sent:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer [${secretKey.length} chars]`,
    });

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(paystackPayload),
    });

    const data = await response.json();

    console.log('[PAYSTACK] API Response Status:', response.status);
    console.log('[PAYSTACK] API Response Headers:', {
      contentType: response.headers.get('content-type'),
    });
    console.log('[PAYSTACK] API Response Body:', data);

    if (!response.ok) {
      console.error('[PAYSTACK] ✗ API Error:', {
        status: response.status,
        statusText: response.statusText,
        message: data.message,
        errors: data.errors,
      });
      
      return Response.json(
        {
          error: data.message || 'Failed to initialize payment',
          details: data,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const { authorization_url, access_code, reference: paystack_reference } = data.data;

    if (!authorization_url) {
      console.error('[PAYSTACK] No authorization URL in response');
      return Response.json(
        { error: 'No payment authorization URL received' },
        { status: 502 }
      );
    }

    console.log('[PAYSTACK] ✓ Payment initialization successful');
    console.log('[PAYSTACK]   Reference:', paystack_reference);
    console.log('[PAYSTACK]   Access Code:', access_code);
    console.log('[PAYSTACK] ============================================\n');

    return Response.json({
      success: true,
      authorization_url: authorization_url,
      access_code: access_code,
      reference: paystack_reference,
      amount: parsedAmount,
      currency: 'KES',
    });

  } catch (err) {
    console.error('[PAYSTACK] Unexpected error:', err);
    return Response.json(
      {
        error: 'Server error while initializing payment',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
