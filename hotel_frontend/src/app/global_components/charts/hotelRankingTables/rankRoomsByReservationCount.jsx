import { useEffect, useState } from "react";
import { API_classedRoomsByReservationsCount, API_getHotelsLite } from "../../../../../endpoints/endpoints";
import "../ranktables.css";
import { Table } from "react-bootstrap";
import massCall from "@/app/massCall";
import Form from "react-bootstrap/Form";
import Alert from 'react-bootstrap/Alert';

export default function RankRoomsByReservationCount({}) {
  let [hotelSelected, setHotelSelected] = useState(NaN);
  let [componentData, setComponentData] = useState([]);
  let [options, setOption] = useState([]);
  useEffect(() => {
    if (!Number.isInteger(Number(hotelSelected))){
        return;
    }
    console.log(hotelSelected);
    let promises = massCall([
      { url: API_classedRoomsByReservationsCount(), method: "POST", body:{"hotel_id": hotelSelected}},
    ]);
    promises
      .then(async (promises) => {
        let promis = promises[0];
        if (promis.status === "fulfilled") {
          let data = await promis.value.json();
          data = data.reservations;
          if (Array.isArray(data)) {
            setComponentData(data);
          }
          console.log(data);
        }
      })
      .catch();
  }, [hotelSelected]);

  useEffect(()=>{
    let promises = massCall([
        { url: API_getHotelsLite(), method: "GET" },
      ]);
      promises
        .then(async (promises) => {
          let promis = promises[0];
          if (promis.status === "fulfilled") {
            let data = await promis.value.json();
            
            if (Array.isArray(data)) {
                setOption(data);
            }else{
                console.warn("the data is not an array then it's not valid");
            }
            
          }
        })
        .catch(err=>{
            console.warn("can't get hotels lite liste", err);
        });
  }, []);

  return (
    <>
      <Form.Select 
      aria-label="Default select 
      example" 
      style={{ width: "30%" , marginBottom:"5px"}}
      onChange={(e)=>{setHotelSelected(e.target.value)}}
      >
         <option value={null}>select hotel</option>
        {
            options.map((value, index)=>{
               
                console.log("here",value);
                return (
                    <option key={"hotelID"+index} value={value.id}>{value.id}{" "+value.name}</option>
                )
            })
        }
      </Form.Select>
      {
        Number.isInteger(Number(hotelSelected))?
        <Table striped bordered hover className="rankedHotelByCOunt">
        <thead>
          <tr>
            <th>room id</th>
            <th>reservations</th>
          </tr>
        </thead>
        <tbody>
          {componentData.map((value, index) => {
            return (
              <tr key={"tableTok" + index}>
                <td>{value.room}</td>
                <td>{value.reservations}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>:
      <div className="noHotelSElected">
            <Alert variant={"primary"}>
            Please select a Hotel
            </Alert>
      </div>
      }
    </>
  );
}
