insert into public.categories (slug, name) values ('tui-xach','Túi xách') on conflict do nothing;
insert into public.products (slug, name, price, stock, category_id)
select 'san-pham-mau-1','Sản phẩm mẫu 1',199000,10,id from public.categories where slug='tui-xach'
on conflict do nothing;
