DROP TRIGGER IF EXISTS  reservation_after_insert;
CREATE  TRIGGER  reservation_after_insert AFTER INSERT  ON reservations
FOR EACH ROW
BEGIN
    UPDATE rooms SET rooms.available = false WHERE rooms.id = NEW.id_room;
end