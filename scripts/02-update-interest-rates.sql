-- Migration: Update loan types with accurate interest rate documentation
-- Date: 2026-04-17
-- Purpose: Ensure all loan types have properly documented fixed interest rates

-- Update loan types with accurate interest rates matching the hardcoded values
UPDATE loan_types 
SET interest_rate = 15 
WHERE name = 'Emergency Loan';

UPDATE loan_types 
SET interest_rate = 12 
WHERE name = 'Student Loan';

UPDATE loan_types 
SET interest_rate = 18 
WHERE name = 'Personal Loan';

UPDATE loan_types 
SET interest_rate = 20 
WHERE name = 'Business Loan';

UPDATE loan_types 
SET interest_rate = 22 
WHERE name = 'Logbook Loan';

-- Verify the updates
SELECT name, interest_rate, access_fee, min_amount, max_amount 
FROM loan_types 
ORDER BY interest_rate ASC;

-- Add comment to the table explaining the interest rates
COMMENT ON TABLE loan_types IS 'Loan types with fixed annual interest rates. These rates are:
- Emergency Loan: 15% per annum
- Student Loan: 12% per annum  
- Personal Loan: 18% per annum
- Business Loan: 20% per annum
- Logbook Loan: 22% per annum

Monthly rates are calculated as: annual_rate / 12
Compound interest formula: Total = Principal * (1 + monthly_rate)^months
Interest Amount = Total - Principal';
