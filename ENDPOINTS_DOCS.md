# Endpoints documentation

## Reservations
### **api/hotelAliveReservation**
#### An endpoint to get alive reservations , note that an alive reservation means a still ongoing one.

*need to be loggedin*
- yes

*Authority*
- admins only

*Input expected*
- hotel_id : the id of the target hotel

- *expected return*
- 200 ['reservations':[{reservation1},{reservation2}....]] : if they exist
- 200 [] : if they don't exist

- *unexpected return*
- 422 ["error": "no hotel_id was specified"] : if no id was provided
- 500 ["error":"the query is not right"] : if you passed some unholly params that i didn't think off
- 400 ["permission_error":"You don't have permission to take this action"]: you're not logged in as an admin 
### **api/hotelOldReservation**
#### An endpoint to get old reservations , note that an old reservation means an expired reservation.

*need to be loggedin*
- yes

*Authority*
- admins only

*Input expected*
- hotel_id : the id of the target hotel

*expected return*
- 200 ['reservations':[{reservation1},{reservation2}....]] : if they exist
- 200 [] : if they don't exist

*unexpected return*
- 422 ["error": "no hotel_id was specified"] : if no id was provided
- 500 ["error":"the query is not right"] : if you passed some unholly params that i didn't think off
- 400 ["permission_error":"You don't have permission to take this action"]: you're not logged in as an admin 

### **api/hotelReservationsCheckinAfter**
#### An endpoint to get reservations that have a checkin  date that comes after a specified date.

*need to be loggedin*
- yes

*Authority*
- admins only

*Input expected*
- hotel_id : the id of the target hotel
- after : date

*expected return*
- 200 ['reservations':[{reservation1},{reservation2}....]] : if they exist
- 200 [] : if they don't exist

*unexpected return*
- 422 ["error": "no hotel_id was specified"] : if no id was provided
- 500 ["error":"the query is not right"] : if you passed some unholly params that i didn't think off
- 400 ["permission_error":"You don't have permission to take this action"]: you're not logged in as an admin 

NOTE : no further errors should pop up since the mysql is handling the if the dates needed are not passed



### **api/hotelReservationsCheckinBefore**
#### An endpoint to get reservations that have a checkin  date that comes before a specified date.

*need to be loggedin*
- yes

*Authority*
- admins only

*Input expected*
- hotel_id : the id of the target hotel
- before : date

*expected return*
- 200 ['reservations':[{reservation1},{reservation2}....]] : if they exist
- 200 [] : if they don't exist

*unexpected return*
- 422 ["error": "no hotel_id was specified"] : if no id was provided
- 500 ["error":"the query is not right"] : if you passed some unholly params that i didn't think off
- 400 ["permission_error":"You don't have permission to take this action"]: you're not logged in as an admin 

NOTE : no further errors should pop up since the mysql is handling the if the dates needed are not passed

### **api/hotelReservationsCheckinBetween**
#### An endpoint to get reservations with a checkin date that comes between two dates just like an interval [x1, x2]

*need to be loggedin*
- yes

*Authority*
- admins only

*Input expected*
- hotel_id : the id of the target hotel
- left : the date at the left of the interval
- right : the date at the right of the interval

*expected return*
- 200 ['reservations':[{reservation1},{reservation2}....]] : if they exist
- 200 [] : if they don't exist

*unexpected return*
- 422 ["error": "no hotel_id was specified"] : if no id was provided
- 500 ["error":"the query is not right"] : if you passed some unholly params that i didn't think off
- 400 ["permission_error":"You don't have permission to take this action"]: you're not logged in as an admin 

NOTE : no further errors should pop up since the mysql is handling the if the dates needed are not passed


### **api/hotelReservationsCheckoutAfter**
#### An endpoint to get reservations that have a checkout  date that comes after a specified date.

*need to be loggedin*
- yes

*Authority*
- admins only

*Input expected*
- hotel_id : the id of the target hotel
- after : date

*expected return*
- 200 ['reservations':[{reservation1},{reservation2}....]] : if they exist
- 200 [] : if they don't exist

*unexpected return*
- 422 ["error": "no hotel_id was specified"] : if no id was provided
- 500 ["error":"the query is not right"] : if you passed some unholly params that i didn't think off
- 400 ["permission_error":"You don't have permission to take this action"]: you're not logged in as an admin 

NOTE : no further errors should pop up since the mysql is handling the if the dates needed are not passed



### **api/hotelReservationsCheckoutBefore**
#### An endpoint to get reservations that have a checkout  date that comes before a specified date.

*need to be loggedin*
- yes

*Authority*
- admins only

*Input expected*
- hotel_id : the id of the target hotel
- before : date

*expected return*
- 200 ['reservations':[{reservation1},{reservation2}....]] : if they exist
- 200 [] : if they don't exist

*unexpected return*
- 422 ["error": "no hotel_id was specified"] : if no id was provided
- 500 ["error":"the query is not right"] : if you passed some unholly params that i didn't think off
- 400 ["permission_error":"You don't have permission to take this action"]: you're not logged in as an admin 

NOTE : no further errors should pop up since the mysql is handling the if the dates needed are not passed

### **api/hotelReservationsCheckoutBetween**
#### An endpoint to get reservations with a checkout date that comes between two dates just like an interval [x1, x2]

*need to be loggedin*
- yes

*Authority*
- admins only

*Input expected*
- hotel_id : the id of the target hotel
- left : the date at the left of the interval
- right : the date at the right of the interval

*expected return*
- 200 ['reservations':[{reservation1},{reservation2}....]] : if they exist
- 200 [] : if they don't exist

*unexpected return*
- 422 ["error": "no hotel_id was specified"] : if no id was provided
- 500 ["error":"the query is not right"] : if you passed some unholly params that i didn't think off
- 400 ["permission_error":"You don't have permission to take this action"]: you're not logged in as an admin 

NOTE : no further errors should pop up since the mysql is handling the if the dates needed are not passed
