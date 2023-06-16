CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  name_original VARCHAR(32),
  short_name VARCHAR(32),
  slug VARCHAR(32),
  status BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
  

);