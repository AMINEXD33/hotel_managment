DROP TRIGGER  IF EXISTS reservation_before_insert;
CREATE TRIGGER reservation_before_insert BEFORE INSERT ON reservations
FOR EACH ROW
BEGIN
    DECLARE availablitiy INT;
    SELECT available from rooms where id = NEW.id_room INTO availablitiy;

    IF availablitiy = false THEN
         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "the room is not available";
    ELSEIF availablitiy IS NULL THEN
         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "the room doesn't exist";
    END IF;
end