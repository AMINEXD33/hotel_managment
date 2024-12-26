"use client";

import SideBar from "@/app/global_components/sidebar/sidebar";
import "../adminDash.css";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Row, Form, FloatingLabel, Col, Spinner, Card, Alert, Button } from "react-bootstrap";
import SearchCalls from "@/app/deboucer";
import Image from "next/image";
import ModifyPopUp from "@/app/global_components/popUps/modifyPopUp";
import massCall from "@/app/massCall";
import { 
  API_getCities, 
  API_getHotels, 
  API_getHotelsByCity, 
  API_getHotelsById, 
  API_getHotelsByName, 
  photobase,
  API_deleteHotelById
} from "../../../../endpoints/endpoints";
import Confirmation from "@/app/global_components/confirmation/confirmation";
import AddPopup from "@/app/global_components/popUps/addPopUp";


/**
 * this function does calls the api to search for a hotel
 * depending on the users search mode
 * @param  {...any} args a list of args [mode, setHotelsData, hotelName, setDataisLoading]
 * @returns 
 */
function fetchLoadHotels(...args) {
  const mode = args[0];
  const setHotelsData = args[1];
  const  hotelName = args[2];
  const setDataisLoading = args[3];

  setDataisLoading(false);
  if (hotelName.trim().length <= 0){
    return;
  }
  let call = null;
  if (mode === 1){
    call = [{url:API_getHotelsByName(), method:"POST", body:{"hotel_name":hotelName}}];
  }
  else if (mode === 2){
    call = [{url:API_getHotelsById(), method:"POST", body:{"hotel_id":hotelName}}];
  }
  else if(mode === 3){
    call = [{url:API_getHotelsByCity(), method:"POST", body:{"hotel_city":hotelName}}];
  }
  if (call === null){
    return;
  }

  let promises = massCall(call);
  promises.then(async (promises) => {
    let promis = promises[0];
    if(promis.status === "fulfilled"){
      let data = await promis.value.json();
      console.warn("damn data .>>>", data);
      if (Array.isArray(data)) {
        // this is a passed in setter
        setHotelsData(data);
      } else {
        console.warn("the data is not an array then it's not valid");
      }
    }
  })
  .catch((err) => {
    console.warn("can't get hotels lite liste", err);
  });

}

