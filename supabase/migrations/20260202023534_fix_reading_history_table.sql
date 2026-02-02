-- deletee table if exists reading_history;
drop table if exists reading_history;

create table if not exists reading_history (
  id UUID default gen_random_uuid() primary key,
    user_id UUID not null references auth.users(id) on delete cascade,
    book_title varchar(255) not null,
    author varchar(255),
    start_page integer,
  end_page integer,
    started_at timestamp without time zone,
    finished_at timestamp without time zone,
    created_at timestamp without time zone default current_timestamp,
    updated_at timestamp without time zone default current_timestamp
);

create index if not exists idx_reading_history_book_title on reading_history(book_title);     

alter table reading_history enable row level security;

create policy select_reading_history on reading_history
    for select
    using (user_id = auth.uid());

create policy insert_reading_history on reading_history
    for insert
    with check (user_id = auth.uid());

create policy update_reading_history on reading_history
    for update
    using (user_id = auth.uid());

create policy delete_reading_history on reading_history
    for delete
    using (user_id = auth.uid());

