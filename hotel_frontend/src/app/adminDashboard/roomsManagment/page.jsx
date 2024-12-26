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
  API_getAllRooms,
  API_deleteRoomById
} from "../../../../endpoints/endpoints";
import Confirmation from "@/app/global_components/confirmation/confirmation";
import AddPopupRooms from "@/app/global_components/popUps/addPopUprooms";
import Badge from 'react-bootstrap/Badge';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import ModifyPopUpRooms from "@/app/global_components/popUps/modifyPopUprooms";

function deleteHotel(roomId,setErrorAlert , setSuccessAlert, setModPop){

  let call = [{url:API_deleteRoomById(), method:"POST", body:{"room_id":roomId}}];
  let promises = massCall(call);
  promises.then(async (promises) => {
    let promis = promises[0];
    if(promis.status === "fulfilled"){
      if (promis.value.status === 200){
        setSuccessAlert({state:true, message:"hotel was deleted !"});
        // change state to refetch the changes
        setModPop({state:true,id:NaN, roomData:{}})
      }else{
        setErrorAlert({state:true, message:"can't delete this room, it may still be reserved!"})
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
  });
}

function findRoomId(id , data){
  let room_ = {};
  data.forEach(room => {
    if (room["id"] === id){
      room_ = room;
    }
  });

  return room_;

}
  
const paginationModel = { page: 0, pageSize: 5 };
  
export default function HotelManagment() {

  // state of the modifie popup
  const [modPopUp, setModPop] = useState({
    state: false,
    id:NaN,
    roomData : {}
  })

  const [addPopUp, setAddPop] = useState({
    state: false,
  })

  // hotels data
  let [hotelRooms, sethotelRooms] = useState([]);

  // loading spinner
  let [dataisLoading, setDataisLoading] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState({
    state:false,
    args:[]
  });

  const [errorAlert, setErrorAlert] = useState({state:false, message:""});

  const [successAlert, setSuccessAlert] = useState({state:false, message:""});

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'suites', headerName: 'Suite', width: 110 },
    { field: 'price', headerName: 'Price', width: 90,

      renderCell: (params)=>{
        return(
          <>
            <p>{params.row.price} DH/h</p>
          </>
        )
      }
    },
    { field: 'available', headerName: 'Available', width: 90,

      renderCell: (params)=>{
        return(
          <>
          {params.row.available === 1 &&<Badge bg="success">free</Badge>}
          {params.row.available === 0 &&<Badge bg="danger">reserved</Badge>}
          </>
        )
      }
    },
    { field: 'beds', headerName: 'Beds', width: 90 },
    { field: 'baths', headerName: 'Baths', width: 90 },
    { field: 'description', headerName: 'Description', width: 90 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => {
        return (
          <div>
            <Button
              variant="primary"
              color="primary"
              size="small"
              onClick={() =>setModPop({
                state:true, 
                id:params.row.id, 
                roomData: findRoomId(params.row.id, hotelRooms)
              })}
              style={{ marginRight: 8 }}
            >
              Modify
            </Button>
            <Button
              variant="warning"
              color="secondary"
              size="small"
              onClick={() =>{setConfirmVisible({
                state:true, 
                args:[
                  params.row.id, 
                  setErrorAlert , 
                  setSuccessAlert,
                  setModPop
                ]})}}
            >
              Delete
            </Button>
          </div>
        );},
    },
  ];

  // load available rooms from when the page is loaded
  useEffect(()=>{
    if (modPopUp.state === true){
      return;
    }
    setDataisLoading(true);
    const callRooms = {url:API_getAllRooms(), method:"GET"};
    let promises = massCall([callRooms]);
    promises.then(async (promises) => {
      let index = 0;
      for (let promis of promises){
        if(promis.status === "fulfilled"){
          let data = await promis.value.json();
          console.warn("damn data .>>>", data);
          if (Array.isArray(data)) {
            sethotelRooms(data);
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
  }, [modPopUp, addPopUp]);
 



  return (
    <>
      {/*modify popups*/}
      {
        modPopUp.state==true ?
        <ModifyPopUpRooms 
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
        <AddPopupRooms 
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
          confirmationTitle={"are you sure you want to delete this room?"}
          confirmationBodyText={"deleting this room will result in it's permenent lose!."}
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
        <h2 className="managmentHeader">Rooms managment</h2>
        <div style={{display:"block", margin:"15px"}}>
          <Col md style={{"display":"flex", "justifyContent":"center"}}>
                <Button 
                onClick={()=>{setAddPop({state:true})}}
                variant="secondary">add room</Button>
          </Col>
        </div>
        <div className="dataFilter">
        <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={hotelRooms}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                sx={{ border: 0 }}
            />
        </Paper>
        </div>
      </div>
    </div>
    </>
  );
}
