CREATE TABLE IF NOT EXISTS spotlight_artworks(
    id SERIAL PRIMARY KEY,
    artwork_id INTEGER,
    position SMALLINT,
    status BOOLEAN,
    FOREIGN KEY (artwork_id) REFERENCES artwork (id)
);