-- CRM Pro: harden SECURITY DEFINER exposure and add tenant FK indexes.

begin;

-- Users only need to see their own membership record. This removes the
-- recursive dependency that previously required current_organization_id()
-- to bypass RLS.
drop policy if exists organization_members_select on public.organization_members;
create policy organization_members_select
  on public.organization_members
  for select
  to authenticated
  using (user_id = auth.uid());

-- These helpers no longer need elevated privileges once membership RLS is
-- self-scoped. SECURITY INVOKER prevents privilege escalation while keeping
-- them usable by RLS policies and the frontend RPC.
create or replace function public.current_organization_id()
returns bigint
language sql
stable
security invoker
set search_path = ''
as $function$
  select om.organization_id
  from public.organization_members om
  where om.user_id = auth.uid()
  limit 1
$function$;

create or replace function public.is_org_member(target_organization_id bigint)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $function$
  select exists (
    select 1
    from public.organization_members om
    where om.user_id = auth.uid()
      and om.organization_id = target_organization_id
  )
$function$;

create or replace function public.is_org_admin(target_organization_id bigint)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $function$
  select exists (
    select 1
    from public.sales s
    where s.user_id = auth.uid()
      and s.organization_id = target_organization_id
      and s.administrator = true
      and s.disabled = false
  )
$function$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $function$
  select public.is_org_admin(public.current_organization_id())
$function$;

-- This trigger only updates a row that the caller is already allowed to
-- update, so elevated privileges are unnecessary.
create or replace function public.handle_contact_note_created_or_updated()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  update public.contacts
  set last_seen = new.date
  where id = new.contact_id
    and organization_id = new.organization_id
    and (last_seen is null or last_seen < new.date);

  return new;
end
$function$;

-- Auth/storage trigger helpers still require elevated privileges internally,
-- but must never be callable directly through the Data API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_update_user() from public, anon, authenticated;
revoke execute on function public.cleanup_note_attachments() from public, anon, authenticated;

-- Safe helper functions are only available to signed-in users.
revoke execute on function public.current_organization_id() from public, anon;
revoke execute on function public.is_org_member(bigint) from public, anon;
revoke execute on function public.is_org_admin(bigint) from public, anon;
revoke execute on function public.is_admin() from public, anon;

grant execute on function public.current_organization_id() to authenticated;
grant execute on function public.is_org_member(bigint) to authenticated;
grant execute on function public.is_org_admin(bigint) to authenticated;
grant execute on function public.is_admin() to authenticated;

-- Composite indexes cover both the legacy FK prefix and the tenant-safe
-- composite FKs.
create index if not exists companies_sales_tenant_idx
  on public.companies(sales_id, organization_id);

create index if not exists contacts_company_tenant_idx
  on public.contacts(company_id, organization_id);

create index if not exists contacts_sales_tenant_idx
  on public.contacts(sales_id, organization_id);

create index if not exists contact_notes_contact_tenant_idx
  on public.contact_notes(contact_id, organization_id);

create index if not exists contact_notes_sales_tenant_idx
  on public.contact_notes(sales_id, organization_id);

create index if not exists deals_company_tenant_idx
  on public.deals(company_id, organization_id);

create index if not exists deals_sales_tenant_idx
  on public.deals(sales_id, organization_id);

create index if not exists deal_notes_deal_tenant_idx
  on public.deal_notes(deal_id, organization_id);

create index if not exists deal_notes_sales_tenant_idx
  on public.deal_notes(sales_id, organization_id);

create index if not exists tasks_contact_tenant_idx
  on public.tasks(contact_id, organization_id);

create index if not exists tasks_sales_tenant_idx
  on public.tasks(sales_id, organization_id);

commit;
