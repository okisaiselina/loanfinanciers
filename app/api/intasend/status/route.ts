import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId, applicationId } = body;

    if (!invoiceId) {
      return Response.json(
        { error: "Missing invoice_id" },
        { status: 400 }
      );
    }

    const secretKey = process.env.INTASEND_SECRET_KEY;
    const publicKey = process.env.NEXT_PUBLIC_INTASEND_PUBLIC_KEY;

    if (!secretKey || !publicKey) {
      return Response.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Check payment status with IntaSend
    const response = await fetch("https://api.intasend.com/api/v1/payment/status/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secretKey}`,
        "X-IntaSend-Public-API-Key": publicKey,
      },
      body: JSON.stringify({
        invoice_id: invoiceId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[IntaSend] Status Check Error:", data);
      return Response.json(
        { error: data.message || "Failed to check payment status" },
        { status: response.status }
      );
    }

    const state = data.invoice?.state || data.state;

    // Update loan application if payment is complete
    if (state === "COMPLETE" && applicationId) {
      const supabase = await createClient();
      await supabase
        .from("loan_applications")
        .update({ 
          payment_status: "confirmed",
          status: "submitted"
        })
        .eq("id", applicationId);
    } else if ((state === "FAILED" || state === "CANCELED") && applicationId) {
      const supabase = await createClient();
      await supabase
        .from("loan_applications")
        .update({ 
          payment_status: "failed"
        })
        .eq("id", applicationId);
    }

    return Response.json({
      success: true,
      state: state,
      invoice: data.invoice,
    });

  } catch (error) {
    console.error("[IntaSend] Status Check Exception:", error);
    return Response.json(
      { error: "An error occurred while checking payment status" },
      { status: 500 }
    );
  }
}
