DROP FUNCTION IF EXISTS returnSingleReservationCost;
CREATE FUNCTION returnSingleReservationCost(id_reservation INT)
RETURNS FLOAT DETERMINISTIC
BEGIN
    DECLARE price_ FLOAT;
    SELECT rooms.price FROM reservations
    INNER JOIN rooms
    ON reservations.id_room = rooms.id
    WHERE reservations.id = id_reservation
    INTO price_;

    IF price_ IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "no such reservation";
    end if;
    return price_;
END;

