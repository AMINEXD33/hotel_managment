DROP PROCEDURE IF EXISTS reservationsCoutByMonth;
CREATE PROCEDURE reservationsCoutByMonth(IN hotel INT)
begin
    if hotel is NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "no hotel was specfied";
end if;

with s1 as (
    SELECT * FROM reservations
    UNION ALL
    SELECT  * FROM historique_reservations
)
SELECT
    MONTH(s1.check_in) as `month`,
    id_hotel `hotel`,
    count(s1.id) `reservations`
FROM s1
    INNER JOIN rooms
ON rooms.id = s1.id_room
WHERE id_hotel = hotel
GROUP BY MONTH(s1.check_in)
ORDER BY MONTH(s1.check_in) ;
end;
# call reservationsCoutByMonth(2);
