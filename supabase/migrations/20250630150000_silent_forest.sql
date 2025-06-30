/*
  # Add video URL to recipes
Adds a new optional `video_url` column and populates demo recipes with Tavus links.
*/

ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS video_url text;

UPDATE recipes
SET video_url = 'https://tavus.video/474a913761'
WHERE id = 'e720d219-acbe-4823-85a6-97b013c862c4';

UPDATE recipes
SET video_url = 'https://tavus.video/47d08150fd'
WHERE id = '76c3967f-d42c-4d70-aac9-c7e50172f02f';

UPDATE recipes
SET video_url = 'https://tavus.video/fefe3b3e98'
WHERE id = 'd3bfd424-7598-4951-846d-84926e086106';
