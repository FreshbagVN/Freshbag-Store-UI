-- Schema khởi tạo cho môi trường TEST (chạy trong Supabase project test, không chạy ở production).
-- Là bản nháp: sẽ chỉnh lại theo dữ liệu thực tế từ freshbag.pro.vn.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  parent_id uuid references public.categories(id) on delete set null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price numeric(12,0) not null check (price >= 0),
  sale_price numeric(12,0) check (sale_price >= 0),
  sku text unique,
  stock int not null default 0,
  images text[] not null default '{}',
  category_id uuid references public.categories(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  note text,
  total numeric(12,0) not null,
  status text not null default 'new' check (status in ('new','confirmed','shipping','done','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  price numeric(12,0) not null,
  quantity int not null check (quantity > 0)
);

alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Khách xem được danh mục và sản phẩm đang bán
create policy "public read categories" on public.categories for select using (true);
create policy "public read products" on public.products for select using (is_active);
-- Đơn hàng: chỉ ghi qua server (service role), không mở cho anon
