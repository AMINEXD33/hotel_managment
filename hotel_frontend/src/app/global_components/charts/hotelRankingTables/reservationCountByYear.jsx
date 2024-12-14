import { useEffect, useState } from "react";

import {
    API_reservationCountByYear,
  API_availableYears,
  API_getHotelsLite
} from "../../../../../endpoints/endpoints";
import "../ranktables.css";
import massCall from "@/app/massCall";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



  
export default function ReservationCountByYear({}) {
  let [dataYear, setDataYear] = useState(NaN);
  let [componentData, setComponentData] = useState([]);
  let [yearsOptions, setYearsOptions] = useState([]);
  
  useEffect(() => {
    console.log("data year", dataYear);
    if (!Number.isInteger(Number(dataYear))) {
      return;
    }
    console.log(dataYear);
    let promises = massCall([
      {
        url: API_reservationCountByYear(),
        method: "POST",
        body: { year: dataYear},
      },
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
  }, [dataYear]);

  useEffect(() => {
    let promises = massCall([
      { url: API_availableYears(), method: "GET" },
    ]);
    promises
      .then(async (promises) => {
        let promis = promises[0];
        if(promis.status === "fulfilled"){
          let data = await promis.value.json();
          data = data.reservations;
          console.warn("damn data .>>>", data);
          if (Array.isArray(data)) {
            setYearsOptions(data);
          } else {
            console.warn("the data is not an array then it's not valid");
          }
        }
      })
      .catch((err) => {
        console.warn("can't get hotels lite liste", err);
      });
  }, []);

  return (
    <>
      {/* years selector */}
      <Form.Select
        aria-label="Default select 
      example"
        style={{ width: "30%", marginBottom: "5px" }}
        onChange={(e) => {
          setDataYear(e.target.value);
        }}
      >
        <option value={null}>select year</option>
        {yearsOptions.map((value, index) => {
          console.log("here", value);
          return (
            <option key={"hotelID" + index} value={value.year}>
              {value.year}
            </option>
          );
        })}
      </Form.Select>

      {Number.isInteger(Number(dataYear)) 
        ? (
          <BarChart
            width={500}
            height={300}
            data={componentData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reservations" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          </BarChart>
      ) : (
        <div className="noHotelSElected">
          <Alert variant={"secondary"}>Please select a year</Alert>
        </div>
      )}
    </>
  );
}
