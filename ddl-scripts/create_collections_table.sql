CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  artist_id INT REFERENCES artists(id),
  name VARCHAR(256),
  status BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
