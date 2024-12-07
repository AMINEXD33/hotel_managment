DROP FUNCTION IF  EXISTS isRoomAvailable;

CREATE FUNCTION isRoomAvailable (id_room INT)
RETURNS BOOLEAN NOT DETERMINISTIC
BEGIN
    DECLARE is_room_available BOOLEAN;
    SELECT available FROM rooms WHERE rooms.id = id_room
    INTO is_room_available;

    IF is_room_available is NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "the room doesn't exist";
    end if;

    return is_room_available;
END ;
