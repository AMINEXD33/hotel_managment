import { useEffect, useRef, useState } from "react";
import "./popups.css";
import {
  CloseButton,
  Carousel,
  FloatingLabel,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import Image from "next/image";
import ImageBank from "../imgBank/imagebank";
import formChecker from "../../formChecker";
import { 
  API_modifyUser,
  API_deleteRoomPhotoById,
} from "../../../../endpoints/endpoints";
import massCall from "@/app/massCall";
import Confirmation from "../confirmation/confirmation";



/**
 * this function is a side effect of an evaluation
 * the evaluation could be true or false, depending on that
 * this function does some actions
 * @param {*} evaluation
 * @param  {...any} args
 * @returns
 */
function sideEffect(evaluation, ...args) {
  let element = args[0];
  let key = args[1];
  let allDataIsValid = args[2];
  let setAllDataIsValid = args[3];

  if (!element) {
    return;
  }
  if (evaluation === true) {
    element.classList.remove("notVerBack");
    element.classList.add("verBack");
    if (key === "email") {
      console.log("email is set to true");
    }
  } else {
    element.classList.remove("verBack");
    element.classList.add("notVerBack");
    if (key === "email") {
      console.log("email is set to false with key = ", key);
    }
  }
  setAllDataIsValid((prevState) => ({ ...prevState, [key]: evaluation }));
}

function modifyData(...args){
  const setErrorAlert = args[0];
  const setSuccessAlert = args[1];
  const formData = args[2];
  const userId = args[3];
  
  const callModUser = {url:API_modifyUser(), method:"POST", body:{
    "user_id": userId,
    "name": formData.firstname.value,
    "lastname": formData.lastname.value,
    "password": formData.password.value,
    "email":formData.email.value
  }};
  let promises = massCall([callModUser]);
  promises
  .then(headers=>{
        setSuccessAlert({state:true, message:"user data was modified"});
  })
  .catch(err=>{
    setErrorAlert({state:true, message:"can't modify this user"})
  })
  const st = setTimeout(()=>{
    setSuccessAlert({state:false, message:""});
    setSuccessAlert({state:false, message:""});
    clearTimeout(st);
  }, 1500);
}

function deletePhoto(...args){
  const setErrorAlert = args[0];
  const setSuccessAlert = args[1];
  const imgId = args[2];
  const modPopUp = args[3];
  const setModPopUp = args[4];

  const deletePhotoCall = { url: API_deleteRoomPhotoById(), method: "POST" , body:{'photo_id':imgId}};
  let promises = massCall([deletePhotoCall]);
  promises
    .then(async (promises) => {
      let promis = promises[0];
      if (promis.status === "fulfilled") {
        let status = promis.value.status;
        if (status === 200){
          setSuccessAlert({state:true, message:"photo was deleted"});
        }
      }
    })
    .catch((err) => {
      setErrorAlert({state:true, message:"can't delete this photo"})
    });
    const st = setTimeout(()=>{
      setSuccessAlert({state:false, message:""});
      setErrorAlert({state:false, message:""});
      clearTimeout(st);
    }, 1500);
    
    // reset to rerender after modification
    setModPopUp({
      state: false,
      id:NaN,
      hotelData:{}
    })
}
export default function ModifyPopUpusers({ 
  modPopUp, 
  setModPop,
  setErrorAlert,
  setSuccessAlert,
}) {
  // form data
  const [formData, setFormData] = useState({
    firstname: { key: "firstname", value: modPopUp.userData.name, element: null, regex: /^[\s\S]*$/ },
    lastname: { key: "lastname", value: modPopUp.userData.lastname, element: null, regex: /^[\s\S]*$/ },
    password: { key: "password", value: "", element: null, regex: /^[\s\S]*$/ },
    email: { key: "email", value: modPopUp.userData.email, element: null, regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ },
    
  });
  // photoBank
  const [photoBank, setPhotoBank] = useState([]);

  // button state
  const [btnState, setBtnState] = useState(false);

  // confirmation visiblity for img deletion
  const [confirmVisible1, setConfirmVisible1] = useState(false);

  // confirmation visiblity for modifying data
  const [confirmVisible2, setConfirmVisible2] = useState(false);

  // deleted photo target id
  const [photoId, setPhotoId] = useState();

  // flags for the state of each entry
  const [allDataIsValid, setAllDataIsValid] = useState({
    firstname: true,
    lastname: true,
    password: true,
    email: true,
  });

  const pass = useRef(null);
  const passconf = useRef(null);
  useEffect(()=>{
    console.warn("here is the passed data >>", modPopUp);
  }, []);

  useEffect(()=>{
    console.warn(modPopUp);
  }, []);
 
  // check the validity of the form when the formData changes
  useEffect(() => {
    console.log(formData);
    // console.log(allDataIsValid);
    for (let key of Object.keys(formData)) {
      formChecker({
        sideEffect: sideEffect,
        value: formData[key].value,
        regex: formData[key].regex,
        sideEffectVariables: [
          formData[key].element,
          key,
          allDataIsValid,
          setAllDataIsValid,
        ],
      });
    }
  }, [formData]);

  // disable or enable the button depending on the state of the form
  useEffect(() => {
    let flag = true;
    for (let key of Object.keys(allDataIsValid)) {
      if (allDataIsValid[key] === false) {
        flag = false;
      }
    }
    if (flag) {
      setBtnState(false);
    } else {
      setBtnState(true);
    }
  }, [allDataIsValid]);


  return (
    <div className="modifyPopUp">
      <CloseButton
        onClick={() => {
          setModPop({ ...modPopUp, state: false, id: NaN });
        }}
        color="red"
        style={{ backgroundColor: "red" }}
        className="closePopup"
      />

      {/**confirmation for deleting a photo */}
      {confirmVisible1 && 
        <Confirmation
          confirmationTitle={"are you sure you want to delete this photo"}
          confirmationBodyText={"deleting this photo will result in it's permenent lose!."}
          onYesCallBack={(...args)=>{deletePhoto(...args)}}
          onNoCallBack={(...args)=>{console.log("no")}}
          setVisibleState={setConfirmVisible1}
          args={[setErrorAlert, setSuccessAlert, photoId, modPopUp ,setModPop]}
          yesButtonText={"delete"}
          noButtonText={"cancel"}
        />
      }
      {/**confirmation for midifying data */}
        {confirmVisible2 && 
        <Confirmation
          confirmationTitle={"are you sure you want to modify this data"}
          confirmationBodyText={"modifying this data means that the old values are forgoten"}
          onYesCallBack={(...args)=>{modifyData(...args)}}
          onNoCallBack={(...args)=>{console.log("no")}}
          setVisibleState={setConfirmVisible2}
          args={[
            setErrorAlert, 
            setSuccessAlert, 
            formData, 
            modPopUp.id,
          ]}
          yesButtonText={"modify"}
          noButtonText={"cancel"}
        />
      }
      <div className="modifyWindow">
        

        <div className="actions">
          <FloatingLabel
            controlId="floatingInput"
            label="first name"
            className="mb-3"
          >
            <Form.Control
              type="text"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["firstname"]: {
                    key: "firstname",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["firstname"].regex,
                  },
                });
              }}
              defaultValue={modPopUp.userData.name}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="last name"
            className="mb-3"
          >
            <Form.Control
              type="text"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["lastname"]: {
                    key: "lastname",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["lastname"].regex,
                  },
                });
              }}
              defaultValue={modPopUp.userData.lastname}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="email"
            className="mb-3"
          >
            <Form.Control
              type="text"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["email"]: {
                    key: "email",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["email"].regex,
                  },
                });
              }}
              defaultValue={modPopUp.userData.email}
            />
          </FloatingLabel>
          
          <FloatingLabel
            controlId="floatingInput"
            label="password"
            className="mb-3"
          >
            <Form.Control
              type="password"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["password"]: {
                    key: "password",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["password"].regex,
                  },
                });
              }}
              defaultValue={""}
              ref={pass}
            />
          </FloatingLabel>


          <Button 
          onClick={()=>{setConfirmVisible2(true)}}
          disabled={btnState} 
          variant="success">
            Modify
          </Button>
        </div>
      </div>
    </div>
  );
}
