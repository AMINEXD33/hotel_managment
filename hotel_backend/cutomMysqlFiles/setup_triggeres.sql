DROP TRIGGER  IF EXISTS reservation_before_insert;
DELIMITER $$
# a trigger to check if the room is available before any reservation
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
$$
DELIMITER ;

DROP TRIGGER IF EXISTS  reservation_after_insert;
DELIMITER $$
# a trigger that sets the availability of a room to false when a reservation
# is added
CREATE  TRIGGER  reservation_after_insert AFTER INSERT  ON reservations
FOR EACH ROW
BEGIN
    UPDATE rooms SET rooms.available = false WHERE rooms.id = NEW.id_room;
end $$
DELIMITER ;


DROP TRIGGER IF EXISTS  reservation_after_deletion;
DELIMITER $$
# reset the availability to true on the room after the deletion of the reservation 
CREATE  TRIGGER  reservation_after_deletion AFTER DELETE  ON reservations
FOR EACH ROW
BEGIN
    UPDATE rooms SET rooms.available = true WHERE rooms.id = OLD.id_room;
end
$$
DELIMITER ;
