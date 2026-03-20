-- Table des professionnels
create table pros (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text unique not null,
  business_type text,
  address text,
  created_at timestamp default now(),
  trial_ends_at timestamp default (now() + interval '30 days'),
  is_subscribed boolean default false
);

-- Table des services
create table services (
  id uuid default gen_random_uuid() primary key,
  pro_id uuid references pros(id) on delete cascade,
  name text not null,
  price numeric not null,
  duration_minutes int not null,
  icon text default '✂️',
  created_at timestamp default now()
);

-- Table des horaires
create table schedules (
  id uuid default gen_random_uuid() primary key,
  pro_id uuid references pros(id) on delete cascade,
  day_of_week int not null, -- 0=dim, 1=lun ... 6=sam
  is_open boolean default true,
  start_time text default '09:00',
  end_time text default '18:00',
  break_start text,
  break_end text
);

-- Table des clients
create table clients (
  id uuid default gen_random_uuid() primary key,
  pro_id uuid references pros(id) on delete cascade,
  name text not null,
  phone text not null,
  notes text,
  visit_count int default 0,
  created_at timestamp default now()
);

-- Table des rendez-vous
create table appointments (
  id uuid default gen_random_uuid() primary key,
  pro_id uuid references pros(id) on delete cascade,
  client_id uuid references clients(id),
  service_id uuid references services(id),
  client_name text,
  client_phone text,
  appointment_date date not null,
  appointment_time text not null,
  status text default 'pending', -- pending, confirmed, absent, cancelled
  source text default 'manual', -- manual, qr
  created_at timestamp default now()
);
