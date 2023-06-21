CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(16),
  title VARCHAR(256),
  description TEXT,
  content TEXT,
  tags VARCHAR(256),
  meta VARCHAR(256),
  show_in_menu BOOLEAN,
  status BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
