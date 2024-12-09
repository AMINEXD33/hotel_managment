DROP PROCEDURE IF EXISTS allReservationsWithCheckOutAfter;
CREATE PROCEDURE  allReservationsWithCheckOutAfter(IN hotel INT, IN someDate DATE)
BEGIN
    IF someDate IS NULL THEN
SELECT NULL;-- NO NEED to raise any errors simpy there is nothing after nothing :)
end if;

WITH allReservations AS (
    SELECT *, 'alive' as 'status' FROM reservations
    UNION ALL
    SELECT  *, 'old' as 'status' FROM historique_reservations

)
SELECT * FROM allReservations
                  INNER JOIN rooms
                             ON rooms.id = allReservations.id_room
WHERE check_out > someDate AND id_hotel = hotel;
END;

call allReservationsWithCheckOutAfter(1, "2024-12-00");