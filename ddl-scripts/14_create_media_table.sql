CREATE TABLE IF NOT EXISTS media(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    path VARCHAR(256),
    status BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);