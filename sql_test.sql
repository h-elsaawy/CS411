-- Create the update watchlist ID's stored procedure and cursor. 
DROP PROCEDURE if exists updateWatchlistIDsForUser2;

DELIMITER //

CREATE PROCEDURE updateWatchlistIDsForUser2(IN user_in VARCHAR(30))
BEGIN
    DECLARE done INT DEFAULT FALSE; -- Break cursor and loop
    DECLARE old_watchlist_id INT;
    DECLARE new_watchlist_id INT;
    DECLARE username VARCHAR(30);
    DECLARE watchlist_title VARCHAR(55); 

    -- declare the cursor
    DECLARE cur_watchlist CURSOR FOR
        SELECT w.watchlist_id AS old_watchlist_id, temp.new_watchlist_id as new_watchlist_id, w.username as username, temp.title as watchlist_title
        FROM ( SELECT MIN(watchlist_id) AS watchlist_id, LOWER(title) AS title, ROW_NUMBER() OVER (ORDER BY LOWER(title)) AS new_watchlist_id
                FROM watchlist w1
                WHERE w1.username = user_in
                GROUP BY LOWER(title) ) AS temp
            JOIN watchlist w ON (LOWER(w.title) = temp.title)
        WHERE w.username = user_in
        ORDER BY temp.title;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur_watchlist;

    read_loop: LOOP
        FETCH cur_watchlist INTO old_watchlist_id, new_watchlist_id, username, watchlist_title;

        IF done THEN
            LEAVE read_loop;
        END IF;
  
        UPDATE watchlist
        SET watchlist_id = new_watchlist_id
        WHERE username = username AND LOWER(title) = watchlist_title AND watchlist_id = old_watchlist_id;
    END LOOP;
    CLOSE cur_watchlist;
END //
DELIMITER ;



-- Create the watchlist delete trigger that calls the update watchlist_id procedure.
-- Doesn't work. 
DELIMITER //
CREATE TRIGGER updateWatchlistIdsAfterDelete2
    BEFORE DELETE 
    ON watchlist
    FOR EACH ROW
BEGIN

        CALL updateWatchlistIDsForUser2(OLD.username);

END //
DELIMITER ;