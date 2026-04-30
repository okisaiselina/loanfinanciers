-- Create loan types table
CREATE TABLE IF NOT EXISTS loan_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  min_amount INTEGER NOT NULL,
  max_amount INTEGER NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  access_fee INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employment types table
CREATE TABLE IF NOT EXISTS employment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loan applications table
CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_type_id UUID NOT NULL REFERENCES loan_types(id) ON DELETE CASCADE,
  requested_amount INTEGER NOT NULL,
  eligible_amount INTEGER NOT NULL,
  interest_amount INTEGER NOT NULL,
  access_fee INTEGER NOT NULL,
  total_repayable INTEGER NOT NULL,
  national_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  employment_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending_payment',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default loan types
INSERT INTO loan_types (name, min_amount, max_amount, interest_rate, access_fee)
VALUES 
  ('Emergency Loan', 1000, 3000, 15, 300),
  ('Student Loan', 500, 2500, 12, 200),
  ('Personal Loan', 1000, 10000, 18, 500),
  ('Business Loan', 2000, 50000, 20, 1000),
  ('Logbook Loan', 3000, 100000, 22, 1500)
ON CONFLICT (name) DO NOTHING;

-- Insert default employment types
INSERT INTO employment_types (name)
VALUES 
  ('Salaried Employee'),
  ('Self-Employed'),
  ('Business Owner'),
  ('Gig Worker'),
  ('Student'),
  ('Unemployed'),
  ('Retired')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON loan_applications(status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_created_at ON loan_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_loan_applications_phone ON loan_applications(phone_number);
