import { NextResponse } from 'next/server'
import { API_checkauth } from "../endpoints/endpoints";

/**
 * check if the user is authenticated
 * @returns true if the user is authenticated , false if not so
 */
function checkAuth(){
  let response = false;
  fetch(API_checkauth(), {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  .then(headers=>headers)
  .then(request=>()=>{
    if(request.status === 200){
      response = true;
    }
  })
  return response;
}

/**
 * this middleware will redirect any unauthenticated user to
 * the login page, ofc only the configured paths
 * @param {*} request request object
 * @returns 
 */
export function middleware(request) {
  // check if we're logedin
  if (checkAuth()){
    return NextResponse.next();
  }else{
    return NextResponse.redirect(new URL('/loginPage', request.url));
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/about/:path*',
}