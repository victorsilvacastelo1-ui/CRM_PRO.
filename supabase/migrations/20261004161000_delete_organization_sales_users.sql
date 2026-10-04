-- Delete CRM users safely while preserving business records by reassigning
-- ownership to the administrator performing the deletion.
create or replace function public.delete_organization_sales_users(
  p_target_sales_ids bigint[],
  p_replacement_sales_id bigint,
  p_organization_id bigint
)
returns uuid[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_ids uuid[];
begin
  if coalesce(array_length(p_target_sales_ids, 1), 0) = 0 then
    return array[]::uuid[];
  end if;

  if p_replacement_sales_id = any(p_target_sales_ids) then
    raise exception 'The current user cannot delete their own account';
  end if;

  if not exists (
    select 1
    from public.sales
    where id = p_replacement_sales_id
      and organization_id = p_organization_id
      and administrator = true
  ) then
    raise exception 'Replacement administrator not found';
  end if;

  if exists (
    select 1
    from unnest(p_target_sales_ids) as target_id
    left join public.sales s
      on s.id = target_id
     and s.organization_id = p_organization_id
    where s.id is null
  ) then
    raise exception 'One or more users do not belong to this organization';
  end if;

  select coalesce(array_agg(user_id order by id), array[]::uuid[])
    into v_user_ids
  from public.sales
  where organization_id = p_organization_id
    and id = any(p_target_sales_ids);

  -- Preserve CRM data by transferring ownership to the administrator.
  update public.companies
     set sales_id = p_replacement_sales_id
   where organization_id = p_organization_id
     and sales_id = any(p_target_sales_ids);

  update public.contacts
     set sales_id = p_replacement_sales_id
   where organization_id = p_organization_id
     and sales_id = any(p_target_sales_ids);

  update public.contact_notes
     set sales_id = p_replacement_sales_id
   where organization_id = p_organization_id
     and sales_id = any(p_target_sales_ids);

  update public.deals
     set sales_id = p_replacement_sales_id
   where organization_id = p_organization_id
     and sales_id = any(p_target_sales_ids);

  update public.deal_notes
     set sales_id = p_replacement_sales_id
   where organization_id = p_organization_id
     and sales_id = any(p_target_sales_ids);

  update public.tasks
     set sales_id = p_replacement_sales_id
   where organization_id = p_organization_id
     and sales_id = any(p_target_sales_ids);

  delete from public.organization_members
   where organization_id = p_organization_id
     and user_id = any(v_user_ids);

  delete from public.sales
   where organization_id = p_organization_id
     and id = any(p_target_sales_ids);

  return v_user_ids;
end;
$$;

revoke all on function public.delete_organization_sales_users(bigint[], bigint, bigint)
  from public, anon, authenticated;
grant execute on function public.delete_organization_sales_users(bigint[], bigint, bigint)
  to service_role;
