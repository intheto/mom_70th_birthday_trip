import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export function database() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('Supabase 서버 연결 설정이 필요합니다.');
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
