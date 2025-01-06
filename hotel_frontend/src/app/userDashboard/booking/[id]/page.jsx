"use client";

import SideBarNewUi from "@/app/global_components/sidebar/sidebarNewUi";
import "../../../global_components/sidebar/custom.css";
import "./page.css";
import { Container } from "react-bootstrap";
import Image from "next/image";
import { nextPhotoBase, photobase } from "../../../../../endpoints/endpoints";
import Filter from "@/app/global_components/checkinoutFilter/filter";
import Footer from "@/app/global_components/footer/footer";
import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import FmdGoodSharpIcon from "@mui/icons-material/FmdGoodSharp";
import ShowerSharpIcon from "@mui/icons-material/ShowerSharp";
import KingBedSharpIcon from "@mui/icons-material/KingBedSharp";
import TypeSpecimenSharpIcon from "@mui/icons-material/TypeSpecimenSharp";
import Link from "next/link";
import Carousel from "react-bootstrap/Carousel";
import TextsmsIcon from "@mui/icons-material/Textsms";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { API_getRoomUserById } from "../../../../../endpoints/endpoints";
import StepperCustom from "@/app/global_components/stepper/stepper";
import { useParams } from "next/navigation";

import {
  Bed,
  Email,
  LocalActivity,
  LocationCity,
  Phone,
  Tag,
} from "@mui/icons-material";
import { Textarea } from "@mui/joy";

export default function BookingPage() {
  const [data, setData] = useState(null);
  const params = useParams();
  useEffect(() => {
    const fs = async () => {
      const header = await fetch(API_getRoomUserById(), {
        method: "POST",
        body: JSON.stringify({ room_id: params.id }),
      });
      if (header.ok) {
        let JsonData = await header.json();
        if (Array.isArray(JsonData)){
          setData(JsonData[0]);
        }else{
          setData(JsonData);
        }
        console.log(data);
      }
    };
    fs();
  }, []);

  return (
    <>
      <SideBarNewUi loggedin={true} />
      {data ?
      <>
      <Container
        fluid
        style={{ backgroundColor: "white", padding: "50px", marginTop: "50px" }}
      >
        <Container>
          <h1 style={{ color: "black" }}>Book Now</h1>
          <StepperCustom id_room={params.id} />
        </Container>
      </Container>
      {/** hotel photos slider */}
      <Container
        fluid
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "150px",
        }}
      >
        <Container className="photodisplay">
          <h1 className="styledheader">About the hotel</h1>
          <Carousel>
            {
              data && data.hotel_photos.length > 0&&
              data.hotel_photos.map((photo, index) => {

              return (
      
                <Carousel.Item style={{ width: "100%", height: "700px" }} key={"photo"+index}>
                  <img
                    src={photobase + photo.photo}
                    width={"100%"}
                    height={"auto"}
                  />
                  <Carousel.Caption>
                    <h3>Hotel Photos</h3>
                    <p>Preview of the hotel.</p>
                  </Carousel.Caption>
                </Carousel.Item>
  
              );
            })}
          </Carousel>
        </Container>
      </Container>
      {/**about the hotel */}
      <Container
        className="hotelinfos_container"
        fluid
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container className="hotelinfos">
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              color: "black",
            }}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Tag />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Hotel Name" secondary={data.room.name} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Email />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Email" secondary={data.room.email} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Phone />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Phone number" secondary={data.room.phone} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LocationCity />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="City" secondary={data.room.city} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <TextsmsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="About" />
            </ListItem>
            <Textarea
              disabled
              minRows={2}
              size="lg"
              variant="outlined"
              color="black"
              value={
                data.room.hotel_description
              }
            />
          </List>
        </Container>
      </Container>

      {/* room photos slider*/}
      <Container
        fluid
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "150px",
        }}
      >
        <Container className="photodisplay">
          <h1 className="styledheader">About the Room</h1>
          <Carousel>
          {
              data && data.room_photos.length > 0&&
              data.room_photos.map((photo, index) => {

              return (
      
                <Carousel.Item style={{ width: "100%", height: "700px" }} key={"photo"+index}>
                  <img
                    src={photobase + photo.photo}
                    width={"100%"}
                    height={"auto"}
                  />
                  <Carousel.Caption>
                    <h3>Room Photos</h3>
                    <p>Preview of the Room.</p>
                  </Carousel.Caption>
                </Carousel.Item>
  
              );
            })}
          </Carousel>
        </Container>
      </Container>

      {/** about the room */}
      <Container
        className="hotelinfos_container"
        fluid
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container className="hotelinfos">
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              color: "black",
            }}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Bed />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Beds" secondary={data.room.beds} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <ShowerSharpIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Showers" secondary={data.room.baths} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <TypeSpecimenSharpIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Suite" secondary={data.room.suites} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <TextsmsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="About" />
            </ListItem>
            <Textarea
              disabled
              minRows={2}
              size="lg"
              variant="outlined"
              color="black"
              value={
                data.room.description
              }
            />
          </List>
        </Container>
      </Container> </>: <LinearProgress/>}
      <Footer />
    </>
  );
}
