'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { isAllowedAuthEmail } from '@/lib/auth/allowlist';
import { getSafeRedirectPath } from '@/lib/auth/redirect';
import { createClient } from '@/lib/supabase/server';

export type TLoginState = {
  message?: string;
};

export async function login(_prevState: TLoginState, formData: FormData): Promise<TLoginState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');
  const next = getSafeRedirectPath(formData.get('next'));

  if (!email || !password) {
    return { message: '이메일과 비밀번호를 입력해주세요.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: '이메일 또는 비밀번호를 확인해주세요.' };
  }

  if (!isAllowedAuthEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { message: '이 계정은 LoaM에 접근할 수 없습니다.' };
  }

  revalidatePath('/', 'layout');
  redirect(next);
}
