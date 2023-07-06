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

CREATE TABLE IF NOT EXISTS user_logs (
  id SERIAL PRIMARY KEY,
  user_id INT,
  module VARCHAR(256),
  action VARCHAR(32),
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

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

CREATE TABLE IF NOT EXISTS menu (
  id SERIAL PRIMARY KEY,
  page_id INT REFERENCES pages(id),
  position INT
);

CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  name_original VARCHAR(32),
  short_name VARCHAR(32),
  slug VARCHAR(32),
  status BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
  

);

CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  artist_id INT REFERENCES artists(id),
  name VARCHAR(256),
  status BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS pick_artworks (
    id SERIAL PRIMARY KEY,
    artwork_id INTEGER,
    position SMALLINT,
    status BOOLEAN,
    FOREIGN KEY (artwork_id) REFERENCES artwork (id)
);

CREATE TABLE IF NOT EXISTS spotlight_artworks(
    id SERIAL PRIMARY KEY,
    artwork_id INTEGER,
    position SMALLINT,
    status BOOLEAN,
    FOREIGN KEY (artwork_id) REFERENCES artwork (id)
);

CREATE TABLE IF NOT EXISTS event_artworks(
    id SERIAL PRIMARY KEY,
    event_id INTEGER,
    position SMALLINT NOT NULL,
    status BOOLEAN NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS media(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    path VARCHAR(256),
    status BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS artist_media (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id),
    media_id INTEGER REFERENCES media(id),
    position SMALLINT
);

CREATE TABLE IF NOT EXISTS collection_media(
    id SERIAL PRIMARY KEY,
    position SMALLINT,
    collection_id INTEGER REFERENCES collections(id),
    media_id INTEGER REFERENCES media(id)
);

CREATE TABLE IF NOT EXISTS artwork_media(
    id SERIAL PRIMARY KEY,
    artwork_id INTEGER REFERENCES artwork(id),
    media_id INTEGER REFERENCES media(id),
    position SMALLINT
);

CREATE TABLE IF NOT EXISTS exhibition_media (
    id SERIAL PRIMARY KEY,
    exhibition_id INT,
    media_id INT,
    position INT,
    FOREIGN KEY (exhibition_id) REFERENCES exhibitions (id),
    FOREIGN KEY (media_id) REFERENCES media (id)
);

CREATE TABLE IF NOT EXISTS event_media(
    id SERIAL PRIMARY KEY,
    event_id INT,
    media_id INT,
    position SMALLINT,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (media_id) REFERENCES media(id)
);
