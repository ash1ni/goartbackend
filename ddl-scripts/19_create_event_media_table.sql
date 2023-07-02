CREATE TABLE IF NOT EXISTS event_media(
    id SERIAL PRIMARY KEY,
    event_id INT,
    media_id INT,
    position SMALLINT,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (media_id) REFERENCES medias(id)
);