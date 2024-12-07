DROP PROCEDURE IF EXISTS generateGeneralAnalitics;
CREATE PROCEDURE generateGeneralAnalitics()
BEGIN
    SELECT
        COUNT(tb1.id),
        SUM(price)
    FROM
    (
        SELECT * FROM reservations
        UNION ALL
        SELECT  * FROM historique_reservations
    ) as tb1
    INNER JOIN rooms
    ON rooms.id = id_room;
END ;

CALL generateGeneralAnalitics();