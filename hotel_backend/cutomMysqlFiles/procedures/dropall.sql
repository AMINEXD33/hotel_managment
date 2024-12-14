drop procedure IF EXISTS addReservation;
drop procedure IF EXISTS deleteReservation;
drop procedure IF EXISTS generateGeneralAnalitics;
drop procedure IF EXISTS generateAnaliticsYearlyRevenues;
drop procedure IF EXISTS generateAnaliticsMounthlyRevenues;


drop procedure IF EXISTS allActiveReservationsInHotel;
drop procedure IF EXISTS allOldReservationsInHotel;

drop procedure IF EXISTS allReservationsWithCheckInAfter;
drop procedure IF EXISTS allReservationsWithCheckInBefore;
drop procedure IF EXISTS allReservationsWIthCkeckInBetween;


drop procedure IF EXISTS allReservationsWithCheckOutAfter;
drop procedure IF EXISTS allReservationsWithCheckOutBefore;
drop procedure IF EXISTS allReservationsWithCheckOutBetween;


drop procedure  IF EXISTS classHotelsByReservationsRatings;
drop procedure  IF EXISTS classHotelsByReservationsCount;
drop procedure  IF EXISTS classRoomsByReservationCount;
drop procedure  IF EXISTS classRoomsByReservationStars;
drop procedure  IF EXISTS reservationsCoutByMonth;
drop procedure  IF EXISTS reservationsCountByYear;


drop procedure  IF EXISTS getAvailableYears;