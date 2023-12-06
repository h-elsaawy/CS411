-- Create the update watchlist ID's stored procedure and cursor. 
DROP PROCEDURE if exists updateWatchlistIDsForUser2;

DELIMITER //

CREATE PROCEDURE updateWatchlistIDsForUser2(IN user_in VARCHAR(30))
BEGIN
    DECLARE done INT DEFAULT FALSE; -- Break cursor and loop
    DECLARE old_watchlist_id INT;
    DECLARE new_watchlist_id INT;
    DECLARE username VARCHAR(30);
    DECLARE channel_id VARCHAR(100);
    DECLARE comments VARCHAR(1000);
    DECLARE watchlist_title VARCHAR(255); 

    -- declare the cursor
    DECLARE cur_watchlist CURSOR FOR
        SELECT w.watchlist_id AS old_watchlist_id, 
               temp.new_watchlist_id as new_watchlist_id, 
               w.username as username, 
               w.channel_id as channel_id,
               w.comments as comments,
               w.title as watchlist_title
        FROM ( SELECT LOWER(w1.title) as title, ROW_NUMBER() OVER (ORDER BY LOWER(w1.title)) AS new_watchlist_id
                FROM watchlist w1
                WHERE w1.username = user_in
                GROUP BY LOWER(w1.title) ) AS temp
            JOIN watchlist w ON (LOWER(w.title) = LOWER(temp.title))
        WHERE w.username = user_in
        ORDER BY new_watchlist_id ASC;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    DROP TABLE IF EXISTS temp_watchlist;
    CREATE TABLE temp_watchlist(watchlist_id INT, username VARCHAR(30), channel_id VARCHAR(100), comments VARCHAR(1000), title VARCHAR(255));

    OPEN cur_watchlist;

    read_loop: LOOP
        FETCH cur_watchlist INTO old_watchlist_id, new_watchlist_id, username, channel_id, comments, watchlist_title;

        IF done THEN
            LEAVE read_loop;
        END IF;

        INSERT INTO temp_watchlist(watchlist_id, username, channel_id, comments, title)
        VALUES (new_watchlist_id, username, channel_id, comments, watchlist_title);

    END LOOP;
    CLOSE cur_watchlist;

    -- SELECT user_in;

    DELETE FROM watchlist w WHERE w.username LIKE user_in;
    -- SELECT COUNT(*) FROM Watchlist;
    INSERT INTO watchlist(watchlist_id, username, channel_id, comments, title) SELECT t.watchlist_id, t.username, t.channel_id, t.comments, t.title FROM temp_watchlist t;
    -- SELECT * FROM temp_watchlist ORDER BY watchlist_id;
    DROP TABLE IF EXISTS temp_watchlist;
END //
DELIMITER ;