import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, phoneNumber, applicationId, fullName } = body;

    // Validate required fields
    if (!amount || !phoneNumber || !applicationId) {
      return Response.json(
        { error: "Missing required fields: amount, phoneNumber, applicationId" },
        { status: 400 }
      );
    }

    // Format phone number to ensure it starts with 254
    let formattedPhone = phoneNumber.replace(/\s+/g, "").replace(/^0/, "254");
    if (!formattedPhone.startsWith("254")) {
      formattedPhone = `254${formattedPhone}`;
    }

    const secretKey = process.env.INTASEND_SECRET_KEY;
    const publicKey = process.env.NEXT_PUBLIC_INTASEND_PUBLIC_KEY;

    if (!secretKey || !publicKey) {
      console.error("[IntaSend] Missing API keys");
      return Response.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Call IntaSend M-Pesa STK Push API directly
    const response = await fetch("https://api.intasend.com/api/v1/payment/mpesa-stk-push/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secretKey}`,
        "X-IntaSend-Public-API-Key": publicKey,
      },
      body: JSON.stringify({
        amount: amount.toString(),
        phone_number: formattedPhone,
        api_ref: applicationId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[IntaSend] STK Push Error:", data);
      return Response.json(
        { error: data.message || data.error || "Failed to initiate M-Pesa payment" },
        { status: response.status }
      );
    }

    // Update loan application with invoice_id for tracking
    if (data.invoice?.invoice_id) {
      const supabase = await createClient();
      await supabase
        .from("loan_applications")
        .update({ 
          payment_invoice_id: data.invoice.invoice_id,
          payment_status: "pending"
        })
        .eq("id", applicationId);
    }

    return Response.json({
      success: true,
      invoice_id: data.invoice?.invoice_id,
      state: data.invoice?.state,
      message: "M-Pesa STK push sent to your phone. Please enter your PIN to complete payment.",
    });

  } catch (error) {
    console.error("[IntaSend] STK Push Exception:", error);
    return Response.json(
      { error: "An error occurred while processing your payment" },
      { status: 500 }
    );
  }
}
