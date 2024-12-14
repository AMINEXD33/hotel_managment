DROP PROCEDURE  IF EXISTS classHotelsByReservationsCount;
CREATE PROCEDURE  classHotelsByReservationsCount ()
BEGIN
    WITH S1 AS (
        SELECT  * FROM reservations
        UNION  ALL
        SELECT  * FROM historique_reservations
    )
    SELECT
        id_hotel,
        hotels.name,
        hotels.address,
        COUNT(S1.id) as `reservations`
    FROM S1
    INNER JOIN  rooms
    ON rooms.id = S1.id_room
    INNER JOIN  hotels
    on rooms.id_hotel = hotels.id
    GROUP BY id_hotel, hotels.name, hotels.address
    ORDER BY reservations;
END;
