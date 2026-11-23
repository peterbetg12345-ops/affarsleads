-- Token is provisioned separately into Vault, never checked into this file.
select cron.schedule('affarsleads-notification-retry','*/5 * * * *', $job$
 select net.http_post(
  url:='https://affarsleads.se/api/notifications',
  headers:=jsonb_build_object('Content-Type','application/json','Authorization',
   'Bearer '||(select decrypted_secret from vault.decrypted_secrets where name='affarsleads_notification_token')),
  body:='{}'::jsonb,
  timeout_milliseconds:=55000
 ) where exists (
  select 1 from public.affarsleads_notification_outbox
  where sent_at is null and next_attempt_at<=now() and (lease_until is null or lease_until<now())
 );
$job$);
