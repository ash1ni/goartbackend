CREATE TABLE IF NOT EXISTS collection_media(
    id SERIAL PRIMARY KEY,
    position SMALLINT,
    collection_id INTEGER REFERENCES collections(id),
    media_id INTEGER REFERENCES media(id)
);