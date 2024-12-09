DROP PROCEDURE  IF EXISTS allOldReservationsInHotel;
CREATE PROCEDURE  allOldReservationsInHotel(IN id_hotel_ INT)
BEGIN
    DECLARE id_hotel INT;
SELECT * FROM rooms
    INNER JOIN historique_reservations
    ON  historique_reservations.id_room = rooms.id
where rooms.id_hotel = id_hotel_;
END;


