DROP PROCEDURE  IF EXISTS deleteReservation;
CREATE PROCEDURE deleteReservation (IN reservationId INT)
BEGIN
    DELETE FROM reservations WHERE reservations.id = reservationId;
END ;

# CALL deleteReservation(1);
