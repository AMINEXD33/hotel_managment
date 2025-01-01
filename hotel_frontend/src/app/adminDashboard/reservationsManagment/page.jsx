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
  API_getReservations,
  API_CalcellReservation
} from "../../../../endpoints/endpoints";
import Confirmation from "@/app/global_components/confirmation/confirmation";
import AddPopupRooms from "@/app/global_components/popUps/addPopUprooms";
import Badge from 'react-bootstrap/Badge';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import ModifyPopUpRooms from "@/app/global_components/popUps/modifyPopUprooms";




function cancelReservation(reservationId, setErrorAlert , setSuccessAlert, setModPop){

  let call = [{url:API_CalcellReservation(), method:"POST", body:{"reservation_id":reservationId}}];
  let promises = massCall(call);
  promises.then(async (promises) => {
    let promis = promises[0];
    if(promis.status === "fulfilled"){
      if (promis.value.status === 200){
        setSuccessAlert({state:true, message:"reservation was canceled !"});
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

  
const paginationModel = { page: 0, pageSize: 5 };
  
export default function ReservationsManagment() {

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
  let [reservations, setReservations] = useState([]);
  let [oldReservations, setOldReservations] = useState([]);

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
    { field: 'hotel_name', headerName: 'hotel name', width: 150 },
    { field: 'id_room', headerName: 'ID room', width: 110 },
    { field: 'id_customer', headerName: 'ID customer', width: 110 },
    { field: 'check_in', headerName: 'Check in', width: 110 },
    { field: 'check_out', headerName: 'Check out', width: 110 },

    { field: 'check_out_note', headerName: 'Check out Note', width: 110 },
    { field: 'check_in_note', headerName: 'Check in Note', width: 110 },
    { field: 'room_stars', headerName: 'room rating', width: 110 },
    { field: 'hotel_stars', headerName: 'hotel rating', width: 110 },

    { field: 'total_price', headerName: 'total Price', width: 90,

      renderCell: (params)=>{
        return(
          <>
            <p>{Number(params.row.total_price).toFixed(2)} $</p>
          </>
        )
      }
    },

    { field: 'type', headerName: 'Type', width: 90 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => {
        return (
          <>
          {
            params.row.type === "current"&&
            <div>
              <Button
                variant="primary"
                color="primary"
                size="small"
                onClick={() =>setModPop({
                  state:true, 
                  id:params.row.id, 
                  roomData: 
                  setConfirmVisible({state:true, args:[
                    params.row.id, 
                    setErrorAlert, 
                    setSuccessAlert,
                    setModPop]})
                })}
                style={{ marginRight: 8 }}
              >
                cancel
              </Button>
            </div>
            }
          </>
          
        );},
    },
  ];

  // load available rooms from when the page is loaded
  useEffect(()=>{
    if (modPopUp.state === true){
      return;
    }
    setDataisLoading(true);
    const callRooms = {url:API_getReservations(), method:"GET"};
    let promises = massCall([callRooms]);
    promises.then(async (promises) => {
      let index = 0;
      for (let promis of promises){
        if(promis.status === "fulfilled"){
          let data = await promis.value.json();
          console.warn("damn data .>>>", data);
          if (Array.isArray(data)) {
            let newR = data.filter((val, inx)=>{ if (val.type === "current"){return true;}})
            let oldR = data.filter((val, inx)=>{ if (val.type === "old"){return true;}})
            setReservations(newR);
            setOldReservations(oldR);
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

      {/**confirmation for canceling reservation*/}
      {confirmVisible.state && 
        <Confirmation
          confirmationTitle={"are you sure you want to cancel this reservation?"}
          confirmationBodyText={"deleting this reservation will cause an email to be sent to the client!."}
          onYesCallBack={(...args)=>{cancelReservation(...args)}}
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
        <h2 className="managmentHeader">Reservations managment</h2>
        <h5 style={{margin:"10px", color:"black"}}>current reservations</h5>
        <div className="dataFilter">
        <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={reservations}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                sx={{ border: 0 }}
            />
        </Paper>
        </div>
        <h5 style={{margin:"10px", color:"black"}}>old reservations</h5>
        <div className="dataFilter">
        <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={oldReservations}
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
