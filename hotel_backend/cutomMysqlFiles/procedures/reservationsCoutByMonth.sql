DROP PROCEDURE IF EXISTS reservationsCountByMonth;
CREATE PROCEDURE reservationsCountByMonth(IN HOTEL_ INT, IN YEAR_ INT)
begin
    IF YEAR_ is NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "no year is specfied";
    ELSEIF HOTEL_ is NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "no hotel is specfied";
    END IF;

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
        IFNULL(count(s1.reservation_id), 0) `reservations`
    FROM calendar
    LEFT JOIN s1
        ON MONTH(s1.check_in) = calendar.month
    GROUP BY calendar.month
    ORDER BY calendar.month;
end ;

# CALL reservationsCountByYear(1, 2024);
