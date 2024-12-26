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
  API_getCities, 
  API_modifyRoom,
  API_deleteRoomPhotoById,
  API_getRoomPhotosById,
  API_getHotelsLite,
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
  const roomdId = args[3];
  const photobank = args[4];
  

  const formDataAll = new FormData();
  
  photobank.forEach((photo, index)=>{
      if (photo instanceof File) {
        formDataAll.append(`photos[${index}]`, photo);
      } else {
        console.error('Photo is not a valid File object:', photo);
      }
  });

  formDataAll.append('room_id', roomdId);
  formDataAll.append('id_hotel', formData.id_hotel.value);
  formDataAll.append('type', formData.type.value);
  formDataAll.append('suites', formData.suites.value);
  formDataAll.append('price', formData.price.value);
  formDataAll.append('beds', formData.beds.value);
  formDataAll.append('baths', formData.baths.value);
  formDataAll.append('description', formData.description.value);



  for (let [key, value] of formDataAll.entries()) {
    console.log(`${key}:`, value);
  }
  console.warn("sent post data = ", formDataAll);

  fetch(API_modifyRoom(), {
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
export default function ModifyPopUpRooms({ 
  modPopUp, 
  setModPop,
  setErrorAlert,
  setSuccessAlert,
}) {
  // form data
  const [formData, setFormData] = useState({
    roomId: { key: "roomId", value: modPopUp.roomData.id, element: null, regex: /^[\s\S]*$/ },
    description: {
      key: "description",
      value: modPopUp.roomData.description,
      element: null,
      regex: /^[\s\S]*$/,
    },
    baths: { key: "baths", value: modPopUp.roomData.baths, element: null, regex: /^[0-9]{1,}$/ },
    beds: { key: "beds", value: modPopUp.roomData.beds, element: null, regex: /^[0-9]{1,}$/ },
    price: { key: "price", value: modPopUp.roomData.price, element: null, regex: /^[0-9.]{1,}$/ },
    suites: {key: "suites", value: modPopUp.roomData.suites, element: null, regex: /^(normal|junior|executive|presidential)*$/},
    type: {key: "type", value: modPopUp.roomData.type, element: null, regex: /^(single|double|triple|quadruple)$/},
    id_hotel: {key: "id_hotel", value:modPopUp.roomData.id_hotel, element: null, regex: /^[0-9]{1,}$/}
  });
  // photoBank
  const [photoBank, setPhotoBank] = useState([]);
  // for show photo sources
  const [forShow, setForShow] = useState([]);
  // HOTELS
  const [hotelsNames, setHotelsNames] = useState([]);
  
  // button state
  const [btnState, setBtnState] = useState(false);

  // confirmation visiblity for img deletion
  const [confirmVisible1, setConfirmVisible1] = useState(false);

  // confirmation visiblity for modifying data
  const [confirmVisible2, setConfirmVisible2] = useState(false);

  // deleted photo target id
  const [photoId, setPhotoId] = useState();
  // rooms photos
  const [roomPhotos, setRoomPhotos] = useState([]);

  // flags for the state of each entry
  const [allDataIsValid, setAllDataIsValid] = useState({
    description: true,
    available: true,
    baths: true,
    beds: true,
    price: true,
    suites: true,
    type:true
  });
  useEffect(()=>{
    console.warn("here is the passed data >>", modPopUp);
  }, []);
  // for visual perposes we're setting the overflow of this page to hidden
  // i couldn't find a work around this one
  useEffect(() => {
    const dc = document.getElementsByTagName("html");
    dc[0].style.overflowY = "hidden";
    const callHotels = { url: API_getHotelsLite(), method: "GET" };
    const callRoomPhotos = {url: API_getRoomPhotosById(), method: "POST", body:{"room_id": formData.roomId.value}};
    let promises = massCall([callHotels, callRoomPhotos]);
    promises
      .then(async (promises) => {
        let index = 0;
        for (let promis of promises){
            if (promis.status === "fulfilled") {
                let data = await promis.value.json();
                if (Array.isArray(data)&& index === 0){
                    setHotelsNames(data);
                }
                else if(Array.isArray(data)&& index === 1){
                    setRoomPhotos(data);
                }
            }
            index++;
        }
      })
      .catch((err) => {
        console.warn("can't get hotels lite liste", err);
      });
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
            modPopUp.roomData.id,
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
          {roomPhotos.map((val, index) => {
            const element = <Carousel.Item key={"hotelid" + index}>
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
            

            return (element);
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
              defaultValue={modPopUp.roomData.id}
            />
          </FloatingLabel>

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
              defaultValue={modPopUp.roomData.baths}
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
              defaultValue={modPopUp.roomData.beds}
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
              defaultValue={modPopUp.roomData.description}
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
              <option value="1">{modPopUp.roomData.suites}</option>
              {["normal", "junior", "executive", "presidential"].map((value, index) => {
                if (value === modPopUp.roomData.suites) {
                  return;
                }
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
              <option value="1">{modPopUp.roomData.type}</option>
              {["single", "double", "triple", "quadruple"].map((value, index) => {
                if (value === modPopUp.roomData.type) {
                  return;
                }
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
              defaultValue={modPopUp.roomData.price}
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
