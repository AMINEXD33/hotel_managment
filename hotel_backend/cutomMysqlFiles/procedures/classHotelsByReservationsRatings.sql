DROP PROCEDURE  IF EXISTS classHotelsByReservationsRatings;
CREATE PROCEDURE  classHotelsByReservationsRatings ()
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
    AVG(S1.hotel_stars) as `rating`
FROM S1
         INNER JOIN  rooms
                     ON rooms.id = S1.id_room
         INNER JOIN  hotels
                     on rooms.id_hotel = hotels.id
GROUP BY id_hotel, hotels.name,  hotels.address
ORDER BY rating;
END;

# CALL classHotelsByReservationsRatings();
