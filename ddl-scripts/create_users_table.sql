DO $$ BEGIN CREATE TYPE role AS ENUM('superadmin', 'admin', 'editor');
EXCEPTION
WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY,
    username VARCHAR(256) NOT NULL,
    password VARCHAR(256) NOT NULL,
    email VARCHAR(32) NOT NULL,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    user_role role NOT NULL,
    status BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);