DROP TRIGGER IF EXISTS before_deleting_room;
CREATE TRIGGER  before_deleting_room BEFORE DELETE ON rooms
FOR EACH ROW
begin
    DECLARE id_reserved INT;
    SELECT id_room FROM reservations WHERE id_room = OLD.id INTO id_reserved;

    IF id_reserved THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "you can't remove a room while it's reserved";
    end if;

END;
