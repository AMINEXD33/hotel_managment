DROP FUNCTION IF EXISTS returnTotalOfActiveReservations;
CREATE FUNCTION returnTotalOfActiveReservations (customer_id INT)
RETURNS FLOAT DETERMINISTIC
BEGIN
    DECLARE total_ FLOAT DEFAULT  0.00;
    SELECT SUM(rooms.price) FROM reservations
    INNER JOIN rooms
    ON reservations.id_room = rooms.id
    WHERE customer_id = reservations.id_customer
    INTO total_;
    return total_;
END;
