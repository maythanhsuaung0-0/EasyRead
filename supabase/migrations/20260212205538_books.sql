create table if not exists books (
  id UUID default gen_random_uuid() primary key,
    title varchar(255) not null,
    author varchar(255),
    published_date date,
    preview_url varchar(255),
    file_url varchar(255),
    is_favorite boolean default false,
    user_id UUID not null references auth.users(id) on delete cascade,
    created_at timestamp without time zone default current_timestamp,
    updated_at timestamp without time zone default current_timestamp
);

create index if not exists idx_book_title on books(title);

alter table books enable row level security;

create policy select_books on books
    for select
    using (user_id = auth.uid());

create policy insert_books on books
for insert
with check (user_id = auth.uid());

create policy update_books on books
for update
using (user_id = auth.uid());

create policy delete_books on books
for delete
using (user_id = auth.uid());
