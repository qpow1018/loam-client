import LoginClient from '@/app/login/LoginClient';
import { getSafeRedirectPath } from '@/lib/auth/redirect';

export default async function LoginPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const next = searchParams?.next;

  return <LoginClient next={getSafeRedirectPath(Array.isArray(next) ? next[0] : next)} />;
}
