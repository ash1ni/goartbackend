CREATE TABLE IF NOT EXISTS exhibitions (
  id serial PRIMARY KEY,
  title varchar(16),
  subtitle varchar(256),
  content text,
  slug varchar(256),
  tags varchar(256),
  position smallint,
  status boolean,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);
