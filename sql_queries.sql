USE youtube;
SHOW TABLES;

-- Show the highest viewed categories
SELECT c.title, c.category_id,  SUM(views) AS num_views 
FROM distinct_videos v JOIN categories c USING (category_id) 
GROUP BY c.title, category_id 
ORDER BY SUM(views) DESC 
LIMIT 5;
--  Top trending categories are 10 , 24, 1, 23, 22

-- Show the top 5 videos that are trending in the most trending category
SELECT v.title, trending_date, channel_title, views
FROM distinct_videos v JOIN categories c USING (category_id, region_id)
WHERE c.category_id = 10 AND  v.views = (SELECT max(v2.views)
                                        FROM videos v2
                                        WHERE v.video_id = v2.video_id)
ORDER BY  trending_date DESC, views DESC
LIMIT 5;

-- -- Create a table where the video_id is distinct and retain the max video views.
-- CREATE TABLE distinct_videos AS
--     SELECT *
--     FROM Videos v
--     WHERE v.views = (SELECT max(v2.views)
--                         FROM videos v2
--                         WHERE v.video_id = v2.video_id)
--     ORDER BY trending_date DESC, views DESC


-- Find the top trending channels in a category
--  Top trending categories are 10 , 24, 1, 23, 22
SELECT  channel_title, COUNT(video_id) AS num_videos, SUM(views) as num_views
FROM distinct_videos v
WHERE category_id = 10 
GROUP BY channel_title
ORDER BY num_videos DESC
LIMIT 5;

--


`
SELECT c.title, v.channel_title, COUNT(video_id) AS num_videos, SUM(views) as num_views
FROM distinct_videos v JOIN (SELECT c1.category_id, c1.title
                            FROM distinct_videos v1 JOIN categories c1 USING (region_id, category_id) 
                            GROUP BY c1.category_id, c1.title
                            ORDER BY SUM(views) DESC 
                            LIMIT 5) as c USING (category_id)
GROUP BY c.title, channel_title
ORDER BY c.title, num_videos DESC
LIMIT 25; 
`


 SELECT watchlist_id, title, JSON_ARRAYAGG( channel_id)
     FROM watchlist
     WHERE username = "abailey"
  group by watchlist_id, title;
 