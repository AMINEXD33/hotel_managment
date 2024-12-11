var base = "http://127.0.0.1:8000/api";
var base2 = "http://127.0.0.1:8000";


export function API_checkauth (){
    return (base.concat("/checkauth"));
}

export function API_login(){
    return (base.concat("/login"));
}

export function API_csrf(){
    return (base2.concat("/sanctum/csrf-cookie"))
}