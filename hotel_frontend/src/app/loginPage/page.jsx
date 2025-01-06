"use client";

import { useEffect, useRef, useState } from "react";
import "./loginPage.css";
import Image from "next/image";
import adminIcon from "./imgs/adminicon.png";
import userIcon from "./imgs/user.png";
import facebook from "./imgs/facebook.png";
import instagram from "./imgs/instagram.png";
import Link from "next/link";
import {API_login} from "../../../endpoints/endpoints";
import {API_csrf} from "../../../endpoints/endpoints";
import { useRouter } from 'next/navigation';


function goToDashboard(router, role){
    console.warn("here");
    if (role === "admin"){
        console.warn("go to admin dashboard");
        router.push("/adminDashboard");
    }else if(role === "user"){
        console.warn("go to user dashboard");
        router.push("/userDashboard/brows");
    }else{
        console.warn("wtf this is the role i got ", role);
    }
}

function loginPagelogin(
    formData, 
    setErrorAlertState, 
    setSuccessAlertState, 
    loginLock, 
    setLoginLock,
    router
){
    if (loginLock){
        return;
    }
    fetch(API_csrf(), {
        method: 'GET',
        credentials: 'include',
    })
    .then(() => {
        console.log("ooko");
    })
    .catch(err=>{
        console.warn(err);
    })

    console.log("data = >", formData);
    setLoginLock(true);
    setTimeout(()=>{
        fetch(API_login(), {
            method:"POST",
            body: JSON.stringify({
                "email": formData.email,
                "password": formData.password,
            }),
            headers: {
                'Content-Type': 'application/json',
              },
            credentials: 'include',
        })
        .then(headers=> headers)
        .then(async (response)=>{
            if (response.status === 200){
                setSuccessAlertState({state:true, message:"you're loggedin"});
                console.warn("we're in");
                let data = await response.json();
                console.warn(data);
                let role = data.role;
                goToDashboard(router, role);
            }
            else{
                setErrorAlertState({state:true, message:"wrong credentials !"});
    
            }
        })
        .catch((err)=>{
            console.log(err);
            setErrorAlertState({state:true, message:"wrong credentials !"});
    
        })
        .finally(()=>{
            setLoginLock(false)
            const tm = setTimeout(()=>{
                setSuccessAlertState({state:false, message:""});
                setErrorAlertState({state:false, message:""});
                clearTimeout(tm);
            }, 2000);
    
    
        })
    }, 200);
    
    
    
}

export default function LoginPage()
{
    const [formData, setFormData] = useState({
        "email": "",
        "password": ""
    });
    const [errorAlertState, setErrorAlertState] = useState({
        state: false,
        message:""
    });
    const [successAlertState, setSuccessAlertState] = useState({
        state: false,
        message:""
    });
    const [loginLock, setLoginLock] = useState(false);
    useEffect(()=>{
        console.log("error >"+errorAlertState);
        console.log("success >"+successAlertState);
    }, [errorAlertState, successAlertState]);
    const router = useRouter();
    return (
        <div className="container-fluid loginPage_maincontainer">
            {  
                errorAlertState.state ? 
                <div className="alert alert-danger alert" role="alert">
                {errorAlertState.message}
                </div>
                :null
            }
            {
                successAlertState.state ?
                <div className="alert alert-success alert" role="alert">
                {successAlertState.message}
                </div>
                :null
            }

            <div className="container-lg loginPage_midcontainer">
                <div className="loginPage_mask living_room_photo">
                    <div className="filter">
                        <div className="loginPage_header">
                            <h1>LOGIN</h1>
                        </div>
                        <div className="loginPage_socials">
                            <a className="loginPage_social1" href="https://www.facebook.com">
                                <Image
                                    src={facebook}
                                    width={40}
                                    height={40}
                                    alt="facebook icon"
                                />
                            </a>

                            <a className="loginPage_social1" href="https://www.instagram.com">
                                <Image
                                    src={instagram}
                                    width={40}
                                    height={40}
                                    alt="instagram icon"
                                />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="loginPage_loginform">
                <div className="form-floating mb-3">
                    <input 
                    onChange={(e)=>{setFormData({...formData, "email":e.target.value})}}
                    type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
                    <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating">
                    <input 
                    onChange={(e)=>{setFormData({...formData, "password":e.target.value})}}
                    type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
                    <label htmlFor="floatingPassword">Password</label>
                    </div>

                    {
                        loginLock==false?
                        <button 
                        type="button" 
                        className="btn btn-success loginpage_success"
                        onClick={()=>{
                            loginPagelogin(
                                formData, 
                                setErrorAlertState, 
                                setSuccessAlertState, 
                                loginLock, 
                                setLoginLock,
                                router
                            )}}
                        >login</button>
                        :
                        <div className="spinner-border text-success spinnedS" role="status">
                        <span className="visually-hidden">Loading...</span>
                        </div>
                    }
                    <div className="havanaccount">
                        <p>you don't have an account yet ? create one <a  href={"/registerPage"} id="registerlink">here</a></p>
                        
                    </div>
                
                </div>
            </div>
        </div>
    )
}