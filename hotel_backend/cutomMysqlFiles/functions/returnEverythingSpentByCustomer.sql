DROP FUNCTION IF EXISTS returnEverythingSpentByCustomer;
CREATE FUNCTION returnEverythingSpentByCustomer (customer_id INT)
RETURNS FLOAT DETERMINISTIC
BEGIN
    DECLARE total_ FLOAT DEFAULT  0.00;
    SELECT SUM(price) FROM (
        SELECT id_customer, id_room FROM reservations
        UNION ALL
        SELECT id_customer, id_room FROM historique_reservations
    ) as tb1
    INNER JOIN rooms
    WHERE tb1.id_room = rooms.id
    INTO total_;
    return total_;
END;



