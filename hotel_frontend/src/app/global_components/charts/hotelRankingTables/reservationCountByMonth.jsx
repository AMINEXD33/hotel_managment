import { useEffect, useState } from "react";

import {
  API_reservationsCountByMonth,
  API_availableYears,
  API_getHotelsLite
} from "../../../../../endpoints/endpoints";
import "../ranktables.css";
import massCall from "@/app/massCall";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function reservationCountByMonth({}) {
  let [dataYear, setDataYear] = useState(NaN);
  let [dataHotel, setDataHotel] = useState(NaN);
  let [componentData, setComponentData] = useState([]);
  let [hotelsOptions, setHotelsOptions] = useState([]);
  let [yearsOptions, setYearsOptions] = useState([]);
  
  useEffect(() => {
    console.log("data year", dataYear, "data hotel", dataHotel);
    if (!Number.isInteger(Number(dataYear)) || !Number.isInteger(Number(dataHotel))) {
      return;
    }
    console.log(dataYear);
    let promises = massCall([
      {
        url: API_reservationsCountByMonth(),
        method: "POST",
        body: { hotel_id: dataHotel , year: dataYear},
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
  }, [dataYear, dataHotel]);

  useEffect(() => {
    let promises = massCall([
      { url: API_getHotelsLite(), method: "GET" },
      { url: API_availableYears(), method: "GET" },
    ]);
    promises
      .then(async (promises) => {
        let promis1 = promises[0];
        let promis2 = promises[1];
        if (promis1.status === "fulfilled") {
          let data = await promis1.value.json();
          if (Array.isArray(data)) {
            setHotelsOptions(data);
          } else {
            console.warn("the data is not an array then it's not valid");
          }
        }
        if(promis2.status === "fulfilled"){
          let data = await promis2.value.json();
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
    {/* hotel selector */}
      <Form.Select
        aria-label="Default select 
      example"
        style={{ width: "30%", marginBottom: "5px" }}
        onChange={(e) => {
          setDataHotel(e.target.value);
        }}
      >
        <option value={null}>select hotel</option>
        {hotelsOptions.map((value, index) => {
          console.log("here", value);
          return (
            <option key={"hotelID" + index} value={value.id}>
              {value.id}{" "+value.name}
            </option>
          );
        })}
      </Form.Select>

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

      {Number.isInteger(Number(dataYear)) && Number.isInteger(Number(dataHotel)) 
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
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reservations" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          </BarChart>
      ) : (
        <div className="noHotelSElected">
          <Alert variant={"primary"}>Please select a year</Alert>
        </div>
      )}
    </>
  );
}
