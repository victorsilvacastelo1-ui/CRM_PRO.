begin;

create or replace function public.set_sales_id_default()
returns trigger
language plpgsql
set search_path = 'public'
as $function$
declare
  v_organization_id bigint;
  v_trusted_backend boolean;
begin
  v_organization_id := public.current_organization_id();
  v_trusted_backend := current_user in ('service_role', 'postgres', 'supabase_admin');

  if v_organization_id is null then
    if not v_trusted_backend or new.organization_id is null then
      raise exception 'Authenticated user is not associated with an organization';
    end if;
  else
    if new.organization_id is null then
      new.organization_id := v_organization_id;
    elsif new.organization_id <> v_organization_id then
      raise exception 'Cross-organization insert is not allowed';
    end if;
  end if;

  if new.sales_id is null and v_organization_id is not null then
    select id into new.sales_id
    from public.sales
    where user_id = auth.uid()
      and organization_id = v_organization_id;
  end if;

  return new;
end
$function$;

create or replace function public.set_organization_id_default()
returns trigger
language plpgsql
set search_path = 'public'
as $function$
declare
  v_organization_id bigint;
  v_trusted_backend boolean;
begin
  v_organization_id := public.current_organization_id();
  v_trusted_backend := current_user in ('service_role', 'postgres', 'supabase_admin');

  if v_organization_id is null then
    if not v_trusted_backend or new.organization_id is null then
      raise exception 'Authenticated user is not associated with an organization';
    end if;
  else
    if new.organization_id is null then
      new.organization_id := v_organization_id;
    elsif new.organization_id <> v_organization_id then
      raise exception 'Cross-organization insert is not allowed';
    end if;
  end if;

  return new;
end
$function$;

commit;
