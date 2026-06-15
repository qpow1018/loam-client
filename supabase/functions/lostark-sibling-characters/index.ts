import { createClient } from 'npm:@supabase/supabase-js@2';

const LOSTARK_API_BASE_URL = 'https://developer-lostark.game.onstove.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type RequestBody = {
  characterName?: string;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return Response.json({ message: 'Method not allowed.' }, { status: 405, headers: corsHeaders });
  }

  try {
    const authErrorResponse = await validateAuthorization(req);
    if (authErrorResponse !== null) {
      return authErrorResponse;
    }

    const body = (await req.json()) as RequestBody;
    const characterName = body.characterName?.trim();

    if (!characterName) {
      return Response.json(
        { message: 'characterName is required.' },
        { status: 400, headers: corsHeaders },
      );
    }

    const apiKey = Deno.env.get('LOSTARK_API_KEY');

    if (!apiKey) {
      return Response.json(
        { message: 'LOSTARK_API_KEY is required.' },
        { status: 500, headers: corsHeaders },
      );
    }

    const response = await fetch(
      `${LOSTARK_API_BASE_URL}/characters/${encodeURIComponent(characterName)}/siblings`,
      {
        headers: {
          accept: 'application/json',
          authorization: `bearer ${apiKey}`,
        },
      },
    );

    const data = parseResponseBody(await response.text());

    return Response.json(
      {
        ok: response.ok,
        status: response.status,
        data,
      },
      { status: response.status, headers: corsHeaders },
    );
  } catch (error) {
    return Response.json(
      {
        message: 'Unexpected function error.',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: corsHeaders },
    );
  }
});

function parseResponseBody(value: string): unknown {
  if (value.trim().length === 0) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

async function validateAuthorization(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (token === undefined) {
    return Response.json(
      { message: 'Authentication is required.' },
      { status: 401, headers: corsHeaders },
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SB_PUBLISHABLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseKey) {
    return Response.json(
      { message: 'Supabase Auth environment variables are required.' },
      { status: 500, headers: corsHeaders },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || user === null) {
    return Response.json(
      { message: 'Authentication is required.' },
      { status: 401, headers: corsHeaders },
    );
  }

  if (!isAllowedAuthEmail(user.email)) {
    return Response.json(
      { message: 'This account cannot access LoaM.' },
      { status: 403, headers: corsHeaders },
    );
  }

  return null;
}

function isAllowedAuthEmail(email: string | undefined) {
  const allowedEmails = Deno.env
    .get('AUTH_ALLOWED_EMAILS')
    ?.split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails === undefined || allowedEmails.length === 0) {
    return false;
  }

  return email !== undefined && allowedEmails.includes(email.toLowerCase());
}
