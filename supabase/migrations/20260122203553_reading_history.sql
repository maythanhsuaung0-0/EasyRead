CREATE TABLE reading_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    book_title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    read_date DATE NOT NULL,
    start_page INT NOT NULL,
    end_page INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE reading_history
ENABLE ROW LEVEL SECURITY;  

CREATE POLICY user_reading_history_policy on reading_history
FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'::TEXT));

CREATE POLICY user_reading_history_insert_policy on reading_history
FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'::TEXT));

CREATE POLICY user_reading_history_update_policy on reading_history
FOR UPDATE 
  USING (user_id = (auth.jwt() ->> 'sub'::TEXT));

CREATE POLICY user_reading_history_delete_policy on reading_history
FOR DELETE 
  USING (user_id = (auth.jwt() ->> 'sub'::TEXT));

