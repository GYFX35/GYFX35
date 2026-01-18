-- Migration number: 0001 	 2024-08-01_12:00:00

ALTER TABLE videos ADD COLUMN thumbnail TEXT;
ALTER TABLE videos ADD COLUMN source TEXT;
