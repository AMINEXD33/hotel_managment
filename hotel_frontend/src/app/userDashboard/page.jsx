"use client";
import SideBarUser from "../global_components/sidebar/sidebarUser";
// skelotons
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { range } from "@mui/x-data-grid/internals";
import { useEffect, useState } from "react";
// inputs
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
//thumbs
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import RoomsDispUser from "../global_components/roomsUserDisplayCard/roomDisplayerUser";
// masscall
import massCall from "../massCall";
import Alert from '@mui/material/Alert';

// endpoints
import {
  API_getRoomsUser, 
  API_getCities, 
  API_getHotelsLite, 
  photobase,

} from "../../../endpoints/endpoints";
import "./page.css";

/**
 * a function that filteres to find rooms with a mix of hotelName, city and rating
 * @param {*} hotelName hotel name (user input)
 * @param {*} city city name (user input)
 * @param {*} rating rating (user input)
 * @param {*} originalArray original data array
 * @param {*} setFilterArray a setter for the filtered array
 */
function filterDataFunction(hotelName, city, rating, originalArray, setFilterArray){
    let stagedFilter = originalArray;
    if (hotelName){
        stagedFilter = stagedFilter.filter((val, index)=>{
            console.warn(val);
            if(val.room.name.includes(hotelName)){
                return true;
            }
            return false;
        })
    }
    if (city){
        stagedFilter = stagedFilter.filter((val, index)=>{
            if(val.room.city.includes(city)){
                return true;
            }
            return false;
        })
    }
    // if (rating){
    //     stagedFilter = stagedFilter.filter((val, index)=>{
    //         if(val.roomRating == rating){
    //             return true;
    //         }
    //         return false;
    //     })
    // }
    setFilterArray(stagedFilter);
}


export default function UserDashboard() {
  // data is loaded state
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  // data
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  // initalData hotels and cities
  const [HotelinitialData, setHotelinitialData] = useState([]);
  const [CityinitialData, setCityinitialData] = useState([]);
  // filter for stars
  const [value, setValue] = useState([0, 5]);

  const [reservationPopUp, setReservationPopUp] = useState({
    state:false
  });
  // filter values
  const [filterData, setFilterData] = useState({
    hotel:"",
    city:"",
    rating:""
  });
  // 
  const [successAlert, setSuccessAlert] = useState({state:false, message:""});
  const [errorAlert, setErrorAlert] = useState({state:false, message:""});
  const [refetchData, setRefetchData] = useState(false);
  useEffect(()=>{
    filterDataFunction(
      filterData.hotel, 
      filterData.city, 
      filterData.rating, 
      data, 
      setFilteredData);
  }, [filterData]);

  const valuetext = (value) => value;

  // laod data for hotels names and cities and rooms
  useEffect(()=>{
    setDataIsLoaded(false);
    function objintoArray(key, objects){
        let tmpArr = [];
        for (let obj of objects){
            tmpArr.push(obj[key]);
        }
        return tmpArr;
    }
    const callHotels = {url:API_getHotelsLite(), method:"GET"};
    const callCities = {url:API_getCities(), method:"GET"};
    const callRooms = {url:API_getRoomsUser(), method:"GET"};

    let promises = massCall([callHotels, callCities, callRooms]);
    promises.then(async (promises) => {
      let index = 0;
      for (let promis of promises){
        if(promis.status === "fulfilled"){
          let data = await promis.value.json();
          console.warn("damn data .>>>", data);
          if (Array.isArray(data)) {
            if (index === 0){
              setHotelinitialData(objintoArray("name", data))
            }
            else if (index === 1){
              setCityinitialData(objintoArray("city", data))
            }
            else if (index === 2){
              setData(data);
              setFilterData(data);
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
    })
    .finally(()=>{setDataIsLoaded(true);})
  },[refetchData])


  return (
    <div className="admindashboard">
      {successAlert.state &&  <Alert severity="success" className="alertH">{successAlert.message}</Alert>}
      {errorAlert.state &&  <Alert severity="error" className="alertH">{errorAlert.message}</Alert>}
      <SideBarUser />
      <h3 id="thisheader">Filter rooms</h3>
      <div className="filterr">
        {/** auto conmlete for hotel */}
        <Autocomplete
          disablePortal
          options={HotelinitialData}
          sx={{ width: 300 }}
          onChange={(e, val)=>(setFilterData({...filterData, hotel:val}))}
          renderInput={(params) => <TextField {...params} label="Hotels" />}
        />
        {/** auto complete for cities */}
        <Autocomplete
          disablePortal
          options={CityinitialData}
          sx={{ width: 300 }}
          onChange={(e, val)=>(setFilterData({...filterData, city:val}))}
          renderInput={(params) => <TextField {...params} label="Cities" />}
        />
        {/** range for filtering by ratings*/}
        <Box sx={{ width: 300 }} >
            <label style={{color:"black"}}>rating</label>
          <Slider
            aria-label="ratings"
            defaultValue={0}
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            onChange={(e, val)=>(setFilterData({...filterData, rating:val}))}
            shiftStep={1}
            step={0.5}
            marks
            min={0}
            max={5}
          />
        </Box>
      </div>
      {
        // Render skeletons if no data was loaded yet
        !dataIsLoaded && (
          <Stack spacing={2} 
          style={{ 
            display: "flex" , 
            flexDirection:"row", 
            gap:"5px", 
            flexWrap:"wrap", 
            justifyContent:"center", 
            alignItems:"center"}}>
            
            {range(0, 5).map((value, index) => {
              return (
                <Skeleton
                  key={`sketetons${value}`}
                  variant="rounded"
                  width={350}
                  height={240}
                  style={{marginTop:"0"}}
                />
              );
            })}
          </Stack>
        )
      }
      {
        // When data is loaded
        dataIsLoaded && 
        <Stack className="stackChanged" spacing={1} style={{ 
            gap:"10px", 
            flexWrap:"wrap", 
            justifyContent:"center",
            alignItems:"center"}}>
        {
        filteredData.map((room, index)=>{
            let targetPhoto = null;
            if (room.room_photos.length > 0){
              targetPhoto = room.room_photos[0].photo;
              console.log("for room index = ", index, "the photos", room.room_photos)
            }else{
              targetPhoto = "/noimagewasfound.png";
            }
            return(
            <RoomsDispUser key={`room${index}`}
            src={photobase+targetPhoto}
            showers={room.room.baths}
            beds={room.room.beds}
            price={room.room.price}
            hotelName={room.room.name}
            roomRating={room.roomRating}
            roomDescription={room.roomDescription}
            roomId={room.roomId}
            available={room.room.available}
            roomSuite={room.room.suites}
            roomCity={room.room.suites}
            allData={data}
            roomData={room}
            setSuccessAlert={setSuccessAlert}
            setErrorAlert={setErrorAlert}
            refetchData={refetchData}
            setRefetchData={setRefetchData}
        />
            )
        })}
        </Stack>
      }
    
    </div>
  );
}
