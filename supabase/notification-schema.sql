create table public.affarsleads_notification_outbox (
  request_id uuid primary key references public.affarsleads_enquiries(request_id) on delete cascade,
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  lease_id uuid,
  lease_until timestamptz,
  sent_at timestamptz,
  message_id text,
  last_error text
);
alter table public.affarsleads_notification_outbox enable row level security;
create policy deny_browser_access on public.affarsleads_notification_outbox
  for all to anon, authenticated using (false) with check (false);
revoke all on public.affarsleads_notification_outbox from public, anon, authenticated;
grant select,insert,update,delete on public.affarsleads_notification_outbox to service_role;
create index affarsleads_notification_pending on public.affarsleads_notification_outbox(next_attempt_at) where sent_at is null;

create function public.queue_affarsleads_notification() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  insert into public.affarsleads_notification_outbox(request_id) values(new.request_id) on conflict do nothing;
  return new;
end;
$$;
revoke all on function public.queue_affarsleads_notification() from public,anon,authenticated;
grant execute on function public.queue_affarsleads_notification() to service_role;
create trigger queue_affarsleads_notification after insert on public.affarsleads_enquiries
for each row execute function public.queue_affarsleads_notification();
insert into public.affarsleads_notification_outbox(request_id) select request_id from public.affarsleads_enquiries on conflict do nothing;

create function public.claim_affarsleads_notifications(batch_size integer default 1) returns jsonb
language sql security invoker set search_path='' as $$
with candidates as (
 select request_id from public.affarsleads_notification_outbox
 where sent_at is null and next_attempt_at<=now() and (lease_until is null or lease_until<now())
 order by next_attempt_at for update skip locked limit greatest(1,least(batch_size,10))
), claimed as (
 update public.affarsleads_notification_outbox o
 set lease_id=gen_random_uuid(),lease_until=now()+interval '5 minutes',attempts=attempts+1
 from candidates c where o.request_id=c.request_id returning o.request_id,o.lease_id
)
select coalesce(jsonb_agg(jsonb_build_object('requestId',e.request_id,'leaseId',c.lease_id,
 'name',e.name,'company',e.company,'email',e.email,'message',e.message,'package',e.package,'receivedAt',e.created_at)), '[]'::jsonb)
from claimed c join public.affarsleads_enquiries e on e.request_id=c.request_id;
$$;
revoke all on function public.claim_affarsleads_notifications(integer) from public,anon,authenticated;
grant execute on function public.claim_affarsleads_notifications(integer) to service_role;

create function public.complete_affarsleads_notification(request_uuid uuid, lease_uuid uuid, delivered boolean, result_code text default '') returns boolean
language plpgsql security invoker set search_path='' as $$
declare changed integer;
begin
 update public.affarsleads_notification_outbox set
 sent_at=case when delivered then now() else null end,
 message_id=case when delivered then left(result_code,254) else null end,
 last_error=case when delivered then null else left(result_code,40) end,
 lease_id=null,lease_until=null,
 next_attempt_at=now()+make_interval(mins=>least(60,power(2,least(attempts,6))::integer))
 where request_id=request_uuid and lease_id=lease_uuid and sent_at is null;
 get diagnostics changed=row_count;
 return changed=1;
end;
$$;
revoke all on function public.complete_affarsleads_notification(uuid,uuid,boolean,text) from public,anon,authenticated;
grant execute on function public.complete_affarsleads_notification(uuid,uuid,boolean,text) to service_role;
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
