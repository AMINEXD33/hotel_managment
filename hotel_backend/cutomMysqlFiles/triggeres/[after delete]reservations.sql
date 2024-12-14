DROP TRIGGER IF EXISTS  reservation_after_deletion;
CREATE  TRIGGER  reservation_after_deletion AFTER DELETE  ON reservations
FOR EACH ROW
BEGIN
    UPDATE rooms SET rooms.available = true WHERE rooms.id = OLD.id_room;
    INSERT
    INTO
        historique_reservations(
                                id_room,
                                id_customer,
                                check_in,
                                check_out,
                                check_out_note,
                                check_in_note,
                                room_stars,
                                hotel_stars,
                                total_price,
                                created_at,
                                updated_at)
    values(
           old.id_room,
           old.id_customer,
           old.check_in,
           old.check_out,
           old.check_out_note,
           old.check_in_note,
           old.room_stars,
           old.hotel_stars,
           old.total_price,
           now(),
           now());
end

