CREATE TABLE IF NOT EXISTS event_artworks(
    id SERIAL PRIMARY KEY,
    event_id INTEGER,
    position SMALLINT NOT NULL,
    status BOOLEAN NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id)
);