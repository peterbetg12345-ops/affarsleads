-- Apply to the selected project with Supabase apply_migration.
-- Only the Edge Function's service role can read or write enquiries.
create table public.affarsleads_enquiries (
  request_id uuid primary key,
  name text not null check (char_length(name) between 1 and 120),
  company text not null check (char_length(company) between 1 and 160),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  message text not null check (char_length(message) between 10 and 3000),
  package text not null default '' check (package in ('', 'Bas', 'Tillväxt', 'Premium')),
  client_hash text not null check (client_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  status text not null default 'Ny' check (status in ('Ny', 'Kontaktad', 'Avslutad'))
);
alter table public.affarsleads_enquiries enable row level security;
create policy deny_browser_access on public.affarsleads_enquiries
  for all to anon, authenticated using (false) with check (false);
revoke all on table public.affarsleads_enquiries from public, anon, authenticated;
grant select, insert, update, delete on table public.affarsleads_enquiries to service_role;
create index affarsleads_enquiries_client_created on public.affarsleads_enquiries (client_hash, created_at);

-- Service-role-only transaction: receipt after storage, safe retries, shared rate limit.
create function public.submit_affarsleads_enquiry(payload jsonb, client_hash text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  request_uuid uuid := (payload->>'requestId')::uuid;
  existing public.affarsleads_enquiries%rowtype;
begin
  if client_hash is null or client_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid client hash' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(request_uuid::text, 0));
  select * into existing from public.affarsleads_enquiries where request_id = request_uuid;
  if found then
    if existing.name = payload->>'name' and existing.company = payload->>'company'
      and existing.email = payload->>'email' and existing.message = payload->>'message'
      and existing.package = coalesce(payload->>'package', '') then
      return pg_catalog.jsonb_build_object('ok', true, 'requestId', request_uuid);
    end if;
    raise exception 'Request ID already used' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(client_hash, 1));
  if (select count(*) from public.affarsleads_enquiries e
      where e.client_hash = submit_affarsleads_enquiry.client_hash
      and e.created_at > now() - interval '10 minutes') >= 5 then
    return pg_catalog.jsonb_build_object('ok', false, 'rateLimited', true);
  end if;
  insert into public.affarsleads_enquiries (request_id, name, company, email, message, package, client_hash)
  values (request_uuid, payload->>'name', payload->>'company', payload->>'email', payload->>'message',
          coalesce(payload->>'package', ''), client_hash);
  return pg_catalog.jsonb_build_object('ok', true, 'requestId', request_uuid);
end;
$$;
revoke all on function public.submit_affarsleads_enquiry(jsonb, text) from public, anon, authenticated;
grant execute on function public.submit_affarsleads_enquiry(jsonb, text) to service_role;
