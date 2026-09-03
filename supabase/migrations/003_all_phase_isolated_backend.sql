create extension if not exists pgcrypto;

create or replace function public.all_phase_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create table if not exists public.all_phase_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.all_phase_admin_users enable row level security;

create or replace function public.all_phase_is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.all_phase_admin_users where user_id = auth.uid());
$$;
revoke all on function public.all_phase_is_admin() from public;
grant execute on function public.all_phase_is_admin() to authenticated;

drop policy if exists "all phase admins can view membership" on public.all_phase_admin_users;
create policy "all phase admins can view membership" on public.all_phase_admin_users
for select to authenticated using (public.all_phase_is_admin());

create table if not exists public.all_phase_leads (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  idempotency_key text unique,
  job_type text not null check (job_type in ('residential','commercial','industrial')),
  service_type text not null,
  description text not null,
  urgency text not null check (urgency in ('normal','soon','urgent')),
  street text not null, city text not null, state text not null, zip text not null,
  customer_name text not null, customer_email text not null, customer_phone text not null,
  preferred_contact text not null check (preferred_contact in ('email','phone','text')),
  preferred_windows jsonb not null default '[]'::jsonb,
  status text not null default 'new' check (status in ('new','contacted','scheduled','estimate_sent','won','lost','archived')),
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists all_phase_leads_status_created_at_idx on public.all_phase_leads(status, created_at desc);
create index if not exists all_phase_leads_job_type_idx on public.all_phase_leads(job_type);
create index if not exists all_phase_leads_customer_email_idx on public.all_phase_leads(lower(customer_email));
drop trigger if exists all_phase_leads_set_updated_at on public.all_phase_leads;
create trigger all_phase_leads_set_updated_at before update on public.all_phase_leads
for each row execute function public.all_phase_set_updated_at();
alter table public.all_phase_leads enable row level security;
drop policy if exists "all phase admins can view leads" on public.all_phase_leads;
create policy "all phase admins can view leads" on public.all_phase_leads for select to authenticated using (public.all_phase_is_admin());
drop policy if exists "all phase admins can update leads" on public.all_phase_leads;
create policy "all phase admins can update leads" on public.all_phase_leads for update to authenticated using (public.all_phase_is_admin()) with check (public.all_phase_is_admin());

create table if not exists public.all_phase_lead_attachments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.all_phase_leads(id) on delete cascade,
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null,
  byte_size bigint not null check (byte_size >= 0),
  created_at timestamptz not null default now()
);
create index if not exists all_phase_lead_attachments_lead_id_idx on public.all_phase_lead_attachments(lead_id);
alter table public.all_phase_lead_attachments enable row level security;
drop policy if exists "all phase admins can view attachments" on public.all_phase_lead_attachments;
create policy "all phase admins can view attachments" on public.all_phase_lead_attachments for select to authenticated using (public.all_phase_is_admin());

create table if not exists public.all_phase_lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.all_phase_leads(id) on delete cascade,
  author_user_id uuid references auth.users(id) on delete set null,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists all_phase_lead_notes_lead_id_created_at_idx on public.all_phase_lead_notes(lead_id, created_at desc);
alter table public.all_phase_lead_notes enable row level security;
drop policy if exists "all phase admins can view notes" on public.all_phase_lead_notes;
create policy "all phase admins can view notes" on public.all_phase_lead_notes for select to authenticated using (public.all_phase_is_admin());
drop policy if exists "all phase admins can create notes" on public.all_phase_lead_notes;
create policy "all phase admins can create notes" on public.all_phase_lead_notes for insert to authenticated with check (public.all_phase_is_admin() and author_user_id = auth.uid());

create table if not exists public.all_phase_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  email_enabled boolean not null default true,
  sms_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
alter table public.all_phase_notification_preferences enable row level security;
drop policy if exists "all phase admins can view notification preferences" on public.all_phase_notification_preferences;
create policy "all phase admins can view notification preferences" on public.all_phase_notification_preferences for select to authenticated using (public.all_phase_is_admin());
drop policy if exists "all phase admins can update notification preferences" on public.all_phase_notification_preferences;
create policy "all phase admins can update notification preferences" on public.all_phase_notification_preferences for update to authenticated using (public.all_phase_is_admin()) with check (public.all_phase_is_admin());
drop trigger if exists all_phase_notification_preferences_set_updated_at on public.all_phase_notification_preferences;
create trigger all_phase_notification_preferences_set_updated_at before update on public.all_phase_notification_preferences
for each row execute function public.all_phase_set_updated_at();

create table if not exists public.all_phase_notification_attempts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.all_phase_leads(id) on delete cascade,
  channel text not null check (channel in ('email','sms')),
  status text not null check (status in ('sent','failed')),
  provider text,
  error_message text,
  created_at timestamptz not null default now()
);
create index if not exists all_phase_notification_attempts_lead_id_created_at_idx on public.all_phase_notification_attempts(lead_id, created_at desc);
alter table public.all_phase_notification_attempts enable row level security;
drop policy if exists "all phase admins can view notification attempts" on public.all_phase_notification_attempts;
create policy "all phase admins can view notification attempts" on public.all_phase_notification_attempts for select to authenticated using (public.all_phase_is_admin());

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('all-phase-lead-attachments','all-phase-lead-attachments',false,10485760,
array['image/jpeg','image/png','image/webp','image/heic','application/pdf'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "all phase admins can read attachment objects" on storage.objects;
create policy "all phase admins can read attachment objects" on storage.objects
for select to authenticated
using (bucket_id='all-phase-lead-attachments' and public.all_phase_is_admin());

comment on table public.all_phase_leads is 'All Phase Electric estimate requests isolated by prefixed database objects.';
