-- Make the already-deployed Users list deletion work safely.
-- The existing frontend deletes rows from public.sales directly. RLS previously
-- allowed SELECT only, so PostgREST returned 200 while deleting zero rows.

create or replace function public.prepare_sales_user_delete()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_replacement_sales_id bigint;
begin
  select s.id
    into v_replacement_sales_id
  from public.sales s
  where s.organization_id = old.organization_id
    and s.user_id = auth.uid()
    and s.administrator = true
    and s.id <> old.id
  limit 1;

  if v_replacement_sales_id is null then
    raise exception 'An administrator cannot delete their own active account';
  end if;

  -- Preserve business data by transferring ownership to the administrator
  -- who is performing the deletion.
  update public.companies
     set sales_id = v_replacement_sales_id
   where organization_id = old.organization_id
     and sales_id = old.id;

  update public.contacts
     set sales_id = v_replacement_sales_id
   where organization_id = old.organization_id
     and sales_id = old.id;

  update public.contact_notes
     set sales_id = v_replacement_sales_id
   where organization_id = old.organization_id
     and sales_id = old.id;

  update public.deals
     set sales_id = v_replacement_sales_id
   where organization_id = old.organization_id
     and sales_id = old.id;

  update public.deal_notes
     set sales_id = v_replacement_sales_id
   where organization_id = old.organization_id
     and sales_id = old.id;

  update public.tasks
     set sales_id = v_replacement_sales_id
   where organization_id = old.organization_id
     and sales_id = old.id;

  delete from public.organization_members
   where organization_id = old.organization_id
     and user_id = old.user_id;

  return old;
end;
$$;

create or replace function public.finish_sales_user_delete()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  -- Remove the Supabase Auth account only after the sales row no longer
  -- references auth.users.
  delete from auth.users where id = old.user_id;
  return old;
end;
$$;

drop trigger if exists trg_prepare_sales_user_delete on public.sales;
create trigger trg_prepare_sales_user_delete
before delete on public.sales
for each row execute function public.prepare_sales_user_delete();

drop trigger if exists trg_finish_sales_user_delete on public.sales;
create trigger trg_finish_sales_user_delete
after delete on public.sales
for each row execute function public.finish_sales_user_delete();

drop policy if exists sales_delete_admin on public.sales;
create policy sales_delete_admin
  on public.sales
  for delete
  to authenticated
  using (
    organization_id = public.current_organization_id()
    and public.is_org_admin(organization_id)
    and user_id <> auth.uid()
  );

revoke all on function public.prepare_sales_user_delete() from public, anon, authenticated;
revoke all on function public.finish_sales_user_delete() from public, anon, authenticated;
