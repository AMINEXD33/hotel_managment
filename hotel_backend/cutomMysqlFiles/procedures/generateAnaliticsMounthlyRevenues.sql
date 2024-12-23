DROP PROCEDURE IF EXISTS generateAnaliticsMounthlyRevenues;


CREATE PROCEDURE generateAnaliticsMounthlyRevenues(IN HOTEL_ INT, IN YEAR_ INT)
BEGIN
    with s1 as (
        SELECT
            reservations.id as `reservation_id`,
            reservations.id_room,
            id_customer,
            check_in,
            check_out,
            check_out_note,
            check_in_note,
            room_stars,
            hotel_stars,
            total_price
        FROM reservations
                 INNER JOIN  rooms ON rooms.id = reservations.id_room
        WHERE id_hotel = HOTEL_ AND YEAR(check_in) = YEAR_
        UNION ALL
        SELECT
            historique_reservations.id as `reservation_id`,
            historique_reservations.id_room,
            id_customer,
            check_in,
            check_out,
            check_out_note,
            check_in_note,
            room_stars,
            hotel_stars,
            total_price
        FROM historique_reservations
        INNER JOIN  rooms ON rooms.id = historique_reservations.id_room
        WHERE id_hotel = HOTEL_ AND YEAR(check_in) = YEAR_
    ),
         calendar AS (
             SELECT 1 AS month UNION ALL
             SELECT 2 UNION ALL
             SELECT 3 UNION ALL
             SELECT 4 UNION ALL
             SELECT 5 UNION ALL
             SELECT 6 UNION ALL
             SELECT 7 UNION ALL
             SELECT 8 UNION ALL
             SELECT 9 UNION ALL
             SELECT 10 UNION ALL
             SELECT 11 UNION ALL
             SELECT 12
         )
    SELECT
        calendar.month,
        IFNULL(CAST(SUM(s1.total_price) AS DOUBLE(10, 2)), 0) `revenue`
    FROM calendar
             LEFT JOIN s1
                       ON MONTH(s1.check_in) = calendar.month
    GROUP BY calendar.month
    ORDER BY calendar.month;
END;






