import AspectRatio from "@mui/joy/AspectRatio";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Favorite from "@mui/icons-material/Favorite";
import Visibility from "@mui/icons-material/Visibility";
import CreateNewFolder from "@mui/icons-material/CreateNewFolder";

import LoyaltyTwoToneIcon from "@mui/icons-material/LoyaltyTwoTone";
import BedIcon from "@mui/icons-material/Bed";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShowerIcon from "@mui/icons-material/Shower";
import ClassIcon from '@mui/icons-material/Class';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReserveAndInfosPopUp from "../popUps/reserveAndInfosPopUp";
import { useEffect, useState } from "react";
export default function RoomsDispUser({
  src,
  beds,
  showers,
  price,
  roomId,
  roomDescription,
  roomPhotos,
  roomRating,
  roomCity,
  roomSuite,
  hotelName,
  hotelId,
  available,
  roomData,
  setSuccessAlert,
  setErrorAlert,
  refetchData,
  setRefetchData
}) {
    
    const [reservationPopUp, setReservationPopUp] = useState({
      state:false
    });
    useEffect(()=>{console.log(reservationPopUp)}, [reservationPopUp])
    useEffect(()=>{
      const dc = document.getElementsByTagName("html");
      dc[0].style.overflowY = "auto";
    },[reservationPopUp]);
  return (
    <>
    <Card  variant="plain" sx={{ width: 300, bgcolor: "initial", p: 0 }}>
      <Box sx={{ position: "relative" }}>
        <AspectRatio ratio="4/3">
          <figure >
            <img
              src={src}
              srcSet={src}
              loading="lazy"
              alt="room photo"
            />
          </figure>
        </AspectRatio>
        <CardCover
          className="gradient-cover"
          onClick={()=>{
            if (available){
              setReservationPopUp({state:true})
            }  
            
          }}
          sx={{
            "&:hover, &:focus-within": {
              opacity: 1,
            },
            opacity: 0,
            transition: "0.1s ease-in",
            background:
              "linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%)",
          }}
        >
          {/* The first box acts as a container that inherits style from the CardCover */}
          <div>
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexGrow: 1,
                alignSelf: "flex-end",
              }}
            >
              <Typography level="h2" noWrap sx={{ fontSize: "lg" }}>
                <Link
                  href="#dribbble-shot"
                  overlay
                  underline="none"
                  sx={{
                    color: "#fff",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    display: "block",
                  }}
                >
                  {hotelName}
                </Link>
              </Typography>
            {
                available === 1?
                <IconButton
                size="sm"
                variant="solid"
                color="rgb(26, 255, 163)"
                sx={{ ml: "auto", bgcolor: "rgba(26, 255, 163, 20%)" }}
              >
                {price}$/h
                <AttachMoneyIcon titleAccess="price" color="success" />
              </IconButton>
              :
              <Chip
                variant="outlined"
                color="neutral"
                size="sm"
                sx={{ borderRadius: "sm", py: 0.25, px: 0.5 , backgroundColor:"rgba(230, 0, 0, 40%)", color:"white"}}
              >
                reserved
              </Chip>
            }
            
            </Box>
          </div>
        </CardCover>
      </Box>
      <Box
      sx={{ display: "flex", gap: 1, justifyContent:"start",alignItems: "center"}}
        >
        <Chip
          variant="outlined"
          color="neutral"
          size="sm"
          sx={{ borderRadius: "sm", py: 0.25, px: 0.5 }}
        >
          {beds}
          <BedIcon />
        </Chip>
        <Chip
          variant="outlined"
          color="neutral"
          size="sm"
          sx={{ borderRadius: "sm", py: 0.25, px: 0.5 }}
        >
          {showers}
          <ShowerIcon />
        </Chip>
      </Box>
      <Box
      sx={{ display: "flex", gap: 1, justifyContent:"start",alignItems: "center"}}
        >
        <Chip
          variant="outlined"
          color="neutral"
          size="sm"
          sx={{ borderRadius: "sm", py: 0.25, px: 0.5 }}
        >
            {roomSuite}
          <ClassIcon/>
        </Chip>

        <Chip
          variant="outlined"
          color="neutral"
          size="sm"
          sx={{ borderRadius: "sm", py: 0.25, px: 0.5 }}
        >
            {roomCity}
          <LocationOnIcon/>
        </Chip>
        
      </Box>
    </Card>
    {reservationPopUp.state &&
      <ReserveAndInfosPopUp 
      roomData={roomData} 
      setPopUpvisibility={setReservationPopUp}
      setSuccessAlert={setSuccessAlert}
      setErrorAlert={setErrorAlert}
      refetchData={refetchData}
      setRefetchData={setRefetchData}
      />
    }
    


    </>
  );
}
