DROP PROCEDURE IF EXISTS generateAnaliticsYearlyRevenues;
CREATE PROCEDURE generateAnaliticsYearlyRevenues(IN YEAR_ INT)

BEGIN
    if YEAR_ is NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "no year is specfied";
    end if;

    with s1 as (
        SELECT * FROM reservations
        UNION ALL
        SELECT  * FROM historique_reservations
    )
    SELECT
        hotels.name,
        YEAR(s1.check_in) as `year`,
        id_hotel `hotel`,
        CAST(SUM(s1.total_price) AS DOUBLE(10, 2)) `revenue`
    FROM s1
             INNER JOIN rooms
                        ON rooms.id = s1.id_room
             INNER JOIN hotels
                        ON hotels.id = rooms.id_hotel
    WHERE YEAR(s1.check_in) = YEAR_
    GROUP BY YEAR(s1.check_in), id_hotel, hotels.name
    ORDER BY YEAR(s1.check_in) ;
end;

