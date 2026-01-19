-- Migration number: 0000 	 2024-08-01_11:59:00

CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL
);
