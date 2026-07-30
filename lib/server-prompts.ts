import { createClient } from '@supabase/supabase-js';
import { MOCK_PROMPTS } from '@/lib/mockData';

export async function getServerPrompts() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    return MOCK_PROMPTS;
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('prompts').select('*').order('created_at', { ascending: false });
  
  if (error || !data) {
    return MOCK_PROMPTS;
  }

  return [...data, ...MOCK_PROMPTS];
}