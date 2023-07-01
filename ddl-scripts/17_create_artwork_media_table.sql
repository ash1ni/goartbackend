CREATE TABLE IF NOT EXISTS artwork_media(
    id SERIAL PRIMARY KEY,
    artwork_id INTEGER REFERENCES artwork(id),
    media_id INTEGER REFERENCES media(id),
    position SMALLINT
);