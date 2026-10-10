begin;

create table public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  company_name text not null check (char_length(btrim(company_name)) between 1 and 160),
  website_url text check (char_length(website_url) <= 2048),
  message text check (char_length(message) <= 1000),
  status text not null default 'new' check (status in ('new','contacted','pilot','converted','closed')),
  source text not null default 'marketing_website' check (source = 'marketing_website'),
  fingerprint text not null check (fingerprint ~ '^[a-f0-9]{64}$'),
  email_hash text not null check (email_hash ~ '^[a-f0-9]{64}$'),
  notification_status text not null default 'pending' check (notification_status in ('pending','sent','failed','not_configured')),
  notification_attempted_at timestamptz
);
create index demo_created_idx on public.demo_requests (created_at desc);
create index demo_email_idx on public.demo_requests (email_hash, created_at desc);
create index demo_fingerprint_idx on public.demo_requests (fingerprint, created_at desc);
alter table public.demo_requests enable row level security;
revoke all on public.demo_requests from public, anon, authenticated, service_role;

-- Serializes acceptance across all instances. No browser role can call this function.
-- Low-volume demo intake only; limits count durable accepted leads, not HTTP traffic.
create function public.accept_demo_request(p_data jsonb, p_fingerprint text, p_email_hash text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare saved public.demo_requests%rowtype;
begin
  perform pg_catalog.pg_advisory_xact_lock(107440, 1);
  select * into saved from public.demo_requests
    where fingerprint = p_fingerprint and created_at > now() - interval '24 hours'
    order by created_at desc limit 1;
  if found then
    return jsonb_build_object('id', saved.id, 'created_at', saved.created_at, 'duplicate', true);
  end if;
  if (select count(*) from public.demo_requests where created_at > now() - interval '10 minutes') >= 60
    or (select count(*) from public.demo_requests where email_hash = p_email_hash and created_at > now() - interval '1 hour') >= 3 then
    return jsonb_build_object('limited', true);
  end if;
  insert into public.demo_requests (name,email,company_name,website_url,message,fingerprint,email_hash)
    values (p_data->>'name',p_data->>'email',p_data->>'company',nullif(p_data->>'website',''),nullif(p_data->>'message',''),p_fingerprint,p_email_hash)
    returning * into saved;
  return jsonb_build_object('id', saved.id, 'created_at', saved.created_at, 'duplicate', false);
end;
$$;

create function public.record_demo_notification(p_id uuid, p_state text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_state not in ('sent','failed','not_configured') then raise exception 'Invalid notification state'; end if;
  update public.demo_requests set notification_status = p_state, notification_attempted_at = now()
    where id = p_id and notification_status <> 'sent';
end;
$$;
revoke all on function public.accept_demo_request(jsonb,text,text) from public, anon, authenticated;
revoke all on function public.record_demo_notification(uuid,text) from public, anon, authenticated;
grant execute on function public.accept_demo_request(jsonb,text,text) to service_role;
grant execute on function public.record_demo_notification(uuid,text) to service_role;
commit;
