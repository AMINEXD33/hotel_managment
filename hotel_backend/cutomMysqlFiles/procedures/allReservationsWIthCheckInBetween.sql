DROP PROCEDURE IF EXISTS allReservationsWIthCheckInBetween;
CREATE PROCEDURE  allReservationsWIthCheckInBetween(IN hotel INT, IN someDate1 DATE, IN someDate2 DATE)
BEGIN
    IF someDate1 IS NULL  OR  someDate2 IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "one param is not a date";
    end if;
    WITH allReservations AS (
        SELECT *, 'alive' as 'status' FROM reservations
        UNION ALL
        SELECT  *, 'old' as 'status' FROM historique_reservations

)
SELECT * FROM allReservations
                  INNER JOIN rooms
                             ON rooms.id = allReservations.id_room
WHERE someDate1 <= check_in AND  check_in <= someDate2 AND id_hotel = hotel;
END;
