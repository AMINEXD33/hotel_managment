DROP FUNCTION IF EXISTS returnTotalOfReservationsByMonth;
CREATE FUNCTION returnTotalOfReservationsByMonth (month_ INT)
RETURNS FLOAT DETERMINISTIC
BEGIN
    DECLARE total_ FLOAT DEFAULT  0.00;
    SELECT SUM(price) FROM (
        SELECT id_customer, id_room, check_in FROM reservations
        UNION ALL
        SELECT id_customer, id_room, check_in FROM historique_reservations
    ) as tb1
    INNER JOIN rooms
    ON tb1.id_room = rooms.id
    WHERE  MONTH(tb1.check_in) = month_
    INTO total_;
    return total_;
END;



