CREATE TABLE IF NOT EXISTS events(
    id SERIAL PRIMARY KEY,
    title INT,
    subtitle VARCHAR(255),
    content text,
    slug VARCHAR(255),
    tags VARCHAR(255),
    position smallint,
    status BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);