import { redirect } from 'next/navigation';

import { isAllowedAuthEmail } from '@/lib/auth/allowlist';
import { LOGIN_PATH } from '@/lib/auth/redirect';
import { createClient } from '@/lib/supabase/server';

export async function requireAuth(nextPath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user !== null && isAllowedAuthEmail(user.email)) {
    return user;
  }

  redirect(`${LOGIN_PATH}?next=${encodeURIComponent(nextPath)}`);
}
