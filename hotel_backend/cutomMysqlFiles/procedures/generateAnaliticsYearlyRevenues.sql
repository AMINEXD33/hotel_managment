DROP PROCEDURE IF EXISTS generateAnaliticsYearlyRevenues;
CREATE PROCEDURE generateAnaliticsYearlyRevenues()

BEGIN
    WITH query1 AS (
    SELECT
        YEAR(reservations.check_in) as `year`,
        COUNT(reservations.id) as `year_total_reservation_count`,
        SUM(rooms.price) as `year_total_revenue`
    FROM reservations
    INNER JOIN  rooms
    ON rooms.id = reservations.id_room
    GROUP BY YEAR(reservations.check_in)
    ),
    query2 AS (
        SELECT
        YEAR(historique_reservations.check_in) as `year`,
        COUNT(historique_reservations.id) as `year_total_reservation_count`,
        SUM(rooms.price) as `year_total_revenue`
        FROM historique_reservations
        INNER JOIN rooms
        ON rooms.id = historique_reservations.id_room
        GROUP BY YEAR(historique_reservations.check_in)
    )

    select
        tb1.year as `year`,
        SUM(tb1.year_total_reservation_count) as `year_total_reservation_count`,
        SUM(tb1.year_total_revenue) as `year_total_revenue`
        FROM
            (
                SELECT * FROM query1
                UNION ALL
                SELECT * FROM query2
            ) as tb1
         group by tb1.year;
end;
