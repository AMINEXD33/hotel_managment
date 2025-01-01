



"use client";

import SideBar from "@/app/global_components/sidebar/sidebar";
import "../adminDash.css";
import React, { useEffect, useState } from "react";
import {Col, Alert, Button } from "react-bootstrap";
import massCall from "@/app/massCall";
import { 
  API_getAllRooms,
  API_deleteUser,
  API_getAllUsers,
  API_modifyUserAuthority
} from "../../../../endpoints/endpoints";
import Confirmation from "@/app/global_components/confirmation/confirmation";
import AddPopupRooms from "@/app/global_components/popUps/addPopUprooms";
import Switch from '@mui/material/Switch';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import ModifyPopUpusers from "@/app/global_components/popUps/modifyPopUpusers";

function deleteUser(userId, setErrorAlert , setSuccessAlert, setModPop){

  let call = [{url:API_deleteUser(), method:"POST", body:{"user_id":userId}}];
  let promises = massCall(call);
  promises.then(async (promises) => {
    let promis = promises[0];
    if(promis.status === "fulfilled"){
      if (promis.value.status === 200){
        setSuccessAlert({state:true, message:"user was deleted !"});
        // change state to refetch the changes
        setModPop({state:false,id:NaN, roomData:{}})
      }else{
        setErrorAlert({state:true, message:"can't delete this user, it may still have some reservations!"})
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

function findUser(id , data){
  let user_ = {};
  data.forEach(user => {
    if (user["id"] === id){
      user_ = user;
    }
  });

  return user_;

}

function changeAuthority(event, value, clientID, setSuccessAlert, setErrorAlert){
  console.log(value," CLIENT ID ", clientID);
  let call = [{url:API_modifyUserAuthority(), method:"POST", body:{"client_id":clientID,"is_admin":value}}];
  let promises = massCall(call);
  promises.then(async (promises) => {
    let promis = promises[0];
    if(promis.status === "fulfilled"){
      if (promis.value.status === 200){
        setSuccessAlert({state:true, message:"Authority was changed !"});
        // change state to refetch the changes
        setModPop({state:true,id:NaN, roomData:{}})
      }else{
        setErrorAlert({state:true, message:"can't change the Authority of this client!"})
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
  
export default function AccountManagment() {

  // state of the modifie popup
  const [modPopUp, setModPop] = useState({
    state: false,
    id:NaN,
    userData : {}
  })

  const [addPopUp, setAddPop] = useState({
    state: false,
  })

  // hotels data
  let [usersAccount, setUsersAccount] = useState([]);

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
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'lastname', headerName: 'Last Name', width: 110 },
    { field: 'email', headerName: 'Email', width: 90},
    { field: 'is_admin', headerName: 'Is admin', width: 90,
      renderCell:(params)=>{
        const label = { inputProps: { 'aria-label': 'Color switch demo' } };
        const user = findUser(params.row.id, usersAccount);
        return(
          <Switch 
          {...label} 
          defaultChecked = {user.is_admin? user.is_admin: false}
          onChange={(e, value)=>{changeAuthority(
            e, 
            value, 
            params.row.id,
            setSuccessAlert, 
            setErrorAlert)}} 
  
          
          />
        )
      }
    },
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
                userData: findUser(params.row.id, usersAccount)
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
    const callRooms = {url:API_getAllUsers(), method:"GET"};
    let promises = massCall([callRooms]);
    promises.then(async (promises) => {
      let index = 0;
      for (let promis of promises){
        if(promis.status === "fulfilled"){
          let data = await promis.value.json();
          console.warn("damn data .>>>", data);
          if (Array.isArray(data)) {
            setUsersAccount(data);
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
        <ModifyPopUpusers 
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

      {/**confirmation for deleting a user */}
      {confirmVisible.state && 
        <Confirmation
          confirmationTitle={"are you sure you want to delete this user?"}
          confirmationBodyText={"deleting this user will result in her/his permenent loss!."}
          onYesCallBack={(...args)=>{deleteUser(...args)}}
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
        <h2 className="managmentHeader">Users managment</h2>
        <div style={{display:"block", margin:"15px"}}>
        </div>
        <div className="dataFilter">
        <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={usersAccount}
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



