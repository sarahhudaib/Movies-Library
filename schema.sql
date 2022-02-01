DROP TABLE IF EXISTS favMovies;

CREATE TABLE IF NOT EXISTS favMovies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date INTEGER,
    poster_path VARCHAR(255),
    overview VARCHAR(10000)
);

