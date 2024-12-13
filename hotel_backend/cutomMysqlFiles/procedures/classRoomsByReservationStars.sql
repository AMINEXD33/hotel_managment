DROP PROCEDURE IF EXISTS classRoomsByReservationStars;
CREATE PROCEDURE classRoomsByReservationStars(IN hotel INT)
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
    AVG(s1.room_stars) as `avg room starts`,
    id_room `room`,
    count(s1.id) `reservations`
FROM s1
    INNER JOIN rooms
ON rooms.id = s1.id_room
WHERE id_hotel = hotel
GROUP BY id_room
ORDER BY AVG(room_stars) ;
end;
# call classRoomsByReservationStars(1);
