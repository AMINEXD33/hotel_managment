"use client";

import { useEffect, useRef, useState } from "react";
import "./registerPage.css";
import Image from "next/image";
import facebook from "../loginPage/imgs/facebook.png";
import instagram from "../loginPage/imgs/instagram.png";
import Link from "next/link";
import { API_register } from "../../../endpoints/endpoints";
import { API_csrf } from "../../../endpoints/endpoints";
import { useRouter } from "next/navigation";
import { fail } from "assert";

function goToDashboard(router) {
  router.push("/loginPage");
}

function registerPageregister(
  formData,
  setErrorAlertState,
  setSuccessAlertState,
  loginLock,
  setLoginLock,
  router
) {
  if (loginLock) {
    return;
  }
  console.log("data = >", formData);
  setLoginLock(true);
  setTimeout(() => {
    fetch(API_register(), {
      method: "POST",
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((headers) => headers)
      .then(async (response) => {
        if (response.status === 200) {
          
          console.warn("we're in");
          let data = await response.json();
          console.warn(data);
          setSuccessAlertState({ state: true, message: "you've been registered, congrats! you're getting redirected to login" });
          let st = setTimeout(()=>{
            goToDashboard(router);
            clearTimeout(st);
          }, 2000);
        } else if(response.status === 400){
          let data = await response.json();
          setErrorAlertState({ state: true, message: data.error });
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorAlertState({ state: true, message: "wrong credentials !" });
      })
      .finally(() => {
        setLoginLock(false);
        const tm = setTimeout(() => {
          setSuccessAlertState({ state: false, message: "" });
          setErrorAlertState({ state: false, message: "" });
          clearTimeout(tm);
        }, 2000);
      });
  }, 200);
}

function passwordChecker(
    stateBulck, 
    password, 
    validatepassword,
    setButtonState
){
    // check passwords match
    console.log("here");
    if (password === validatepassword 
        && password !== "" && validatepassword !== ""){
        stateBulck.check1.setter(true);

    }else{
        stateBulck.check1.setter(false);

    }

    if (password.length >= 8 
        && validatepassword.length >= 8){
        stateBulck.check2.setter(true);
        console.log("here >= 8");
    }else{
        stateBulck.check2.setter(false);
    }

    if (/[0-9]{1,}/.test(password)
         && /[0-9]{1,}/.test(validatepassword)){
        stateBulck.check3.setter(true);
        console.log("passwords have number");
    }else{
        stateBulck.check3.setter(false);
    }

    if (/[.,\/#!$%\^&\*;:{}=\-_`~()]{1,}/.test(password) 
        && /[.,\/#!$%\^&\*;:{}=\-_`~()]{1,}/.test(validatepassword)) {
        stateBulck.check4.setter(true);
        console.log("passwords have symboles");
    }else{
        stateBulck.check4.setter(false);
    }
}
function onSubmitCheck(formData, setErrorAlertState){
    let flag = true;
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)){
        flag = false;
        setErrorAlertState({ state: false, message: "the email is not valid"});
    }
    else if(formData.firstname.trim().lenght <= 0 || formData.lastname.trim().lenght <= 0){
        flag = false;
        setErrorAlertState({ state: false, message: "firstname and lastname must be provided"});
    }
}
function everyCheckisTrue(stateBulck, setButtonState){

    if (stateBulck.check1.getter
        && stateBulck.check2.getter
        && stateBulck.check3.getter
        && stateBulck.check4.getter
    ){
        console.log("everything is true");
        setButtonState(false);
    }
    else{
        console.log("something is not true");
        setButtonState(true);
    }
}
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    validatepassword: ""
  });
  const [errorAlertState, setErrorAlertState] = useState({
    state: false,
    message: "",
  });
  const [successAlertState, setSuccessAlertState] = useState({
    state: false,
    message: "",
  });
  const [loginLock, setLoginLock] = useState(false);

  const [checks1, setChecks1] = useState(false);
  const [checks2, setChecks2] = useState(false);
  const [checks3, setChecks3] = useState(false);
  const [checks4, setChecks4] = useState(false);

  const stateBulck = {
    "check1" : {"getter": checks1, "setter": setChecks1},
    "check2" : {"getter": checks2, "setter": setChecks2},
    "check3" : {"getter": checks3, "setter": setChecks3},
    "check4" : {"getter": checks4, "setter": setChecks4},
  }
  const [buttonState, setButtonState] = useState(true);
  const router = useRouter();

  useEffect(()=>{
    everyCheckisTrue(stateBulck, setButtonState);
  }, [buttonState, checks1, checks2, checks3, checks4])

  return (
    <div className="container-fluid loginPage_maincontainer">
      {errorAlertState.state ? (
        <div className="alert alert-danger alert" role="alert">
          {errorAlertState.message}
        </div>
      ) : null}
      {successAlertState.state ? (
        <div className="alert alert-success alert" role="alert">
          {successAlertState.message}
        </div>
      ) : null}

      <div className="container-lg loginPage_midcontainer">
        <div className="loginPage_mask living_room_photo">
          <div className="filter">
            <div className="loginPage_header">
              <h1>REGISTER</h1>
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
          <div className="form-floating mb-3" style={{display:"flex", flexDirection:"column",gap:"10px"}}>
            <div className="form-floating">
              <input
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                }}
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>

            <div className="form-floating">
              <input
                onChange={(e) => {
                  setFormData({ ...formData, firstname: e.target.value });
                }}
                type="text"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">first name</label>
            </div>

            <div className="form-floating">
              <input
                onChange={(e) => {
                  setFormData({ ...formData, lastname: e.target.value });
                }}
                type="text"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">lastname</label>
            </div>

            <div className="form-floating">
              <input
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  passwordChecker(stateBulck , e.target.value, formData.validatepassword, setButtonState);
                }}
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <div className="form-floating">
              <input
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    validatepassword: e.target.value,
                  });
                  passwordChecker(stateBulck, formData.password, e.target.value, setButtonState);
                }}
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">validate password</label>
            </div>
            <div className="checkerBox">
                <p className={checks1==true?"ver":"notver"}>*passwords are the same</p>
                <p className={checks2==true?"ver":"notver"}>*password must have more or 8 characters</p>
                <p className={checks3==true?"ver":"notver"}>*password must have numberes</p>
                <p className={checks4==true?"ver":"notver"}>*password must have some sort of symbole !?#$%^&....</p>
            </div>
            {loginLock == false ? (
              <button
                type="button"
                className="btn btn-success loginpage_success"
                disabled={buttonState}
                onClick={() => {
                    registerPageregister(
                    formData,
                    setErrorAlertState,
                    setSuccessAlertState,
                    loginLock,
                    setLoginLock,
                    router
                  );
                }}
                
              >
                register
              </button>
            ) : (
              <div
                className="spinner-border text-success spinnedS"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            <div className="havanaccount">
              <p>
                you already have an account ? login {" "}
                <Link href={"/loginPage"} id="registerlink">
                  here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
