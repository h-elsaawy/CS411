-- Stored procedure to update users.
DROP PROCEDURE IF EXISTS set_user;

DELIMITER //
CREATE PROCEDURE set_user(
    IN user_in VARCHAR(30),
    IN name_in VARCHAR(30),
    IN password_in VARCHAR(30),
    IN email_in VARCHAR(255),
    IN region_id_in VARCHAR(2),
    IN role_in TINYINT(1)
)
BEGIN
    DECLARE user_set_code VARCHAR(30) DEFAULT(NULL);
    -- Check to make sure username or email is not already used.
    IF ((SELECT COUNT(*) FROM users u WHERE u.username LIKE user_in ) > 0) THEN
        SET user_set_code = "username";
    ELSEIF (SELECT COUNT(*) FROM users u WHERE u.email LIKE email_in ) > 0 THEN
        SET user_set_code = "email";
    ELSE
        START TRANSACTION;
        BEGIN
            INSERT INTO users (username, name, password, email, region_id, role)
            VALUES (user_in, name_in, password_in, email_in, region_id_in, role_in);
            COMMIT;
            SET user_set_code = "created";
        END;
    END IF;
    SELECT user_set_code;
END //
SHOW WARNINGS //


DELIMITER ;

CALL set_user(
    "haadi2",
    "haadi elsaawy",
    "test1234",
    "haadi@hotmail.com",
    "US",
    0
);
SHOW WARNINGS ;

-- SELECT @return_code;