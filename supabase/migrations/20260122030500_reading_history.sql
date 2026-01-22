
CREATE TABLE reading_history (
    id UUID PRIMARY KEY,
    user_id TEXT NOT NULL,
    book_title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    read_date DATE NOT NULL,
    start_page INT NOT NULL,
    end_page INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
