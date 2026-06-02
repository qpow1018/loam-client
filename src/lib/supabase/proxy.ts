import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { isAllowedAuthEmail } from '@/lib/auth/allowlist';
import { DEFAULT_AUTHENTICATED_PATH, getSafeRedirectPath, LOGIN_PATH } from '@/lib/auth/redirect';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPath = request.nextUrl.pathname === LOGIN_PATH;
  const isAllowedUser = user !== null && isAllowedAuthEmail(user.email);

  if (user !== null && !isAllowedUser) {
    await supabase.auth.signOut();
  }

  if (!isAllowedUser && !isLoginPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = LOGIN_PATH;
    redirectUrl.search = '';
    redirectUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);

    const redirectResponse = NextResponse.redirect(redirectUrl);
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  if (isAllowedUser && isLoginPath) {
    const redirectUrl = new URL(
      getSafeRedirectPath(request.nextUrl.searchParams.get('next') ?? DEFAULT_AUTHENTICATED_PATH),
      request.url,
    );

    const redirectResponse = NextResponse.redirect(redirectUrl);
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  return supabaseResponse;
}

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    const { name, value, ...options } = cookie;
    target.cookies.set(name, value, options);
  });
}
