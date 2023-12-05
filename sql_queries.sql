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

-- Testing the JSON_ARRARYAGG function
-- SELECT watchlist_id, title, JSON_ARRAYAGG( channel_id)
-- FROM watchlist
-- WHERE username = "abailey"
-- group by watchlist_id, title;

-- Search stored procedure 
-- We need two stored procedures
 
-- wordcount(str TEXT)       
-- SQL SECURITY INVOKER
--     NO SQL
-- DELIMITER //
-- CREATE FUNCTION wordcount(str TEXT)
--         RETURNS INT
--         DETERMINISTIC

--     BEGIN
--         DECLARE wordCnt, i, maxI INT DEFAULT 0;
--         DECLARE currChar, prevChar BOOL DEFAULT 0;
--         SET maxI=char_length(str);
--         WHILE i < maxI DO
--             SET currChar=SUBSTRING(str, i, 1) RLIKE '[[:alnum:]]';
--             IF NOT prevChar AND currChar THEN
--                 SET wordCnt=wordCnt+1;
--             END IF;
--             SET prevChar=currChar;
--             SET i=i+1;
--         END WHILE;
--         RETURN wordCnt;
--     END
-- //
-- DELIMITER ;

-- DELIMITER //

-- CREATE PROCEDURE search_channels(IN searchString VARCHAR(255))
--     BEGIN
--         -- Start by doing a search of the entire string
--         SELECT DISTINCT c.youtuber
--         FROM channels c
--         WHERE LOWER(c.youtuber) LIKE CONCAT('%',LOWER(searchString),'%');

--         UNION

--         SELECT DISTINCT v.channel_title
--         FROM videos v
--     END
-- //
-- DELIMITER ;

DROP PROCEDURE IF EXISTS set_user;

DELIMITER //
CREATE PROCEDURE set_user(
    IN user_in VARCHAR(30),
    IN name_in VARCHAR(30),
    IN password_in VARCHAR(30),
    IN email_in VARCHAR(255),
    IN region_id_in VARCHAR(2),
    IN role_in TINYINT(1),
    OUT user_set_code INT
)
BEGIN
    
    -- Check to make sure username or email is not already used.
    IF EXISTS (SELECT u.username FROM users u WHERE u.username LIKE user_in ) THEN
        SET user_set_code = 0;
    ELSEIF EXISTS (SELECT u.email FROM users u WHERE u.email LIKE email_in ) THEN
        SET user_set_code = 1;
    ELSE
        START TRANSACTION;
        BEGIN
            INSERT INTO users (username, name, password, email, region_id, role)
            VALUES (user_in, name_in, password_in, email_in, region_id_in, role_in);
            COMMIT;
            SET user_set_code = 10;
        END;
    END IF;
END //

DELIMITER ;

CALL set_user(
    "haadi",
    "haadi elsaawy",
    "test1234",
    "haadi@hotmail.com",
    "US",
    0, 
    @return_code
);
SELECT @retrun_code;

DELIMITER //

CREATE PROCEDURE `variablesearch`(
    IN searchTerm VARCHAR(255),
    IN searchType VARCHAR(10)
)
BEGIN



    IF searchType = "youtuber" THEN
        SELECT youtuber AS channel_title, youtuber AS title FROM channels WHERE youtuber LIKE CONCAT('%', searchTerm, '%')
		UNION
        SELECT channel_title, title  FROM videos WHERE channel_title LIKE CONCAT('%', searchTerm, '%');
    ELSEIF searchType = "title" THEN
        SELECT DISTINCT channel_title, title FROM videos WHERE title LIKE CONCAT('%', searchTerm, '%');
    ELSEIF searchType = "tags" THEN
        SELECT DISTINCT channel_title, title FROM (videos JOIN tags USING (video_id))  WHERE tags LIKE CONCAT('%', searchTerm, '%');
    END IF;


    
END //

DELIMITER ;