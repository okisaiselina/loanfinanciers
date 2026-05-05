// IntaSend Webhook Handler
// This endpoint receives payment notifications from IntaSend

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface IntaSendWebhookPayload {
  invoice_id: string;
  state: string;
  api_ref: string;
  value: number;
  currency: string;
  signature: string;
  created_at: string;
  updated_at: string;
}

export async function POST(request: Request) {
  try {
    const payload: IntaSendWebhookPayload = await request.json();

    console.log('[INTASEND WEBHOOK] Received payload:', payload);

    // Verify the webhook signature (optional but recommended for production)
    const secretKey = process.env.INTASEND_SECRET_KEY;
    if (!secretKey) {
      console.error('[INTASEND WEBHOOK] Missing INTASEND_SECRET_KEY');
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Extract the loan application ID from api_ref
    const loanApplicationId = payload.api_ref;

    if (!loanApplicationId) {
      console.error('[INTASEND WEBHOOK] No api_ref in payload');
      return Response.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Update the loan application based on payment state
    if (payload.state === 'COMPLETE') {
      // Payment successful - update loan application status
      const { error } = await supabase
        .from('loan_applications')
        .update({
          status: 'payment_confirmed',
          payment_reference: payload.invoice_id,
          payment_confirmed_at: new Date().toISOString(),
        })
        .eq('id', loanApplicationId);

      if (error) {
        console.error('[INTASEND WEBHOOK] Error updating loan application:', error);
        return Response.json({ error: 'Database error' }, { status: 500 });
      }

      console.log('[INTASEND WEBHOOK] Payment confirmed for application:', loanApplicationId);
    } else if (payload.state === 'FAILED') {
      // Payment failed - update loan application status
      const { error } = await supabase
        .from('loan_applications')
        .update({
          status: 'payment_failed',
        })
        .eq('id', loanApplicationId);

      if (error) {
        console.error('[INTASEND WEBHOOK] Error updating loan application:', error);
      }

      console.log('[INTASEND WEBHOOK] Payment failed for application:', loanApplicationId);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('[INTASEND WEBHOOK] Error processing webhook:', err);
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
