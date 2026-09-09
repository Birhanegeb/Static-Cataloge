-- =====================================================
-- PRODUCTS DATABASE
-- =====================================================


-- =====================================================
-- PRODUCTS TABLE
-- =====================================================

create table if not exists public.products (

  id uuid primary key
    default gen_random_uuid(),

  name text not null,

  category text not null
    default 'Other',

  weight text,

  price numeric(12,2) not null
    default 0,

  description text,

  image_url text not null,

  is_active boolean not null
    default true,

  display_style text not null
    default 'black',

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now()

);


-- =====================================================
-- IMPORTANT:
-- If the products table already existed before
-- display_style was added, this adds the missing column.
-- =====================================================

alter table public.products
add column if not exists
display_style text not null
default 'black';


-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.products
enable row level security;


-- =====================================================
-- PRODUCT POLICIES
-- =====================================================

drop policy if exists
"Public can view active products"
on public.products;


create policy
"Public can view active products"

on public.products

for select

to anon, authenticated

using (
  is_active = true
);


-- =====================================================
-- AUTHENTICATED INSERT
-- =====================================================

drop policy if exists
"Authenticated users can insert products"
on public.products;


create policy
"Authenticated users can insert products"

on public.products

for insert

to authenticated

with check (true);


-- =====================================================
-- AUTHENTICATED UPDATE
-- =====================================================

drop policy if exists
"Authenticated users can update products"
on public.products;


create policy
"Authenticated users can update products"

on public.products

for update

to authenticated

using (true)

with check (true);


-- =====================================================
-- AUTHENTICATED DELETE
-- =====================================================

drop policy if exists
"Authenticated users can delete products"
on public.products;


create policy
"Authenticated users can delete products"

on public.products

for delete

to authenticated

using (true);


-- =====================================================
-- STORAGE BUCKET
-- =====================================================

insert into storage.buckets (
  id,
  name,
  public
)

values (
  'product-images',
  'product-images',
  true
)

on conflict (id)

do update set
  public = true;


-- =====================================================
-- STORAGE POLICIES
-- =====================================================

drop policy if exists
"Public can view product images"
on storage.objects;


create policy
"Public can view product images"

on storage.objects

for select

to public

using (
  bucket_id = 'product-images'
);


-- =====================================================
-- UPLOAD
-- =====================================================

drop policy if exists
"Authenticated users can upload product images"
on storage.objects;


create policy
"Authenticated users can upload product images"

on storage.objects

for insert

to authenticated

with check (
  bucket_id = 'product-images'
);


-- =====================================================
-- UPDATE
-- =====================================================

drop policy if exists
"Authenticated users can update product images"
on storage.objects;


create policy
"Authenticated users can update product images"

on storage.objects

for update

to authenticated

using (
  bucket_id = 'product-images'
)

with check (
  bucket_id = 'product-images'
);


-- =====================================================
-- DELETE
-- =====================================================

drop policy if exists
"Authenticated users can delete product images"
on storage.objects;


create policy
"Authenticated users can delete product images"

on storage.objects

for delete

to authenticated

using (
  bucket_id = 'product-images'
);


-- =====================================================
-- RELOAD SUPABASE API SCHEMA CACHE
-- =====================================================

notify pgrst, 'reload schema';