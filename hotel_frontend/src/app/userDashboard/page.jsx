"use client";
import SideBarUser from "../global_components/sidebar/sidebarUser";
import "./page.css";
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
// endpoints
import {API_getHotels, API_getCities, API_getHotelsLite} from "../../../endpoints/endpoints";


const tmpData = [
    {
        showers: 3,
        beds: 2,
        price: 120,
        suites: "presidential",
        roomRating: 4,
        roomPhoto: "https://localhost/photo1.jpg",
        hotelName:"test hotel",
        city:"test2",
        roomDescription:"lorema iua liasugd ailagsd alisdga sdliagsd alisdgas dlaisdgas ildasgdiasldgais diasdgas dailsdga sdilaugsd asldiasdgas dliasgd asdliasdga dlaisdgfas dlaisdagilsg aldiyga dlaisdga ;odgaiusdg ailsgd ailsugdaiusgda suidasildgails diasdas lida sid aisdugas diasudga sdiasugd aslidausgd asidasgd alsidgas dalisdugas dliasdugas dlaisdga sdlaisudga sdlaisdugas d;aisduagsd lsaib"
    },
    {
        showers: 3,
        beds: 2,
        price: 120,
        suites: "presidential",
        roomRating: 4,
        roomPhoto: "https://localhost/photo3.jpg",
        hotelName:"Dr. Kelley Jenkins Vaaa",
        city:"RABAT",
        roomDescription:"lorema iua liasugd ailagsd alisdga sdliagsd alisdgas dlaisdgas ildasgdiasldgais diasdgas dailsdga sdilaugsd asldiasdgas dliasgd asdliasdga dlaisdgfas dlaisdagilsg aldiyga dlaisdga ;odgaiusdg ailsgd ailsugdaiusgda suidasildgails diasdas lida sid aisdugas diasudga sdiasugd aslidausgd asidasgd alsidgas dalisdugas dliasdugas dlaisdga sdlaisudga sdlaisdugas d;aisduagsd lsaib"
    },
    {
        showers: 3,
        beds: 2,
        price: 120,
        suites: "presidential",
        roomRating: 4,
        roomPhoto: "https://localhost/photo2.jpg",
        hotelName:"Dr. Kelley Jenkins Vaaa",
        city:"East Malvinaland",
        roomDescription:"lorema iua liasugd ailagsd alisdga sdliagsd alisdgas dlaisdgas ildasgdiasldgais diasdgas dailsdga sdilaugsd asldiasdgas dliasgd asdliasdga dlaisdgfas dlaisdagilsg aldiyga dlaisdga ;odgaiusdg ailsgd ailsugdaiusgda suidasildgails diasdas lida sid aisdugas diasudga sdiasugd aslidausgd asidasgd alsidgas dalisdugas dliasdugas dlaisdga sdlaisudga sdlaisdugas d;aisduagsd lsaib"
    },
    {
        showers: 3,
        beds: 2,
        price: 120,
        suites: "presidential",
        roomRating: 4,
        roomPhoto: "https://localhost/photo3.jpg",
        hotelName:"test hotel",
        city:"Harrischester",
        roomDescription:"lorema iua liasugd ailagsd alisdga sdliagsd alisdgas dlaisdgas ildasgdiasldgais diasdgas dailsdga sdilaugsd asldiasdgas dliasgd asdliasdga dlaisdgfas dlaisdagilsg aldiyga dlaisdga ;odgaiusdg ailsgd ailsugdaiusgda suidasildgails diasdas lida sid aisdugas diasudga sdiasugd aslidausgd asidasgd alsidgas dalisdugas dliasdugas dlaisdga sdlaisudga sdlaisdugas d;aisduagsd lsaib"
    }
]

function filterDataFunction(hotelName, city, rating, originalArray, setFilterArray){
    let stagedFilter = originalArray;
    if (hotelName){
        stagedFilter = stagedFilter.filter((val, index)=>{
            if(val.hotelName.includes(hotelName)){
                return true;
            }
            return false;
        })
    }
    if (city){
        stagedFilter = stagedFilter.filter((val, index)=>{
            if(val.city.includes(city)){
                return true;
            }
            return false;
        })
    }
    if (rating){
        stagedFilter = stagedFilter.filter((val, index)=>{
            if(val.roomRating == rating){
                return true;
            }
            return false;
        })
    }
    setFilterArray(stagedFilter);
}
export default function UserDashboard() {
  // data is loaded state
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  // data
  const [data, setData] = useState(tmpData);
  const [filteredData, setFilteredData] = useState(data);
  // initalData hotels and cities
  const [HotelinitialData, setHotelinitialData] = useState([]);
  const [CityinitialData, setCityinitialData] = useState([]);
  // filter for stars
  const [value, setValue] = useState([0, 5]);
  // filter values
  const [filterData, setFilterData] = useState({
    hotel:"",
    city:"",
    rating:""
  });
  useEffect(()=>{
    filterDataFunction(filterData.hotel, filterData.city, filterData.rating, data, setFilteredData);
  }, [filterData]);

  const valuetext = (value) => value;

  useEffect(() => {
    setTimeout(()=>{
        setDataIsLoaded(true);
    }, 2000);

  }, []);

  // laod data for hotels names and cities
  useEffect(()=>{
    function objintoArray(key, objects){
        let tmpArr = [];
        for (let obj of objects){
            tmpArr.push(obj[key]);
        }
        return tmpArr;
    }
    const callHotels = {url:API_getHotelsLite(), method:"GET"};
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
                setHotelinitialData(objintoArray("name", data))
            }
            else if (index === 1){
                setCityinitialData(objintoArray("city", data))
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
  },[])

  return (
    <div className="admindashboard">
      <SideBarUser />
      <h3 id="thisheader">Filter rooms</h3>
      <div className="filter">
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
                  width={500}
                  height={410}
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
        <Stack className="stackChanged" spacing={2} style={{ 
            gap:"5px", 
            flexWrap:"wrap", 
            justifyContent:"center", 
            alignItems:"center"}}>
        {
        filteredData.map((room, index)=>{
            return(
            <RoomsDispUser key={`room${index}`}
            
            src={room.roomPhoto}
            showers={room.showers}
            beds={room.beds}
            price={room.price}
            hotelName={room.hotelName}
            roomRating={room.roomRating}
            roomDescription={room.roomDescription}
        />
            )
        })}
        </Stack>
      }
    
    </div>
  );
}
