DROP PROCEDURE IF EXISTS allReservationsWithCheckOutBetween;
CREATE PROCEDURE  allReservationsWithCheckOutBetween(IN hotel INT, IN someDate1 DATE, IN someDate2 DATE)
BEGIN
    DECLARE dateX1 date default  now();-- default to now in case nothing is passed
    DECLARE dateX2 date default  adddate(now(), INTERVAL 1 minute); -- default to 1 min in case nothing is passed

    IF someDate1 > someDate2 THEN
SELECT NULL; -- nothing because it doesn't resepect  date1 <= checkin <= date2
end if;
    SET dateX1 = COALESCE(someDate1, dateX1);
    SET dateX2 = COALESCE(someDate2, dateX2);
WITH allReservations AS (
    SELECT *, 'alive' as 'status' FROM reservations
    UNION ALL
    SELECT  *, 'old' as 'status' FROM historique_reservations

)
SELECT * FROM allReservations
                  INNER JOIN rooms
                             ON rooms.id = allReservations.id_room
WHERE (dateX1 <= check_out AND  check_out <= dateX2) AND id_hotel = hotel;
END;

call allReservationsWithCheckOutBetween(1, '2024-09-01', '2024-12-11');
call allReservationsWithCheckInBetween(1, '2024-11-01', '2024-12-11');