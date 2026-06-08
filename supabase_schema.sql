-- ============================================================
-- CLEANO DETERGENTS — SUPABASE DATABASE SCHEMA
-- Run this entire file in the Supabase SQL Editor
-- Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

-- 1. ADMIN USERS
create table if not exists admin_users (
  id          text primary key default gen_random_uuid()::text,
  email       text unique not null,
  name        text not null,
  role        text not null default 'manager'
                check (role in ('super_admin','manager','translator','inventory_manager','content_editor')),
  password_hash text not null,
  created_at  timestamptz default now(),
  last_login  timestamptz
);

-- 2. PRODUCTS
create table if not exists products (
  id          text primary key,
  name_en     text not null,
  name_am     text not null default '',
  description_en text not null default '',
  description_am text not null default '',
  image       text not null default '',
  category    text not null default 'laundry',
  prices      jsonb not null default '{}',
  badge       text,
  rating      numeric(3,1) default 4.5,
  reviews     int default 0,
  tiktok_videos jsonb default '[]',
  featured    boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 3. BRANCHES / STORES
create table if not exists branches (
  id          text primary key,
  name_en     text not null,
  name_am     text not null default '',
  address_en  text not null default '',
  address_am  text not null default '',
  phone       text not null default '',
  hours       text not null default '',
  lat         numeric(10,6) not null default 9.0054,
  lng         numeric(10,6) not null default 38.7636,
  tiktok_videos jsonb default '[]',
  is_main     boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 4. CATEGORIES
create table if not exists categories (
  id          text primary key,
  label_en    text not null,
  label_am    text not null default '',
  sort_order  int not null default 99,
  icon        text default '🧴',
  color       text default '#3B82F6',
  created_at  timestamptz default now()
);

-- 5. INVENTORY
create table if not exists inventory (
  id          text primary key default gen_random_uuid()::text,
  product_id  text not null references products(id) on delete cascade,
  size        text not null default '3L',
  store_id    text not null default 'all',
  quantity    int not null default 0,
  status      text not null default 'in_stock'
                check (status in ('in_stock','low_stock','out_of_stock')),
  updated_by  text not null default 'admin',
  updated_at  timestamptz default now()
);

-- 6. SITE SETTINGS (single row)
create table if not exists site_settings (
  id              int primary key default 1,
  company_name    text default 'CLEANO Detergents',
  tagline         text default 'Ethiopia''s Most Trusted Cleaning Brand',
  whatsapp_number text default '+251911234567',
  telegram_username text default '@cleano_official',
  email           text default 'info@cleano.et',
  phone           text default '+251 91 123 4567',
  address         text default 'Bole Road, Addis Ababa, Ethiopia',
  facebook_url    text default '',
  instagram_url   text default '',
  tiktok_url      text default 'https://www.tiktok.com/@cleano_official',
  seo_title       text default 'CLEANO Detergents – Ethiopia''s Premium Cleaning Brand',
  seo_description text default 'Premium detergents crafted for Ethiopian homes.',
  primary_color   text default '#1B4FD8',
  accent_color    text default '#F59E0B',
  logo_url        text default '',
  banner_enabled  boolean default false,
  banner_text     text default 'Free delivery on orders over 500 Birr!',
  banner_color    text default '#1B4FD8',
  updated_at      timestamptz default now()
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- 7. CONTENT SECTIONS
create table if not exists content_sections (
  id          text primary key,
  page        text not null,
  section     text not null,
  title_en    text not null default '',
  title_am    text not null default '',
  body_en     text not null default '',
  body_am     text not null default '',
  updated_at  timestamptz default now()
);

-- 8. TRANSLATIONS
create table if not exists translations (
  id        serial primary key,
  lang      text not null check (lang in ('en','am')),
  key       text not null,
  value     text not null default '',
  updated_at timestamptz default now(),
  unique (lang, key)
);

-- 9. MEDIA
create table if not exists media_files (
  id          text primary key default gen_random_uuid()::text,
  filename    text not null,
  url         text not null,
  folder      text not null default 'general',
  size        bigint default 0,
  mime_type   text default '',
  uploaded_by text default 'admin',
  uploaded_at timestamptz default now()
);

-- 10. AUDIT LOG
create table if not exists audit_log (
  id          text primary key default gen_random_uuid()::text,
  user_id     text not null,
  user_name   text not null,
  action      text not null,
  resource    text not null,
  details     text,
  ip          text,
  created_at  timestamptz default now()
);

-- 11. ANALYTICS EVENTS
create table if not exists analytics_events (
  id          text primary key default gen_random_uuid()::text,
  type        text not null,
  data        jsonb default '{}',
  created_at  timestamptz default now()
);

-- ============================================================
-- SEED DATA — Default Super Admin
-- Email: admin@cleano.et  |  Password: cleano@admin2024
-- ============================================================
insert into admin_users (id, email, name, role, password_hash)
values (
  'admin-1',
  'admin@cleano.et',
  'Super Admin',
  'super_admin',
  'Y2xlYW5vQGFkbWluMjAyNA=='  -- base64 of: cleano@admin2024
)
on conflict (email) do nothing;

-- ============================================================
-- SEED DATA — Default Categories
-- ============================================================
insert into categories (id, label_en, label_am, sort_order, icon, color) values
  ('laundry',      'Laundry',      'ልብስ ማጠቢያ',   1, '🧺', '#3B82F6'),
  ('multipurpose', 'Multipurpose', 'ባለብዙ ዓላማ',  2, '✨', '#8B5CF6'),
  ('floor',        'Floor',        'ወለል',           3, '🧹', '#10B981'),
  ('dishes',       'Dishes',       'ምግብ ዕቃ',      4, '🍽️', '#F59E0B'),
  ('baby',         'Baby',         'ሕጻን',          5, '🍼', '#EC4899')
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA — Products from products.json
-- ============================================================
insert into products (id, name_en, name_am, description_en, description_am, image, category, prices, badge, rating, reviews, tiktok_videos, featured) values
(
  'cleano-laundry-detergent',
  'CLEANO Laundry Detergent',
  'የክሊኖ የልብስ ማጠቢያ ሳሙና',
  'Our flagship formula engineered for Ethiopia''s toughest stains.',
  'ለኢትዮጵያ ጠንካራ ቆሻሻ የተዘጋጀ ዋና ቀመራችን።',
  'https://ibb.co/kVpwG7KH',
  'laundry',
  '{"3L": 590, "5L": 850}',
  'Best Seller', 4.9, 1240,
  '["https://www.tiktok.com/@cleano_official"]',
  true
),
(
  'cleano-dishwash',
  'CLEANO Dishwash',
  'የክሊኖ የእቃ ማጠቢያ',
  'Infused with real lemon extracts, this formula cuts through kitchen grease.',
  'በትክክለኛ የሎሚ ሀረጎች የተቀመመ።',
  'https://ibb.co/fGVgKsJg',
  'multipurpose',
  '{"3L": 560, "5L": 730}',
  'New', 4.7, 876,
  '["https://www.tiktok.com/@cleano_official"]',
  true
),
(
  'cleano-antiseptic-disinfectant',
  'CLEANO Antiseptic Disinfectant',
  'ክሊኖ አንቲሴፕቲክ ፀረ-ተባይ',
  'Specially designed for white and light-colored fabrics.',
  'ለነጭ እና ለቀለል ያሉ ጨርቆች በተለይ የተዘጋጀ።',
  'https://ibb.co/BHQYk0SC',
  'floor',
  '{"3L": 630, "5L": 850}',
  'Premium', 4.8, 654,
  '[]',
  false
),
(
  'cleano-floor-shine',
  'CLEANO Floor Shine',
  'ክሊኖ ፍሎር ሻይን',
  'Transform dull floors into gleaming surfaces with Floor Shine.',
  'ደብዛዛ ወለሎችን ወደ አብሪ ወለሎች ይቀይሩ።',
  'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=80',
  'floor',
  '{"3L": 95, "5L": 148}',
  null, 4.6, 432,
  '[]',
  false
),
(
  'cleano-dish-pro',
  'CLEANO Dish Pro',
  'ክሊኖ ዲሽ ፕሮ',
  'Concentrated dish-washing liquid that battles the greasiest pots.',
  'ለዘይታማ ድስቶች የሚታገል ማጎሪያ የምግብ ዕቃ ማጠቢያ ፈሳሽ።',
  'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&q=80',
  'dishes',
  '{"3L": 88, "5L": 135}',
  'Value Pack', 4.5, 987,
  '[]',
  false
),
(
  'cleano-baby-soft',
  'CLEANO Baby Soft',
  'ክሊኖ ቤቢ ሶፍት',
  'Hypoallergenic formula for delicate baby clothes and sensitive skin.',
  'ለስስ የሕጻናት ልብሶች ሃይፖአለርጂኒክ ቀመር።',
  'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80',
  'baby',
  '{"3L": 155, "5L": 240}',
  'Hypoallergenic', 4.9, 523,
  '[]',
  true
)
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA — Branches from branches.json
-- ============================================================
insert into branches (id, name_en, name_am, address_en, address_am, phone, hours, lat, lng, is_main) values
(
  'branch-bole',
  'CLEANO Bole Branch', 'ክሊኖ ቦሌ ቅርንጫፍ',
  'Bole Road, Near Edna Mall, Addis Ababa', 'ቦሌ መንገድ፣ ኤድና ሞል አቅራቢያ፣ አዲስ አበባ',
  '+251 91 123 4567', 'Mon–Sat: 8AM–8PM | Sun: 9AM–6PM',
  8.9936, 38.7862, true
),
(
  'branch-piassa',
  'CLEANO Piassa Branch', 'ክሊኖ ፒያሳ ቅርንጫፍ',
  'Churchill Avenue, Piassa, Addis Ababa', 'ቸርቺል አቭኑ፣ ፒያሳ፣ አዲስ አበባ',
  '+251 91 234 5678', 'Mon–Sat: 8AM–7PM | Sun: 10AM–5PM',
  9.0307, 38.7468, false
),
(
  'branch-merkato',
  'CLEANO Merkato Hub', 'ክሊኖ መርካቶ ሃብ',
  'Merkato Market, Addis Ketema, Addis Ababa', 'መርካቶ ገበያ፣ አዲስ ከተማ፣ አዲስ አበባ',
  '+251 91 345 6789', 'Mon–Sun: 7AM–9PM',
  9.0345, 38.7295, false
),
(
  'branch-kazanchis',
  'CLEANO Kazanchis Store', 'ክሊኖ ካዛንቺስ መደብር',
  'Kazanchis Business District, Addis Ababa', 'ካዛንቺስ ቢዝነስ ዲስትሪክት፣ አዲስ አበባ',
  '+251 91 456 7890', 'Mon–Fri: 8AM–7PM | Sat–Sun: 9AM–6PM',
  9.0163, 38.7612, false
),
(
  'branch-megenagna',
  'CLEANO Megenagna Outlet', 'ክሊኖ መገናኛ አውትሌት',
  'Megenagna Square, Ring Road, Addis Ababa', 'መገናኛ አደባባይ፣ ቀለበት መንገድ፣ አዲስ አበባ',
  '+251 91 567 8901', 'Mon–Sat: 8AM–8PM | Sun: 9AM–5PM',
  9.0200, 38.7915, false
)
on conflict (id) do nothing;

-- ============================================================
-- Row Level Security — disable for admin tables
-- (They are protected by your app-level session checks)
-- ============================================================
alter table admin_users         disable row level security;
alter table products            disable row level security;
alter table branches            disable row level security;
alter table categories          disable row level security;
alter table inventory           disable row level security;
alter table site_settings       disable row level security;
alter table content_sections    disable row level security;
alter table translations        disable row level security;
alter table media_files         disable row level security;
alter table audit_log           disable row level security;
alter table analytics_events    disable row level security;

-- ============================================================
-- Done! Check the tables appear in Table Editor.
-- ============================================================
