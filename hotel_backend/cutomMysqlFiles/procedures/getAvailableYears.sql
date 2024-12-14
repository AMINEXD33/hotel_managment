DROP PROCEDURE IF EXISTS  getAvailableYears;
CREATE PROCEDURE  getAvailableYears ()
BEGIN
    WITH s1 as (
        SELECT  * FROM reservations
        UNION ALL
        SELECT  * FROM historique_reservations
    )
    SELECT YEAR(s1.check_in) as `year` FROM s1
    GROUP BY  YEAR(s1.check_in)
    ORDER BY YEAR(s1.check_in);
end;
