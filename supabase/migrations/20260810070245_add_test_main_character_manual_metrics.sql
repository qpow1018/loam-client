alter table public.lostark_main_characters_test
  add column if not exists manual_metrics jsonb not null default
    '{"lopecScore": null, "braceletScore": null, "gemConversionLevel": null}'::jsonb;
