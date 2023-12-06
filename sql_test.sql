-- Create the variable search procedure
DROP PROCEDURE IF EXISTS variablesearch2;
DELIMITER //

CREATE PROCEDURE `variablesearch2`(
    IN searchTerm VARCHAR(255),
    IN searchCategory VARCHAR(255),
    IN searchType VARCHAR(10)
)
BEGIN

    IF searchType = "youtuber" THEN
        -- Searches all the channel titles for the input str
        SELECT youtuber AS channel_title
        FROM channels 
        WHERE youtuber LIKE CONCAT('%', searchTerm, '%')
     UNION
        SELECT channel_title 
        FROM videos 
        WHERE channel_title LIKE CONCAT('%', searchTerm, '%');

    ELSEIF searchType = "title" THEN
        -- searches all the videos for video_titles that contain the string
        SELECT DISTINCT channel_title 
        FROM videos LEFT JOIN channels ON (videos.channel_title = channels.youtuber)
        WHERE videos.title LIKE CONCAT('%', searchTerm, '%')
        GROUP BY channel_title;

    ELSEIF searchType = "tags" THEN
        -- searches all the video tags that contain the string
        SELECT DISTINCT channel_title
        FROM (videos JOIN tags USING (video_id))  
        WHERE tags LIKE CONCAT('%', searchTerm, '%');

    ELSEIF searchType = "category" THEN
        SELECT  channel_title
        FROM distinct_videos v JOIN categories c using (category_id)
        WHERE c.title LIKE searchCategory AND v.channel_title LIKE CONCAT('%', searchTerm,'%')
        GROUP BY channel_title
        ORDER BY COUNT(video_id) DESC, SUM(views) DESC
        LIMIT 25;
    END IF;
    
END //

DELIMITER ;
CALL variablesearch2('50', 'entertainment', 'category' );
