import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('loan_types').select('*');

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data || []);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch loan types' },
      { status: 500 }
    );
  }
}
