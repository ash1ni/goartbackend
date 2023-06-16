CREATE TABLE IF NOT EXISTS menu (
  id SERIAL PRIMARY KEY,
  page_id INT REFERENCES pages(id),
  position INT
);
