CREATE TABLE IF NOT EXISTS exhibition_media (
    id SERIAL PRIMARY KEY,
    exhibition_id INT,
    media_id INT,
    position INT,
    FOREIGN KEY (exhibition_id) REFERENCES exhibitions (id),
    FOREIGN KEY (media_id) REFERENCES media (id)
);
