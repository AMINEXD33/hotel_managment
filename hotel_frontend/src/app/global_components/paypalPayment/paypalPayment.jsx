import {
  PAYPALCLIENT,
  API_paypalCaptureOrder,
  API_paypalCreateOrder,
  photobase,
} from "../../../../endpoints/endpoints";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useState } from "react";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function PaypalPayment({roomid, checkIndate, checkOutdate, total}) {
  const [successsBlock, setSussessBlock] = useState(false);
  const [errorBlock, setErrorBlock] = useState(false);

  


  // on order created
  async function createOrder(roomid, checkIndate, checkOutdate, total) {
    try {
      // Format dates to ISO string before sending
      const checkinFormatted = checkIndate ? checkIndate.toISOString() : null;
      const checkoutFormatted = checkOutdate ? checkOutdate.toISOString() : null;

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
          id_room: roomid,
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
      setErrorAlert({
        state: true,
        message: "your paiment was not successful, try again later",
      });
      throw error; // Propagate error to PayPal buttons
    }
  }
  // on paiment approvale
  async function onApprove(data) {
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
        if (response.ok) {
          setSussessBlock(true);
        }
        return response.json();
      })
      .then((orderData) => {})
      .catch((err) => {
        setErrorBlock(true);
      });
  }

  return (
    <>
    <PayPalScriptProvider
      options={{
        debug: true,
        "client-id": PAYPALCLIENT,
      }}
    >
      {
      
      checkIndate !== null && checkOutdate !== null && total !== 0 && (
        <PayPalButtons
          createOrder={async (data, actions) => {
            const orderId = await createOrder(roomid, checkIndate, checkOutdate, total);
            return orderId; // Return the order ID to PayPal
          }}
          onApprove={onApprove}
          disabled={
            checkIndate === null || checkOutdate === null || total === 0
          }
        />
      
      )}
      {
        successsBlock&&
        <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Your reservation is booked, Happy stay!
        </Alert>
      }
      {
        errorBlock&&
        <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        error while booking your reservation
      </Alert>
      }
    </PayPalScriptProvider>
    </>
    
  );
}
