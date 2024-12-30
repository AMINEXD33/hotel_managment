export var base = "https://localhost/api";
export var base2 = "https://localhost/sanctum/csrf-cookie";
export var photobase = "https://localhost/storage/";
export var PAYPALCLIENT = "AVHXZ8YVd9JjOuhOrGDuNeWqV7SU5OXO3kADXbkjsSyBVPZsG5WnffbSuqtZzFc8dpUbhhSLNTcnKL6u";


export function API_paypalCreateOrder(){
    return (base.concat("/paypal/create-order"));
}
export function API_paypalCaptureOrder(){
    return (base.concat("/paypal/capture-order"));
}




export function API_checkauth (){
    return (base.concat("/checkauth"));
}

export function API_login(){
    return (base.concat("/login"));
}
export function API_logout(){
    return (base.concat("/logout"));
}

export function API_csrf(){
    return (base2)
}

export function API_register(){
    return (base.concat("/register"));
}

export function API_RankHotelsByReservationCount(){
    return(base.concat("/classedHotelsByReservationsCount"));
}

export function rankHotelsByReservationRating(){
    return(base.concat("/classedHotelsByReservationsRating"));
}

export function API_classedRoomsByReservationsCount(){
    return(base.concat("/classedRoomsByReservationsCount"));
}

export function API_classedRoomsByReservationsRatings(){
    return(base.concat("/classedRoomsByReservationsRating"));
}

export function API_reservationCountByYear(){
    return(base.concat("/reservationsCountByYear"));
}

export function API_reservationsCountByMonth(){
    return(base.concat("/reservationsCountByMonth"));
}

export function API_generateAnaliticsYearlyRevenues(){
    return(base.concat("/generateAnaliticsYearlyRevenues"));
}
export function API_generateAnaliticsMonthlyRevenues(){
    return(base.concat("/generateAnaliticsMounthlyRevenues"));
}


export function API_availableYears(){
    return(base.concat("/getAvailableYears"));
}



export function API_getHotelsLite(){
    return(base.concat("/getAllHotelsLite"));
}


///// 

export function API_getHotels(){
    return(base.concat("/getAllHotels"));
}

export function API_getHotelsByName(){
    return(base.concat("/getHotelByName"));
}

export function API_getHotelsById(){
    return(base.concat("/getHotelById"));
}

export function API_getHotelsByCity(){
    return(base.concat("/getHotelsByCity"));
}

export function API_getCities(){
    return (base.concat("/getAllCities"));
}


export function API_modifyHotel(){
    return (base.concat("/modifyHotel"));
}

export function API_deleteHotelPhotoId(){
    return (base.concat("/deleteHotelPhotoById"));
}

export function API_deleteHotelById(){
    return (base.concat("/deleteHotel"));
}

export function API_createHotel(){
    return (base.concat("/createHotel"));
}

export function API_getAllRooms(){
    return (base.concat("/getAllRooms"));
}

export function API_modifyRoom(){
    return (base.concat("/updateRoom"))
}

export function API_getRoomPhotosById(){
    return (base.concat("/getRoomPhotosById"));
}

export function API_deleteRoomPhotoById(){
    return (base.concat("/deleteRoomPhotoById"));
}

export function API_deleteRoomById(){
    return (base.concat("/deleteRoom"));
}

export function API_createRoom(){
    return (base.concat("/createRoom"));
}

export function API_getReservations(){
    return(base.concat("/getAllReservations"));
}

export function API_CalcellReservation(){
    return(base.concat("/cancelReservationAdmin"));
}

export function API_getRoomsUser(){
    return(base.concat("/getRoomsUser"));
}