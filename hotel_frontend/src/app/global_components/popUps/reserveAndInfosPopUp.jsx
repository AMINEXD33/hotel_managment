import CloseIcon from "@mui/icons-material/Close";
import "./popups.css";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LockIcon from "@mui/icons-material/Lock";
import Carousel from "react-bootstrap/Carousel";
import ListGroup from "react-bootstrap/ListGroup";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import BadgeIcon from "@mui/icons-material/Badge";
import ShowerIcon from '@mui/icons-material/Shower';
import BedIcon from '@mui/icons-material/Bed';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import {
  PAYPALCLIENT,
  API_paypalCaptureOrder,
  API_paypalCreateOrder,
  photobase,
} from "../../../../endpoints/endpoints";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { colors } from "@mui/material";
import Image from "next/image";

export default function ReserveAndInfosPopUp({ 
  roomData, 
  setPopUpvisibility,
  setErrorAlert,
  setSuccessAlert,
  refetchData,
  setRefetchData
}) {
  console.warn("this is the room data", roomData);
  const today = dayjs();
  const minDate = today.subtract(0, "day"); // Minimum date allowed
  const maxDate = today.add(3, "day"); // Optional: Max date for the range

  const [checkIndate, setCheckIndate] = useState(dayjs());
  const [checkOutdate, setCheckoutdate] = useState();
  const [total, setTotal] = useState(0);

  const [rerenderPaypalBtn, setRerenderPaypalBtn] = useState(false);

  const shouldDisableDate1 = (date) => {
    return (
      date.isBefore(checkIndate, "day") ||
      date.isAfter(checkIndate.add(3, "day"), "day")
    );
  };
  const shouldDisableDate2 = (date) => {
    if (!dayjs(checkIndate).isValid()) {
      return true;
    }
    return !date.isAfter(checkIndate, "day");
  };

  useEffect(() => {
    if (!checkIndate || !checkOutdate) {
      return;
    }
    // calculate total
    setTotal(checkOutdate.diff(checkIndate, "hours") * roomData.room.price);
    setRerenderPaypalBtn(false);
  }, [checkIndate, checkOutdate]);

  useEffect(()=>{
    const dc = document.getElementsByTagName("html");
    dc[0].style.overflowY = "hidden";
  },[]);
  // on order created
  async function createOrder() {
    try {
      // Format dates to ISO string before sending
      const checkinFormatted = checkIndate ? checkIndate.toISOString() : null;
      const checkoutFormatted = checkOutdate
        ? checkOutdate.toISOString()
        : null;

      return fetch(API_paypalCreateOrder(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify({
          amount: total,
          checkin: checkinFormatted,
          checkout: checkoutFormatted,
          id_room: roomData?.room?.id,
        }),
      })
        .then(async (response) => {
          let dt = await response.json();
          return dt;
        })
        .then((order) => {
          console.log("ORDER ::::::: ", order.orderID);
          return order.orderID;
        });
    } catch (error) {
      console.error("Error creating order:", error);
      setErrorAlert({state:true, message:"your paiment was not successful, try again later"});
      throw error; // Propagate error to PayPal buttons
    }
  }
  // on paiment approvale
  async function onApprove(data) {
    console.warn("WTFFFF");
    return fetch(API_paypalCaptureOrder(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    })
      .then((response) => {
        console.log("DATA PASSED TO APPROAVEL", data);
        if (response.ok){
          setSuccessAlert({state:true, message:"your paiment was successful"});
        }
        return response.json();
      })
      .then((orderData) => {
      }).catch(err=>{
        setErrorAlert({state:true, message:"your paiment was not successful, try again later"});
      })
  }

  return (
    <div className="reservationPopup">
      <IconButton
        className="closeBtn"
        color="primary"
        aria-label="add to shopping cart"
        onClick={() => {
          setPopUpvisibility({ state: false });
          setRefetchData(!refetchData);
        }}
      >
        <CloseIcon color="danger" sx={{ fontSize: 30, color: "red" }} />
      </IconButton>
      <div className="reservePart">
        <h5 style={{ color: "black" }}>Select your stay with us:</h5>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Check-in Date"
            value={checkIndate || null}
            onChange={(newValue) => setCheckIndate(newValue)}
            shouldDisableDate={shouldDisableDate1}
            renderInput={(params) => <TextField {...params} />}
          />

          <DatePicker
            label="Check-out Date"
            value={checkOutdate || null}
            onChange={(newValue) => setCheckoutdate(newValue)}
            shouldDisableDate={shouldDisableDate2}
            renderInput={(params) => <TextField {...params} />}
          />
          {/*PAYPAL integration button*/}
          {rerenderPaypalBtn ? (
            <PayPalScriptProvider
              options={{
                debug: true,
                "client-id": PAYPALCLIENT,
              }}
            >
              {checkIndate !== null && checkOutdate !== null && total !== 0 && (
                <PayPalButtons
                  createOrder={async (data, actions) => {
                    const orderId = await createOrder();
                    return orderId; // Return the order ID to PayPal
                  }}
                  onApprove={onApprove}
                  disabled={
                    checkIndate === null || checkOutdate === null || total === 0
                  }
                />
              )}
            </PayPalScriptProvider>
          ) : (
            <IconButton
              color="primary"
              aria-label="add to shopping cart"
              onClick={() => {
                setRerenderPaypalBtn(true);
              }}
            >
              <LockIcon color="success" x={{ fontSize: 80 }} />
            </IconButton>
          )}
        </LocalizationProvider>
      </div>
      <div className="reservePart">
        <h5>Total</h5>
        {total}$
      </div>

      <div
        className="more_data_show hotelDatashow"
        style={{ color: "black", marginTop: "10px" }}
      >
        <h3 style={{textDecoration:"underline"}}>About the hotel</h3>
        <Carousel slide={false} style={{ borderRadius: "20px" }}>
          {roomData.hotel_photos.map((photodata, index) => {
            return (
              <Carousel.Item
                key={"hotelPhoto" + index}
                style={{ borderRadius: "20px" }}
              >
                <Image
                  width={300}
                  height={300}
                  src={photobase + photodata.photo}
                  layout="responsive"
                  alt="hotelphoto"
                />
              </Carousel.Item>
            );
          })}
        </Carousel>
        <ListGroup style={{marginTop:"10px"}}>
          <ListGroup.Item>
            Hotel Name
            <BadgeIcon />: <strong>{roomData.room.name}</strong>
          </ListGroup.Item>
          <ListGroup.Item>
            Hotel email
            <AlternateEmailIcon />: <strong>{roomData.room.email}</strong>
          </ListGroup.Item>
          <ListGroup.Item>
            Hotel address: <strong>{roomData.room.address}</strong>
          </ListGroup.Item>
          <ListGroup.Item>
            Hotel phone
            <LocalPhoneIcon />: <strong>{roomData.room.phone}</strong>
          </ListGroup.Item>
          <ListGroup.Item>
            Hotel city <LocationOnIcon />: <strong>{roomData.room.city}</strong>
          </ListGroup.Item>
          <ListGroup.Item>Hotel description</ListGroup.Item>
        </ListGroup>
      </div>

      <div
        className="more_data_show roomDatashow"
        style={{ color: "black", marginTop: "50px" }}
      >
        <h3 style={{textDecoration:"underline"}}>About the room</h3>
        <Carousel slide={false} style={{ borderRadius: "20px" }}>
          {roomData.room_photos.map((photodata, index) => {
            return (
              <Carousel.Item
                key={"hotelPhoto" + index}
                style={{ borderRadius: "20px" }}
              >
                <Image
                  width={300}
                  height={300}
                  src={photobase + photodata.photo}
                  layout="responsive"
                  alt="hotelphoto"
                />
              </Carousel.Item>
            );
          })}
        </Carousel>
        <ListGroup style={{marginTop:"10px"}}>
          <ListGroup.Item>
            Showers
            <ShowerIcon />: <strong>{roomData.room.baths}</strong>
          </ListGroup.Item>
          <ListGroup.Item>
            Beds
            <BedIcon />: <strong>{roomData.room.beds}</strong>
          </ListGroup.Item>
          <ListGroup.Item>
            hourly price
            <LocalOfferIcon />: <strong>{roomData.room.price}$/h</strong>
          </ListGroup.Item>

          <ListGroup.Item>
            suite: <strong>{roomData.room.suites}</strong>
          </ListGroup.Item>

          <ListGroup.Item>
            Hotel city <LocationOnIcon />: <strong>{roomData.room.city}</strong>
          </ListGroup.Item>
          <ListGroup.Item>Hotel description</ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
}
