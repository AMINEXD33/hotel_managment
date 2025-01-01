import { NextResponse } from 'next/server'
import { API_checkauth } from "../endpoints/endpoints";

/**
 * check if the user is authenticated
 * @returns true if the user is authenticated , false if not so
 */
async function checkAuth(token){
  let fetchdata = await fetch(API_checkauth(), {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'cookie': `laravel_session=${token}`,
    },
    credentials: 'include',
  });
  if (!fetchdata.ok){
    return false;
  }
  else{
    let data = await fetchdata.json();
    
    return true;
  }
}

/**
 * this middleware will redirect any unauthenticated user to
 * the login page, ofc only the configured paths
 * @param {*} request request object
 * @returns 
 */
export async function middleware(request) {
  const AuthToken = request.cookies.get('laravel_session')?.value;
  if (!AuthToken){
    return NextResponse.redirect(new URL('/loginPage', request.url));
  }
  let imAuthed = await checkAuth(AuthToken);
  console.log("im authed ?? == > ", imAuthed);
  // check if we're logedin
  if (imAuthed){
    return NextResponse.next();
  }else{
    console.log("you are not allowed");
    return NextResponse.redirect(new URL('/loginPage', request.url));
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/about/:path*', 
    "/adminDashboard/:path*", 
    "/userDashboard/:path*",
    '/test/:path*'
  ]
}