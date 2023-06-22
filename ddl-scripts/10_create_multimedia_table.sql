DO $$ BEGIN CREATE TYPE c_type AS ENUM('video', 'publication', 'press');
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
CREATE TABLE IF NOT EXISTS multimedia(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    content TEXT,
    slug VARCHAR(255),
    content_type c_type,
    position smallint,
    status BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()

);