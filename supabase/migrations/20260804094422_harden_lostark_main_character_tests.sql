revoke all privileges
  on public.lostark_main_characters_test
  from anon, authenticated;

grant select, insert, update, delete
  on public.lostark_main_characters_test
  to authenticated;
