var base = "https://localhost/api";
var base2 = "https://localhost/sanctum/csrf-cookie";


export function API_checkauth (){
    return (base.concat("/checkauth"));
}

export function API_login(){
    return (base.concat("/login"));
}

export function API_csrf(){
    return (base2)
}

export function API_register(){
    return (base.concat("/register"));
}
