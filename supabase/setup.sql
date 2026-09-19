insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'recipe-images',
  'recipe-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = true,
    file_size_limit = 8388608,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

alter table public.recipe_overrides enable row level security;

drop policy if exists "recipe_overrides_public_read" on public.recipe_overrides;
create policy "recipe_overrides_public_read"
on public.recipe_overrides
for select
to anon, authenticated
using (true);

drop policy if exists "recipe_overrides_admin_write" on public.recipe_overrides;
create policy "recipe_overrides_admin_write"
on public.recipe_overrides
for all
to authenticated
using (lower(auth.jwt() ->> 'email') = 'kmkj05@yahoo.com')
with check (lower(auth.jwt() ->> 'email') = 'kmkj05@yahoo.com');

drop policy if exists "recipe_images_public_read" on storage.objects;
create policy "recipe_images_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'recipe-images');

drop policy if exists "recipe_images_admin_write" on storage.objects;
create policy "recipe_images_admin_write"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'recipe-images'
  and lower(auth.jwt() ->> 'email') = 'kmkj05@yahoo.com'
)
with check (
  bucket_id = 'recipe-images'
  and lower(auth.jwt() ->> 'email') = 'kmkj05@yahoo.com'
);
