DROP PROCEDURE  IF EXISTS allActiveReservationsInHotel;
CREATE PROCEDURE  allActiveReservationsInHotel(IN id_hotel_ INT)
BEGIN
    DECLARE id_hotel INT;
    SELECT * FROM rooms
    INNER JOIN reservations
    ON  reservations.id_room = rooms.id
    where rooms.id_hotel = id_hotel_;
END;
