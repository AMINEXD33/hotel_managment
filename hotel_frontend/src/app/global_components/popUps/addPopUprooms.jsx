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
const websitesRegex =
  /(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
import { 
    API_getHotelsLite, 
    API_createRoom,
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
  const photobank = args[3];
  const setAddPop = args[4];

  const formDataAll = new FormData();
  
  photobank.forEach((photo, index)=>{
      if (photo instanceof File) {
        formDataAll.append(`photos[${index}]`, photo);
      } else {
        console.error('Photo is not a valid File object:', photo);
      }
  });

  formDataAll.append('description', formData.description.value);
  formDataAll.append('baths', formData.baths.value);
  formDataAll.append('beds', formData.beds.value);
  formDataAll.append('price', formData.price.value);
  formDataAll.append('suites', formData.suites.value);
  formDataAll.append('type', formData.type.value);
  formDataAll.append('id_hotel', formData.id_hotel.value);

  for (let [key, value] of formDataAll.entries()) {
    console.log(`${key}:`, value);
  }
  console.warn("sent post data = ", formDataAll);

  fetch(API_createRoom(), {
    method:"POST",
    headers:{
      // 'Content-Type': 'multipart/form-data',
    },
    body:formDataAll
  })
  .then(headers=>{
    return (headers)
  })
  .then(async data=>{
    if (data.status === 200){
      setSuccessAlert({state:true, message:"hotel data was modified"});
    }
    else{
        setErrorAlert({state:true, message:"can't create this room"})

    }
  })
  .catch(err=>{

    setErrorAlert({state:true, message:"can't create this room"})
  })
  const st = setTimeout(()=>{
    setSuccessAlert({state:false, message:""});
    setErrorAlert({state:false, message:""});
    clearTimeout(st);
  }, 1500);
//   setAddPop({state:false});
}

export default function AddPopupRooms({ 
addPopUp, 
setAddPop,
  setErrorAlert,
  setSuccessAlert,
}) {
  // form data
  const [formData, setFormData] = useState({
    roomId: { key: "roomId", value: "", element: null, regex: /^[\s\S]*$/ },
    description: {
      key: "description",
      value: "",
      element: null,
      regex: /^[\s\S]*$/,
    },
    baths: { key: "baths", value: "", element: null, regex: /^[0-9]{1,}$/ },
    beds: { key: "beds", value: "", element: null, regex: /^[0-9]{1,}$/ },
    price: { key: "price", value: "", element: null, regex: /^[0-9.]{1,}$/ },
    suites: {key: "suites", value: "", element: null, regex: /^(normal|junior|executive|presidential)*$/},
    type: {key: "type", value: "", element: null, regex: /^(single|double|triple|quadruple)$/},
    id_hotel: {key: "id_hotel", value:"", element: null, regex: /^[0-9]{1,}$/}
  });
  // photoBank
  const [photoBank, setPhotoBank] = useState([]);
  // for show photo sources
  const [forShow, setForShow] = useState([]);

  // button state
  const [btnState, setBtnState] = useState(false);

  // confirmation visiblity for modifying data
  const [confirmVisible2, setConfirmVisible2] = useState(false);

  // flags for the state of each entry
  const [allDataIsValid, setAllDataIsValid] = useState({
    hotelName: true,
    description: true,
    email: true,
    phone: true,
    website: true,
    city: true,
  });

  // HOTELS
  const [hotelsNames, setHotelsNames] = useState([]);
  // for visual perposes we're setting the overflow of this page to hidden
  // i couldn't find a work around this one
  useEffect(() => {
    const dc = document.getElementsByTagName("html");
    dc[0].style.overflowY = "hidden";
    setBtnState(true);
    const callHotels = { url: API_getHotelsLite(), method: "GET" };
    let promises = massCall([callHotels]);
    promises
      .then(async (promises) => {
        let promis = promises[0];
        if (promis.status === "fulfilled") {
          let data = await promis.value.json();
          console.warn("damn data .>>>", data);
          if (Array.isArray(data)) {
            setHotelsNames(data);
          } else {
            console.warn("the data is not an array then it's not valid");
          }
        }
      })
      .catch((err) => {
        console.warn("can't get hotels lite liste", err);
      });
    
  }, []);

  // check the validity of the form when the formData changes
  useEffect(() => {
    // console.log(formData);
    console.log(allDataIsValid);
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
            setAddPop({ ...addPopUp, state: false});
        }}
        color="red"
        style={{ backgroundColor: "red" }}
        className="closePopup"
      />

      {/**confirmation for adding data */}
        {confirmVisible2 && 
        <Confirmation
          confirmationTitle={"are you sure you want to create this hotel"}
          confirmationBodyText={""}
          onYesCallBack={(...args)=>{modifyData(...args)}}
          onNoCallBack={(...args)=>{console.log("no")}}
          setVisibleState={setConfirmVisible2}
          args={[
            setErrorAlert, 
            setSuccessAlert, 
            formData, 
            photoBank,
            setAddPop
          ]}
          yesButtonText={"create"}
          noButtonText={"cancel"}
        />
      }
      <div className="modifyWindow">
        
        <ImageBank 
        forShowPhotos={forShow}
        setForShowPhotos={setForShow}
        setPhotoBank={setPhotoBank}
        photoBank={photoBank}
        />

        <div className="actions">
          <FloatingLabel
            controlId="floatingInput"
            label="baths"
            className="mb-3"
          >
            <Form.Control
              type="number"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["baths"]: {
                    key: "baths",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["baths"].regex,
                  },
                });
              }}
              defaultValue={""}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="beds"
            className="mb-3"
          >
            <Form.Control
              type="number"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["beds"]: {
                    key: "beds",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["beds"].regex,
                  },
                });
              }}
              defaultValue={""}
            />
          </FloatingLabel>

          <FloatingLabel controlId="floatingTextarea2" label="Description">
            <Form.Control
              as="textarea"
              placeholder="description"
              style={{ height: "100px" }}
              className="mb-3"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["description"]: {
                    key: "description",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["description"].regex,
                  },
                });
              }}
              defaultValue={""}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingSelect"
            label="suites"
            className="mb-3"
          >
            <Form.Select
              aria-label="Floating label select example "
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["suites"]: {
                    key: "suites",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["suites"].regex,
                  },
                });
              }}
              defaultValue={"adad"}
            >
               <option value={"none"}>Select suites</option>
              {["normal", "junior", "executive", "presidential"].map((value, index) => {
                return (
                  <option key={`city${index}`} value={value}>
                    {value}
                  </option>
                );
              })}
            </Form.Select>
          </FloatingLabel>
        

          <FloatingLabel
            controlId="floatingSelect"
            label="type"
            className="mb-3"
          >
            <Form.Select
              aria-label="Floating label select example "
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["type"]: {
                    key: "type",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["type"].regex,
                  },
                });
              }}
              defaultValue={"adad"}
            >
                <option value={"none"}>Select type</option>
              {["single", "double", "triple", "quadruple"].map((value, index) => {
                return (
                  <option key={`city${index}`} value={value}>
                    {value}
                  </option>
                );
              })}
            </Form.Select>
          </FloatingLabel>


          <FloatingLabel
            controlId="floatingInput"
            label="price"
            className="mb-3"
          >
            <Form.Control
              type="number"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["price"]: {
                    key: "price",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["price"].regex,
                  },
                });
              }}
              defaultValue={""}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingSelect"
            label="hotel"
            className="mb-3"
          >
            <Form.Select
              aria-label="Floating label select example "
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["id_hotel"]: {
                    key: "id_hotel",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["id_hotel"].regex,
                  },
                });
              }}
              value={formData.id_hotel.value}
            >
                <option value={"none"}> Select a hotel </option>
              {hotelsNames.map((value, index) => {
                return (
                  <option key={`hotel${index}`} value={value.id}>
                    {value.name}
                  </option>
                );
            
              })}
            </Form.Select>
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
