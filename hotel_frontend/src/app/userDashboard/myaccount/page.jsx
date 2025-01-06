"use client";

import Footer from "@/app/global_components/footer/footer";
import SideBarNewUi from "@/app/global_components/sidebar/sidebarNewUi";
import "./page.css";
import TextField from "@mui/material/TextField";
import { Container } from "react-bootstrap";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { API_getClientData, API_modifyClient } from "../../../../endpoints/endpoints";
import Alert from '@mui/material/Alert';

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const passRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export default function MyAccount() {
  const [passwordError, setPasswordError] = useState({
    state: false,
    msg: "password is not a matche",
  });
  const [emailError, setEmailError] = useState({
    state: false,
    msg: "email is not a valid",
  });
  const [firstnameError, setFirstnameError] = useState({
    state: false,
    msg: "email is not a valid",
  });
  const [lastnameError, setLasttnameError] = useState({
    state: false,
    msg: "email is not a valid",
  });

  const [buttonState, setButtonState] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userid, setUserId] = useState();

  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let count = 0;
    if (firstName.length <= 0) {
      setFirstnameError({ state: true, msg: "plz fill this input" });
    } else {
      setFirstnameError({ state: false, msg: "" });
      count++;
    }
    if (lastName.length <= 0) {
      setLasttnameError({ state: true, msg: "plz fill this input" });
    } else {
      setLasttnameError({ state: false, msg: "" });
      count++;
    }
    if (!emailRegex.test(email)) {
      setEmailError({ state: true, msg: emailError.msg });
    } else {
      setEmailError({ state: false, msg: "" });
      count++;
    }
    if (password !== repassword) {
      setPasswordError({ state: true, msg: "passwords are not a match" });
    } else {
      setPasswordError({ state: false, msg: "" });
      count++;
    }
    if (!passRegex.test(password)) {
      setPasswordError({
        state: true,
        msg: "weak password ,Minimum eight characters, at least one letter, one number and one special character",
      });
    } else {
      setPasswordError({ state: false, msg: "" });
      count++;
    }

    if (count === 5) {
      setButtonState(false);
    }
  }, [email, password, repassword, firstName, lastName]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(API_getClientData(), {
          method: "GET",
        });
  
        if (response.ok) {
          const data = await response.json();
          setEmail(data.email);
          setFirstName(data.name);
          setLastName(data.lastname);
          setUserId(data.id);
          
        } 
      } catch (error) {
        
      }

    };
  
    fetchClientData();
  }, []);

  function handleSubmite(client_id){
    if (password !== repassword){
        return;
    }
    const fs = async()=>{
        const response = await fetch(API_modifyClient(), {
            method:"POST",
            body:JSON.stringify(
                {
                    client_id:client_id,
                    name: firstName,
                    lastname: lastName,
                    email: email,
                    password: password
                }
            )
        });

        if (response.ok){
            console.log("changed");
            setSuccess(true);
        }
        else{
            console.log("not chamged");
            setSuccess(true);
        }
        setTimeout(()=>{
            setErr(false);
            setSuccess(false);
          }, 4000);
    }
    fs();
  }
  return (
    <>
      <SideBarNewUi loggedin={true} />
      <Container fluid>
        <Container>
         { success===true && <Alert severity="success">data was update successfully</Alert>}
         { err===true && <Alert severity="error">we couldn't update the data</Alert>}
          <h1>My information</h1>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch", color: "white" },
            }}
            noValidate
            autoComplete="off"
            style={{ backgroundColor: "white", padding: "30px" }}
          >
            <div>
                
              <TextField
                error={firstnameError.state}
                id="filled-error"
                label="First Name"
                helperText={firstnameError.state ? firstnameError.msg : ""}
                variant="filled"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <TextField
                error={lastnameError.state}
                id="filled-error-helper-text"
                label="Last Name"
                helperText={lastnameError.state ? lastnameError.msg : ""}
                variant="filled"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
            <div>
              <TextField
                error={emailError.state}
                id="filled-error"
                label="Email"
                variant="filled"
                helperText={emailError.state ? emailError.msg : ""}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <TextField
                error={false}
                id="filled-error"
                label="Password"
                variant="filled"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <TextField
                error={passwordError.state}
                id="filled-error-helper-text"
                label="Verify password"
                helperText={passwordError.state ? passwordError.msg : ""}
                variant="filled"
                type="password"
                value={repassword}
                onChange={(e) => {
                  setRepassword(e.target.value);
                }}
              />
            </div>
            <Button
              disabled={buttonState}
              variant="contained"
              endIcon={<UpgradeIcon />}
              onClick={()=>{handleSubmite(userid)}}
            >
              Send
            </Button>
          </Box>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
