import { useEffect, useState } from "react";
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
  API_getCities, 
  API_modifyHotel,
  API_deleteHotelPhotoId,
  photobase
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
  const hotelId = args[3];
  const photobank = args[4];
  

  const formDataAll = new FormData();
  
  photobank.forEach((photo, index)=>{
      if (photo instanceof File) {
        formDataAll.append(`photos[${index}]`, photo);
      } else {
        console.error('Photo is not a valid File object:', photo);
      }
  });


  formDataAll.append('hotel_id', hotelId);
  formDataAll.append('name', formData.hotelName.value);
  formDataAll.append('address', formData.address.value);
  formDataAll.append('description', formData.description.value);
  formDataAll.append('email', formData.email.value);
  formDataAll.append('phone', formData.phone.value);
  formDataAll.append('website', formData.website.value);
  formDataAll.append('city', formData.city.value);


  for (let [key, value] of formDataAll.entries()) {
    console.log(`${key}:`, value);
  }
  console.warn("sent post data = ", formDataAll);

  fetch(API_modifyHotel(), {
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
      const data_ = await data.json();
      const error = data.error;
      const message = data.message;
      if (error){
        setErrorAlert({state:true, message:error})
      }
      else if (message){
        setErrorAlert({state:true, message:message})
      }
    }
  })
  .catch(err=>{
    setErrorAlert({state:true, message:"can't modify this hotel"})
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
  const deletePhotoCall = { url: API_deleteHotelPhotoId(), method: "POST" , body:{'photo_id':imgId}};
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
      setSuccessAlert({state:false, message:""});
      clearTimeout(st);
    }, 1500);
}
export default function ModifyPopUp({ 
  modPopUp, 
  setModPop,
  setErrorAlert,
  setSuccessAlert,
}) {
  // form data
  const [formData, setFormData] = useState({
    hotelName: { key: "hotelName", value: modPopUp.hotelData.hotel.name, element: null, regex: /^.*$/ },
    description: {
      key: "description",
      value: modPopUp.hotelData.hotel.description,
      element: null,
      regex: /^.*$/,
    },
    email: {
      key: "email",
      value: modPopUp.hotelData.hotel.email,
      element: null,
      regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    phone: { key: "phone", value: modPopUp.hotelData.hotel.phone, element: null, regex: /^[0-9]{1,}$/ },
    website: { key: "website", value: modPopUp.hotelData.hotel.website, element: null, regex: websitesRegex },
    city: { key: "city", value: modPopUp.hotelData.hotel.city, element: null, regex: /^.*$/ },
    address:{key: "address", value: modPopUp.hotelData.hotel.address, element:null, regex: /^.*$/}
  });
  // photoBank
  const [photoBank, setPhotoBank] = useState([]);
  // for show photo sources
  const [forShow, setForShow] = useState([]);
  // cities
  const [cities, setCitiesData] = useState([]);
  
  // button state
  const [btnState, setBtnState] = useState(false);

  // confirmation visiblity for img deletion
  const [confirmVisible1, setConfirmVisible1] = useState(false);

  // confirmation visiblity for modifying data
  const [confirmVisible2, setConfirmVisible2] = useState(false);

  // photo id that will be deleted
  const [photoId, setPhotoId] = useState(NaN);

  // flags for the state of each entry
  const [allDataIsValid, setAllDataIsValid] = useState({
    hotelName: true,
    description: true,
    email: true,
    phone: true,
    website: true,
    city: true,
  });

  // for visual perposes we're setting the overflow of this page to hidden
  // i couldn't find a work around this one
  useEffect(() => {
    const dc = document.getElementsByTagName("html");
    dc[0].style.overflowY = "hidden";
    const callCities = { url: API_getCities(), method: "GET" };
    let promises = massCall([callCities]);
    promises
      .then(async (promises) => {
        let promis = promises[0];
        if (promis.status === "fulfilled") {
          let data = await promis.value.json();
          console.warn("damn data .>>>", data);
          if (Array.isArray(data)) {
            setCitiesData(data);
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
          args={[setErrorAlert, setSuccessAlert, photoId]}
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
            modPopUp.hotelData.hotel.id,
            photoBank
          ]}
          yesButtonText={"modify"}
          noButtonText={"cancel"}
        />
      }
      <div className="modifyWindow">
        <Carousel
          className="photoSlider"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {modPopUp.hotelData.photos.map((val, index) => {
            return (
              <Carousel.Item key={"hotelid" + index}>
                <div>
                  <Button 
                  onClick={()=>{
                    setPhotoId(val.id);
                    setConfirmVisible1(true);
                  }}
                  variant="danger" className="deletePhoto">
                    DELETE
                  </Button>
                </div>
                <Image
                  src={photobase+val.photo}
                  height={700}
                  width={700}
                  alt="ypp"
                  layout="responsive"
                  style={{ borderRadius: "10px" }}
                />
                <Carousel.Caption></Carousel.Caption>
              </Carousel.Item>
            );
          })}
        </Carousel>

        <ImageBank 
        forShowPhotos={forShow}
        setForShowPhotos={setForShow}
        setPhotoBank={setPhotoBank}
        photoBank={photoBank}
        />

        <div className="actions">
          <FloatingLabel controlId="floatingInput" label="id" className="mb-3">
            <Form.Control
              type="number"
              disabled
              defaultValue={modPopUp.hotelData.hotel.id}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="hotel name"
            className="mb-3"
          >
            <Form.Control
              type="text"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["hotelName"]: {
                    key: "hotelName",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["hotelName"].regex,
                  },
                });
              }}
              defaultValue={modPopUp.hotelData.hotel.name}
            />
          </FloatingLabel>
          
          <FloatingLabel
            controlId="floatingInput"
            label="address"
            className="mb-3"
          >
            <Form.Control
              type="text"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["address"]: {
                    key: "address",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["address"].regex,
                  },
                });
              }}
              defaultValue={modPopUp.hotelData.hotel.address}
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
              defaultValue={modPopUp.hotelData.hotel.description}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
            <Form.Control
              type="email"
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
              defaultValue={modPopUp.hotelData.hotel.email}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="phone"
            className="mb-3"
          >
            <Form.Control
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["phone"]: {
                    key: "phone",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["phone"].regex,
                  },
                });
              }}
              type="phone"
              defaultValue={modPopUp.hotelData.hotel.phone}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="website"
            className="mb-3"
          >
            <Form.Control
              type="text"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["website"]: {
                    key: "website",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["website"].regex,
                  },
                });
              }}
              defaultValue={modPopUp.hotelData.hotel.website}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingSelect"
            label="Works with selects"
            className="mb-3"
          >
            <Form.Select
              aria-label="Floating label select example "
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ["city"]: {
                    key: "city",
                    value: e.target.value,
                    element: e.target,
                    regex: formData["city"].regex,
                  },
                });
              }}
              defaultValue={"adad"}
            >
              <option value="1">{modPopUp.hotelData.hotel.city}</option>
              {cities.map((value, index) => {
                if (value.city === modPopUp.hotelData.hotel.city) {
                  return;
                }
                return (
                  <option key={`city${index}`} value={value.city}>
                    {value.city}
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
