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
    return Response.json(
      { message: 'Method not allowed.' },
      { status: 405, headers: corsHeaders },
    );
  }

  try {
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

    const data = await response.json();

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
