import { supabase } from '@/lib/supabase';

// Calculate eligibility score based on eligibility percentage
function calculateEligibilityScore(eligibleAmount: number, requestedAmount: number): string {
  const percentage = (eligibleAmount / requestedAmount) * 100;
  if (percentage >= 80) return 'excellent';
  if (percentage >= 70) return 'good';
  if (percentage >= 60) return 'fair';
  return 'acceptable';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      loanTypeId,
      requestedAmount,
      eligibleAmount,
      nationalId,
      fullName,
      phoneNumber,
      employmentType,
      interestAmount,
      accessFee,
    } = body;

    // Validate required fields
    if (!loanTypeId || requestedAmount === undefined || eligibleAmount === undefined || !nationalId || !fullName || !phoneNumber || !employmentType) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate numeric values
    const parsedRequestedAmount = Number(requestedAmount);
    const parsedEligibleAmount = Number(eligibleAmount);
    const parsedInterestAmount = Number(interestAmount || 0);
    const parsedAccessFee = Number(accessFee || 0);

    if (isNaN(parsedRequestedAmount) || isNaN(parsedEligibleAmount) || parsedEligibleAmount <= 0) {
      return Response.json(
        { error: 'Invalid amount values' },
        { status: 400 }
      );
    }

    // Calculate eligibility score
    const eligibilityScore = calculateEligibilityScore(parsedEligibleAmount, parsedRequestedAmount);

    // Create loan application
    const { data, error } = await supabase
      .from('loan_applications')
      .insert([
        {
          loan_type_id: loanTypeId,
          requested_amount: parsedRequestedAmount,
          eligible_amount: parsedEligibleAmount,
          id_number: nationalId,
          full_name: fullName,
          phone_number: phoneNumber,
          employment_type_id: employmentType,
          interest_amount: parsedInterestAmount,
          access_fee: parsedAccessFee,
          total_repayable: parsedEligibleAmount + parsedInterestAmount,
          status: 'pending',
          payment_status: 'pending',
          eligibility_score: eligibilityScore,
        },
      ])
      .select();

    if (error) {
      return Response.json(
        { 
          error: error.message || 'Failed to create loan application',
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return Response.json(
        { error: 'Failed to create loan application' },
        { status: 500 }
      );
    }

    return Response.json(data[0], { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to create loan application',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
