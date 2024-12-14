DROP PROCEDURE IF EXISTS addReservation;
CREATE PROCEDURE addReservation(
    IN pr_id_room INT,
    IN pr_id_customer INT,
    IN checkIn_date DATETIME,
    IN checkOut_date DATETIME ,
    IN checkIn_note TEXT,
    IN checkOut_note TEXT,
    IN room_stars_ double,
    IN hotel_starts_ double
)
BEGIN
    -- check if room and customer exist
    DECLARE is_room INT default NULL;
    DECLARE is_customer INT default NULL;
    DECLARE room_available BOOLEAN DEFAULT false;
    DECLARE totalPrice_ FLOAT4 DEFAULT 0;

    SELECT id FROM users WHERE users.id = pr_id_customer INTO is_customer;
    SELECT id, available FROM rooms WHERE rooms.id = pr_id_room INTO is_room, room_available;
    SELECT id, available FROM rooms WHERE rooms.id = pr_id_room;
    IF is_room IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "no room with such id";
    ELSEIF is_customer IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "no customer with such id";
    end if;

    IF room_available = false THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "the room is not available";
    end if;

    IF checkOut_date <= checkIn_date THEN
        SIGNAL  SQLSTATE '45000' SET MESSAGE_TEXT = "checkin and check out are not valid";
    end if;

    # calculate the totalPrice
    SELECT
        TIMESTAMPDIFF(HOUR, checkIn_date, checkOut_date) * price
    INTO
        totalPrice_
    FROM
        rooms
    WHERE
        rooms.id = pr_id_room;

    IF totalPrice_ <= 0 THEN
        SIGNAL  SQLSTATE '45000' SET MESSAGE_TEXT = "checkin and check out are not valid";
    end if;

    -- both customer and room are valid
    INSERT INTO reservations(
                             id_room,
                             id_customer,
                             check_in,
                             check_out,
                             check_out_note,
                             check_in_note,
                             room_stars,
                             total_price,
                             hotel_stars,
                             created_at
                            )
        VALUES (
                pr_id_room,
                pr_id_customer,
                checkIn_date,
                checkOut_date,
                checkOut_note,
                checkIn_note,
                room_stars_,
                totalPrice_,
                hotel_starts_,
                NOW()
               );
end;
-- CALL addReservation(
--     1,
--     1,
--     NOW(),
--     ADDDATE(NOW(), INTERVAL 2 DAY),
--     'DAMN',
--     'DAMN2',
--     3,
--     5
-- );
#
# CALL addReservation(
#     2,
#     2,
#     NOW(),
#     ADDDATE(NOW(), INTERVAL 2 DAY),
#     'DAMN',
#     'DAMN2',
#     3,
#     5
#      );
#
# CALL addReservation(
#     3,
#     1,
#     NOW(),
#     ADDDATE(NOW(), INTERVAL 2 DAY),
#     'DAMN',
#     'DAMN2',
#     3,
#     5
#      );
