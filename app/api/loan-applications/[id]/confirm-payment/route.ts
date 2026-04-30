import { supabase } from '@/lib/supabase';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Update the loan application status to completed
    const { data, error } = await supabase
      .from('loan_applications')
      .update({
        status: 'completed',
        payment_status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) {
      return Response.json(
        {
          error: error.message || 'Failed to confirm payment',
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return Response.json(
        { error: 'Loan application not found' },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Payment confirmed and application marked as completed',
        data: data[0],
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to confirm payment',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
