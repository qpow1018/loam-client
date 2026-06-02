create index if not exists main_character_specs_user_id_idx
  on public.main_character_specs (user_id);

create policy "Service role can manage main character specs"
  on public.main_character_specs
  for all
  to service_role
  using (true)
  with check (true);
