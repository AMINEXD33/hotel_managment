DROP PROCEDURE IF EXISTS allReservationsWithCheckOutBetween;
CREATE PROCEDURE  allReservationsWithCheckOutBetween(IN hotel INT, IN someDate1 DATE, IN someDate2 DATE)
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
WHERE (someDate1 <= check_out AND  check_out <= someDate2) AND id_hotel = hotel;
END;

# call allReservationsWithCheckOutBetween(1, '2024-09-01', '2024-12-11');
# call allReservationsWithCheckInBetween(1, '2024-11-01', '2024-12-11');
