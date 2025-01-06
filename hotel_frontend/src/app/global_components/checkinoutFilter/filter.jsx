"use client";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { API_getAllRooms, API_getCities, API_getRoomsUser, API_reservedRanges } from "../../../../endpoints/endpoints";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import massCall from "@/app/massCall";
export default function Filter({
  without, 
  checkIn, 
  setCheckin, 
  checkOut, 
  setCheckOut,
  id_room,
  setData,
  setFilteredData,
  data
}){
    const [checkIndate, setCheckIndate] = useState(dayjs());
    const [checkOutdate, setCheckoutdate] = useState();
    const [reservedRanges, setReservedRanges] = useState([]);
    const [error, setError] = useState(false);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const shouldDisableDate1 = (date) => {
      
        if (date.isBefore(checkIndate, "day")){
          return true;
        }
        for (const range of reservedRanges) {
          if (date.isBetween(
            dayjs(range.check_in), 
            dayjs(range.check_out), 
            "day",
            "[]")
          ) {
            return true;
          }
        }
      
      return false
      };
      
    const shouldDisableDate2 = (date) => {
        if (!dayjs(checkIndate).isValid()) {
          return true;
        }
        for (const range of reservedRanges) {
          if (date.isBetween(
            dayjs(range.check_in), 
            dayjs(range.check_out), 
            "day",
            "[]")
          ) {
            return true;
          }
        }
        return !date.isAfter(checkIndate, "day");
      };
    function validateThenAccept(checkoutvalue){
      if (checkIn && checkoutvalue) {
        for (let range of reservedRanges) {
          // Check if there is an overlap
          if (
            (dayjs(checkIn).isBefore(dayjs(range.check_out), "day") && 
             dayjs(checkoutvalue).isAfter(dayjs(range.check_in), "day")) ||
            (dayjs(checkIn).isBetween(dayjs(range.check_in), dayjs(range.check_out), "day", "[]")) ||
            (dayjs(checkoutvalue).isBetween(dayjs(range.check_in), dayjs(range.check_out), "day", "[]"))
          ) {
            console.log("overlap");
            setError(true);  // Set error if an overlap is found
            return;  // Exit function after finding an overlap
          }
        }
      }
    
      console.log("validated no overlap");
      setError(false);  // No overlap, reset error
      setCheckOut(checkoutvalue);  // Set the check-out value
    }
    useEffect(()=>{
      if (typeof setCheckin === "function"){
        setCheckin(dayjs());
      }
    },[])
    // get all date ranges already reserved for this room
    // only executed in the booking page
    useEffect(()=>{
      if (!id_room){
        return;
      }
      const res = async()=>{
        const header = await fetch(API_reservedRanges(), {
          method:"POST",
          body:JSON.stringify({"id_room": id_room})
        })
        if (header.ok){
          const data = await header.json();
          console.log("ranges >>> ", data);
          setReservedRanges(data);
        }
      }
      res();
    }, [])

    // only executed in the brows page
    useEffect(()=>{
      // if (without !== "city"){
      //   return;
      // }
      const callCities = { url: API_getCities(), method: "GET" };
      const callRooms = { url: API_getRoomsUser(), method: "GET" };
      let promises = massCall([callCities, callRooms]);
      promises
      .then(async (promises) => {
        let index = 0;
        for (let promis of promises){
          if (promis.status === "fulfilled") {
            let data = await promis.value.json();
            console.warn("damn data .>>>", data);
            if (Array.isArray(data)) {
              if (index === 0){
                setCities(data);
              }else if (index === 1){
                setData(data);
                setFilteredData(data);
              }
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
    }, []);

    // set the new data if a city is selected
    useEffect(()=>{
      if (!data){
        return;
      }
      let new_filteredlist = data.filter((val, index)=>{
        if (val.room.city === selectedCity){
          return true;
        }
        return false;
      });
      setFilteredData(new_filteredlist);
    },[selectedCity]);

    useEffect(()=>{
      console.log("the reservation ranges", reservedRanges);
    }, [reservedRanges])
    return (
        <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {
            error&&
            <Alert style={{margin:"20px"}} severity="error">please select a valid range</Alert>
            
          }
          {
            reservedRanges.length > 0 &&
            <div style={{"display":"flex", "flexDirection":"column", "flexWrap":"wrap", "gap":"10px"}}>
            <DatePicker
            label="Check-in Date"
            value={checkIndate || null}
            onChange={(newValue) => {
              setCheckIndate(newValue);
              setCheckin(newValue);
              
            }}
            shouldDisableDate={shouldDisableDate1}
            renderInput={(params) => <TextField {...params} />}
          />

          <DatePicker
            label="Check-out Date"
            value={checkOutdate || null}
            onChange={(newValue) => {
              setCheckoutdate(newValue);
              validateThenAccept(newValue);
            }}
            shouldDisableDate={shouldDisableDate2}
            renderInput={(params) => <TextField {...params} />}
          />
            </div>
          }
          
        </LocalizationProvider>
       {
        without!=="city"&&        <Autocomplete
        disablePortal
        options={cities}
        sx={{ width: 300 }}
        onChange={(e, value)=>{setSelectedCity(value)}}
        renderInput={(params) => <TextField {...params} label="City" />}
        />
       }
            

        </>
    )
}