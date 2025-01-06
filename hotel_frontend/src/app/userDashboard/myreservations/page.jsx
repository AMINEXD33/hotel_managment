"use client";
import SideBarNewUi from "@/app/global_components/sidebar/sidebarNewUi";
import "./page.css";
import Footer from "@/app/global_components/footer/footer";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { Container } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Alert from "@mui/material/Alert";
import DoneIcon from '@mui/icons-material/Done';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import {
  API_setReservationReview,
  API_getClientReservations,
} from "../../../../endpoints/endpoints";
export default function () {
  const [value, setValue] = useState(0);
  const [reservations, setReservation] = useState([]);
  const [error, setError] = useState({state:false, msg:""});
  const [success, setSuccess] = useState({state:false, msg:""});
  const [flag, setFlag] = useState(false);


  const handleSubmite = (id , room_rating, hotel_rating, note)=>{
    if (!room_rating || !hotel_rating || !note){
      setSuccess({state:false, msg:""});
      setError({state:false, msg:""});
      setError({state:true, msg:"please fill up the whole form."});
      return;
    }
    const fs = async()=>{
      const response = await fetch(API_setReservationReview(), {
        method:"POST",
        body:JSON.stringify(
          {
            reservation_id:id,
            room_rating:room_rating,
            hotel_rating:hotel_rating,
            checkout_note: note
          }
        )
      });

      if (response.status === 200){
        setSuccess({state:true, msg:"reservation was properly updated"});
        setFlag(true);
      }else{
        setError({state:true, msg:"we wouldn't update this reservation"});
      }

      setTimeout(()=>{
        setSuccess({state:false, msg:""});
        setError({state:false, msg:""});
      }, 6000);
    }
    fs();

  }
  useEffect(() => {
    const fs = async () => {
      try {
        const response = await fetch(API_getClientReservations(), {
          method: "GET",
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          setReservation(data);
        } else {
          console.log(response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fs();
  }, [flag]);
  return (
    <>
      <SideBarNewUi loggedin={true} />
      <Container fluid>
        <Container>
          {
            success.state===true &&
            <Alert variant="filled" severity="success" className="alertt">
            {success.msg}
            </Alert>
          }
          {
            error.state===true &&
            <Alert variant="filled" severity="error" className="alertt">
              {error.msg}
            </Alert> 
          }

        </Container>
        <Container style={{ maxHeight: "700px", overflowY: "scroll" }}>
          {reservations.map((res, index) => {
            console.log("here ", index);
            let thisValues = {id:res.id, hotel_rating:NaN, room_rating:NaN, note:""};
            return (
              <Accordion key={"accordion" + index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography component="span" style={{"display":"flex", "gap":"10px"}}>
                    {dayjs(res.check_in).format("YYYY/MM/DD")}
                    <ArrowForwardIcon />
                    {dayjs(res.check_out).format("YYYY/MM/DD")}
                    <Chip label={res.name} />
                    <Chip
                      label={res.total_price + "$"}
                      color="success"
                      variant="outlined"
                    />
                  {!res.room_stars &&
                  !res.hotel_stars &&
                  !res.check_out_note ?
                    <HourglassBottomIcon/>: <DoneIcon/>}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {!res.room_stars &&
                  !res.hotel_stars &&
                  !res.check_out_note ? (
                    <div className="prividefeedback">
                      <h4>Leave us a rating for the hotel</h4>
                      <Rating
                        key={`hotel-rating-${res.id}`}
                        name="simple-controlled"
                        defaultValue={res.hotel_stars || 0}
                        onChange={(event, newValue) => {
                          thisValues = {...thisValues, "hotel_rating":newValue};
                        }}
                      />
                      <h4>Leave us a rating for the room</h4>
                      <Rating
                        key={`room-rating-${res.id}`}
                        name="simple-controlled"
                        defaultValue={res.hotel_stars || 0}
                        onChange={(event, newValue) => {
                          thisValues = {...thisValues, "room_rating":newValue};
                        }}
                      />
                      <h4 style={{ marginTop: "50px" }}>Leave us a review</h4>
                      <TextField
                        key={`note-${res.id}`}
                        id="filled-multiline-static"
                        label="Multiline"
                        multiline
                        rows={4}
                        defaultValue={res.check_out_note || ""}
                        variant="filled"
                        style={{ width: "50%" }}
                        onChange={(e)=>{
                          thisValues = {...thisValues, "note":e.target.value};
                        }}
                      />
                      <div style={{ paddingTop: "20px" }}>
                        <Button variant="outlined" onClick={()=>{
                            handleSubmite(thisValues.id, thisValues.room_rating, thisValues.hotel_rating, thisValues.note);
                        }}>Submite</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="prividefeedback">
                      <h4>Already set rating for the hotel</h4>
                      <Rating
                        name="simple-controlled"
                        defaultValue={res.hotel_stars}
                        readOnly
                      />
                      <h4>Already set rating for the room</h4>
                      <Rating
                        name="simple-controlled"
                        defaultValue={res.room_stars}
                        readOnly
                      />
                      <h4 style={{ marginTop: "50px" }}>Already set review</h4>
                      <TextField
                        id="filled-multiline-static"
                        label="Multiline"
                        multiline
                        rows={4}
                        variant="filled"
                        style={{ width: "50%" }}
                        disabled
                        defaultValue={res.check_out_note}
                      />
                    </div>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Container>
      </Container>

      <Footer />
    </>
  );
}