function deleteHotel(hotelId, key,setErrorAlert , setSuccessAlert){

  let call = [{url:API_deleteHotelById(), method:"POST", body:{"hotel_id":hotelId}}];
  let promises = massCall(call);
  promises.then(async (promises) => {
    let promis = promises[0];
    if(promis.status === "fulfilled"){
      if (promis.value.status === 200){
        setSuccessAlert({state:true, message:"hotel was deleted !"});
        const target_element = document.getElementById(key);
        target_element.remove();
      }else{
        setErrorAlert({state:true, message:"can't delete this hotel, it may still contain active reservations !"})
      }
    }
  })
  .catch((err) => {
    console.warn("can't get hotels lite liste", err);
  })
  .finally(()=>{
    const st = setTimeout(()=>{
      setErrorAlert({state:false, message:""});
      setSuccessAlert({state:false, message:""});
      clearTimeout(st);
    }, 2000);
  })
}
export default function HotelManagment() {

  const debouncerFrequency = 1000;

  // state of the modifie popup
  const [modPopUp, setModPop] = useState({
    state: false,
    id:NaN,
    hotelData:{}
  })

  const [addPopUp, setAddPop] = useState({
    state: false,
  })

  // hotels data
  let [hotelsData, setHotelsData] = useState([]);

  // cities
  let [citiesData, setCitiesData] = useState([]);

  // deboucer object
  let deboucer = new SearchCalls();

  // loading spinner
  let [dataisLoading, setDataisLoading] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState({
    state:false,
    args:[]
  });

  const [errorAlert, setErrorAlert] = useState({state:false, message:""});

  const [successAlert, setSuccessAlert] = useState({state:false, message:""});

  // for visual perposes we're setting the overflow of this page to hidden
  // i couldn't find a work around this one
  useEffect(() => {
    const dc = document.getElementsByTagName("html");
    dc[0].style.overflowY = 'scroll';
  }, [modPopUp]);

  // load available hotels from when the page is loaded
  useEffect(()=>{
    if (modPopUp.state === true){
      return;
    }
    setDataisLoading(true);
    const callHotels = {url:API_getHotels(), method:"GET"};
    const callCities = {url:API_getCities(), method:"GET"}
    let promises = massCall([callHotels, callCities]);
    promises.then(async (promises) => {
      let index = 0;
      for (let promis of promises){
        if(promis.status === "fulfilled"){
          let data = await promis.value.json();
          console.warn("damn data .>>>", data);
          if (Array.isArray(data)) {
            if (index === 0){
              setHotelsData(data);
            }
            else if (index === 1){
              console.warn("setting cities data")
              setCitiesData(data);
            }
            setDataisLoading(false);
          } else {
            console.warn("the data is not an array then it's not valid");
          }
        }
        index++;
      }
    })
    .catch((err) => {
      console.warn("can't get hotels lite liste", err);
    });
  }, [modPopUp]);

  return (
    <>
      {/*modify popups*/}
      {
        modPopUp.state==true ?
        <ModifyPopUp 
        modPopUp={modPopUp} 
        setModPop={setModPop}
        setErrorAlert={setErrorAlert}
        setSuccessAlert={setSuccessAlert}
        />
        :
        null
      }
      {/**add popup*/}
      {
        addPopUp.state==true?
        <AddPopup 
        addPopUp={addPopUp} 
        setAddPop={setAddPop}
        setErrorAlert={setErrorAlert}
        setSuccessAlert={setSuccessAlert}
        />:
        null
      }
      {
        errorAlert.state &&
        <Alert  variant="danger" className="alertCustom">
          {errorAlert.message}
        </Alert>
      }
      {
        successAlert.state &&
        <Alert  variant="success" className="alertCustom">
          {successAlert.message}
        </Alert>
      }

            {/**confirmation for deleting a photo */}
      {confirmVisible.state && 
        <Confirmation
          confirmationTitle={"are you sure you want to delete hotel"}
          confirmationBodyText={"deleting this hotel will result in it's permenent lose!."}
          onYesCallBack={(...args)=>{deleteHotel(...args)}}
          onNoCallBack={(...args)=>{console.log("no")}}
          setVisibleState={setConfirmVisible}
          args={[...confirmVisible.args]}
          yesButtonText={"delete"}
          noButtonText={"cancel"}
        />
      }
    <div className="container-fluid   master">
      <SideBar />
      <div className="pagecontentmain">
        <h2 className="managmentHeader">Hotels managment</h2>
        <div className="dataFilter">
          <Row className="g-4">
            <Col md>
              <FloatingLabel controlId="floatingInputGrid" label="Hotel Name">
                <Form.Control
                  onChange={(e) => {
                    setDataisLoading(true);
                    deboucer.debounce(
                      fetchLoadHotels,
                      [1, setHotelsData, e.target.value, setDataisLoading],
                      debouncerFrequency
                    );
                  }}
                  type="text"
                  placeholder="name@example.com"
                />
              </FloatingLabel>
            </Col>

            <Col md>
              <FloatingLabel controlId="floatingInputGrid" label="Hotel id">
                <Form.Control
                  onChange={(e) => {
                    setDataisLoading(true);
                    deboucer.debounce(
                      fetchLoadHotels,
                      [2, setHotelsData, e.target.value, setDataisLoading],
                      debouncerFrequency
                    );
                  }}
                  type="number"
                  placeholder="name@example.com"
                />
              </FloatingLabel>
            </Col>

            <Col md>
              <FloatingLabel
                controlId="floatingSelectGrid"
                label="Cities"
              >
                <Form.Select 
                aria-label="cities select" 
                onChange={(e) => {
                  setDataisLoading(true);
                  deboucer.debounce(
                    fetchLoadHotels,
                    [3, setHotelsData, e.target.value, setDataisLoading],
                    debouncerFrequency
                  );
                }}
                >
                  {
                    citiesData.map((value, index)=>(
                      <option key={`city${index}`} value={value.city}>{value.city}</option>
                    ))
                  }

                </Form.Select>
              </FloatingLabel>
            </Col>

            <Col md style={{"display":"flex", "justifyContent":"center"}}>
              <Button 
              onClick={()=>{setAddPop({state:true})}}
              variant="secondary">add hotail</Button>
            </Col>
          </Row>

          <div className="dataDisplayer">
            {/** SPINNER */}
            {dataisLoading ?
            <Spinner animation="grow" variant="primary" style={{overflow:"hidden"}}/>
            :
            null
            }
            
          </div>
          <div className="dataDisplayer" >
            <Row xs={1} md={2} className="g-4" id="hotelsCOntainer">
              {hotelsData.map((value, idx) => {
                if (value.hotel === null){return;}
                let targetPhoto = null;
                if (value.photos.length > 0){
                  targetPhoto = value.photos[0].photo;
                }
                if (targetPhoto !== null){
                  if (targetPhoto.trim() === ""){
                    targetPhoto=null;
                  }
                }

                
                return(
                <Col key={`hotel${idx}`} id={`hotel${idx}`}>
                  <Card>
                    <Image
                      src={!targetPhoto?"/null":photobase+targetPhoto}
                      alt="ypp" 
                      layout="responsive"
                      width={250}
                      height={100}
                    />
                    <Card.Body>
                      <Card.Title>{value.hotel.name}</Card.Title>
                      <Card.Text> {value.hotel.description} </Card.Text>
                      <div className="Boxactions">
                        <img
                        title="modify this hotel"
                        className="boxActionIconModify"
                        src="/modify.png" width={30} height={30}
                        onClick={()=>{setModPop({state:true, id:idx, hotelData: value})}}
                        ></img>
                        <img 
                        title="delete this hotel"
                        className="boxActionIconDelete"
                        src="/delete.png" width={30} height={30}
                        onClick={()=>{setConfirmVisible({state:true, args:[value.hotel.id, `hotel${idx}`, setErrorAlert , setSuccessAlert]})}}
                        ></img>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
            )})}
            </Row>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
