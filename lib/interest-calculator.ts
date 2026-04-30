// Hardcoded loan type interest rates
// These rates are fixed per loan type and ensure proper interest calculation
// Annual rates are the primary rates; monthly rates are calculated from annual rates

export const LOAN_INTEREST_RATES = {
  'Emergency Loan': {
    annualRate: 15, // 15% per annum
    description: 'Fast emergency funding with standard rates',
  },
  'Student Loan': {
    annualRate: 12, // 12% per annum
    description: 'Educational loans with lower rates',
  },
  'Personal Loan': {
    annualRate: 18, // 18% per annum
    description: 'Personal use loans with competitive rates',
  },
  'Business Loan': {
    annualRate: 20, // 20% per annum
    description: 'Business expansion with higher rates',
  },
  'Logbook Loan': {
    annualRate: 22, // 22% per annum
    description: 'Vehicle-secured loans with premium rates',
  },
} as const;

/**
 * Get the annual interest rate for a loan type
 * @param loanTypeName - The name of the loan type
 * @returns Annual interest rate as a percentage (e.g., 15 for 15%)
 */
export function getAnnualInterestRate(loanTypeName: string): number {
  const rate = LOAN_INTEREST_RATES[loanTypeName as keyof typeof LOAN_INTEREST_RATES];
  if (!rate) {
    console.warn(`[v0] Unknown loan type: ${loanTypeName}, defaulting to 18%`);
    return 18;
  }
  return rate.annualRate;
}

/**
 * Calculate monthly interest rate from annual rate
 * @param annualRate - Annual interest rate as percentage
 * @returns Monthly interest rate as decimal (e.g., 0.0125 for 1.25%)
 */
export function getMonthlyRateDecimal(annualRate: number): number {
  return annualRate / 12 / 100;
}

/**
 * Calculate compound interest for a loan
 * @param principal - The eligible loan amount
 * @param annualRate - Annual interest rate as percentage
 * @param durationMonths - Loan duration in months
 * @returns Object with interestAmount and totalRepayable
 */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  durationMonths: number
): {
  interestAmount: number;
  totalRepayable: number;
  monthlyRate: number;
  compoundFactor: number;
} {
  // Validate inputs
  if (principal <= 0 || annualRate < 0 || durationMonths <= 0) {
    console.error('[v0] Invalid input for interest calculation', {
      principal,
      annualRate,
      durationMonths,
    });
    return {
      interestAmount: 0,
      totalRepayable: principal,
      monthlyRate: 0,
      compoundFactor: 1,
    };
  }

  // Calculate monthly rate as decimal (e.g., 0.0125 for 1.25%)
  const monthlyRate = getMonthlyRateDecimal(annualRate);

  // Compound interest formula: A = P(1 + r)^n
  // where P = principal, r = monthly rate (as decimal), n = number of months
  const compoundFactor = Math.pow(1 + monthlyRate, durationMonths);
  const totalAmount = principal * compoundFactor;
  const interestAmount = Math.round(totalAmount - principal);

  // Ensure minimum interest of 1 KES
  const finalInterestAmount = Math.max(interestAmount, 1);

  return {
    interestAmount: finalInterestAmount,
    totalRepayable: principal + finalInterestAmount,
    monthlyRate: monthlyRate * 100, // Convert to percentage for display
    compoundFactor,
  };
}

/**
 * Calculate complete loan repayment details
 * @param loanTypeName - Name of the loan type
 * @param principal - The eligible loan amount
 * @param durationMonths - Loan duration in months
 * @returns Complete calculation object
 */
export function calculateLoanRepayment(
  loanTypeName: string,
  principal: number,
  durationMonths: number
) {
  const annualRate = getAnnualInterestRate(loanTypeName);
  const interestCalc = calculateCompoundInterest(principal, annualRate, durationMonths);

  return {
    principal,
    annualRate,
    monthlyRate: interestCalc.monthlyRate,
    durationMonths,
    interestAmount: interestCalc.interestAmount,
    totalRepayable: interestCalc.totalRepayable,
    compoundFactor: interestCalc.compoundFactor,
  };
}
