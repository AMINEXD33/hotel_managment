DROP PROCEDURE IF EXISTS generateAnaliticsMounthlyRevenues;


CREATE PROCEDURE generateAnaliticsMounthlyRevenues()
BEGIN
    WITH query1 AS
             (SELECT YEAR(reservations.check_in)  AS `year`,
                     MONTH(reservations.check_in) AS `month`,
                     COUNT(reservations.id)       AS `month_total_reservation_count`,
                     SUM(rooms.price)             AS `month_total_revenue`
              FROM reservations
                       INNER JOIN rooms ON rooms.id = reservations.id_room
              GROUP BY YEAR(reservations.check_in), MONTH(reservations.check_in)),
         query2 AS
             (SELECT YEAR(historique_reservations.check_in)  AS `year`,
                     MONTH(historique_reservations.check_in) AS `month`,
                     COUNT(historique_reservations.id)       AS `month_total_reservation_count`,
                     SUM(rooms.price)                        AS `month_total_revenue`
              FROM historique_reservations
                       INNER JOIN rooms ON rooms.id = historique_reservations.id_room
              GROUP BY YEAR(historique_reservations.check_in), MONTH(historique_reservations.check_in))
    SELECT tb1.year AS `year`,
           tb1.month AS `month`,
           SUM(tb1.month_total_reservation_count) AS `month_total_reservation_count`,
           SUM(tb1.month_total_revenue) AS `month_total_revenue`
    FROM (SELECT *
          FROM query1
          UNION ALL
          SELECT *
          FROM query2) AS tb1
    GROUP BY tb1.year,
             tb1.month;
END;

# CALL generateAnaliticsMounthlyRevenues();
