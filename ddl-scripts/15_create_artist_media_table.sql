CREATE TABLE IF NOT EXISTS artist_media (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id),
    media_id INTEGER REFERENCES media(id),
    position SMALLINT
);