import { useEffect, useState } from "react";
import { API_RankHotelsByReservationCount } from "../../../../../endpoints/endpoints";
import "../ranktables.css";
import { Table } from "react-bootstrap";
import massCall from "@/app/massCall";


export default function RankHotelByReservationCount({data=[]}){
  let componentCalls = useState();
  let [componentData, setComponentData] = useState([]);
  
  useEffect(()=>{
    let promises = massCall([{"url":API_RankHotelsByReservationCount(), "method":"GET"}]);
    promises.then(async promises=>{
      let promis = promises[0];
      if (promis.status === "fulfilled"){
        let data = await promis.value.json();
        data = data.reservations;
        if (Array.isArray(data)){
          setComponentData(data);
        }
        console.log(data);
      }
    }).catch(

    );

  }, []);
  
  
  
  
  
  
  return (
    <Table striped bordered hover className="rankedHotelByCOunt">
      <thead>
        <tr>
          <th>id</th>
          <th>hotel name</th>
          <th>address</th>
          <th>reservation count</th>
        </tr>
      </thead>
      <tbody>
        {
          componentData.map((value, index)=>{
            return (
              <tr key={"tableTok"+index}>
                <td>{value.id_hotel}</td>
                <td>{value.name}</td>
                <td>{value.address}</td>
                <td>{value.reservations}</td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
    )
}