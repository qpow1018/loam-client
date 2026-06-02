import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Action = 'list' | 'save';

type RequestBody = {
  action?: Action;
  anonymousClientId?: string;
  characterNames?: string[];
  spec?: {
    characterName?: string;
    serverName?: string | null;
    characterClass?: string | null;
    itemLevel?: string | null;
    summary?: unknown;
    rawPayload?: unknown;
    sectionStatus?: unknown;
  };
};

function createSupabaseAdmin() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function mapRow(row: Record<string, unknown>) {
  return {
    characterName: row.character_name,
    serverName: row.server_name,
    characterClass: row.character_class,
    itemLevel: row.item_level,
    summary: row.summary,
    rawPayload: row.raw_payload,
    sectionStatus: row.section_status,
    savedAt: row.saved_at,
    updatedAt: row.updated_at,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return Response.json({ message: 'Method not allowed.' }, { status: 405, headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as RequestBody;
    const anonymousClientId = body.anonymousClientId?.trim();

    if (!anonymousClientId) {
      return Response.json(
        { message: 'anonymousClientId is required.' },
        { status: 400, headers: corsHeaders },
      );
    }

    const supabase = createSupabaseAdmin();

    if (body.action === 'list') {
      const characterNames = body.characterNames ?? [];

      if (characterNames.length === 0) {
        return Response.json({ ok: true, data: [] }, { status: 200, headers: corsHeaders });
      }

      const { data, error } = await supabase
        .from('main_character_specs')
        .select('*')
        .eq('anonymous_client_id', anonymousClientId)
        .in('character_name', characterNames);

      if (error) throw error;

      return Response.json(
        { ok: true, data: (data ?? []).map((row) => mapRow(row)) },
        { status: 200, headers: corsHeaders },
      );
    }

    if (body.action === 'save') {
      const spec = body.spec;
      const characterName = spec?.characterName?.trim();

      if (!spec || !characterName) {
        return Response.json(
          { message: 'spec.characterName is required.' },
          { status: 400, headers: corsHeaders },
        );
      }

      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('main_character_specs')
        .upsert(
          {
            anonymous_client_id: anonymousClientId,
            character_name: characterName,
            server_name: spec.serverName ?? null,
            character_class: spec.characterClass ?? null,
            item_level: spec.itemLevel ?? null,
            summary: spec.summary ?? {},
            raw_payload: spec.rawPayload ?? {},
            section_status: spec.sectionStatus ?? {},
            saved_at: now,
            updated_at: now,
          },
          { onConflict: 'anonymous_client_id,character_name' },
        )
        .select('*')
        .single();

      if (error) throw error;

      return Response.json({ ok: true, data: mapRow(data) }, { status: 200, headers: corsHeaders });
    }

    return Response.json({ message: 'Unsupported action.' }, { status: 400, headers: corsHeaders });
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
