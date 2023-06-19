CREATE TABLE IF NOT EXISTS artwork (
    id SERIAL PRIMARY KEY,
    collection_id INT REFERENCES collections(id),
    name VARCHAR(32),
    slug VARCHAR(32),
    title VARCHAR(256),
    description TEXT,
    content TEXT,
    tags VARCHAR(256),
    meta VARCHAR(256),
    status BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()

 
);