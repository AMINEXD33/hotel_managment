"use client";
import SideBar from "@/app/global_components/sidebar/sidebar";
import "./adminDash.css";
import PieChart from "../global_components/charts/pieChart";
import RankHotelByReservationCount from "../global_components/charts/hotelRankingTables/rankHotelsByReservationCount";
import massCall from "../massCall";
import { useEffect } from "react";
import { API_RankHotelsByReservationCount } from "../../../endpoints/endpoints";
import { API_classedRoomsByReservationsCount } from "../../../endpoints/endpoints";
import RankHotelsByReservationRating from "../global_components/charts/hotelRankingTables/rankHotelsByReservationRating";
import RankRoomsByReservationCount from "../global_components/charts/hotelRankingTables/rankRoomsByReservationCount";
import RankRoomsByReservationRating from "../global_components/charts/hotelRankingTables/rankRoomsByReservationRating";
import ReservationCountByMonth from "../global_components/charts/hotelRankingTables/reservationCountByMonth";
import ReservationCountByYear from "../global_components/charts/hotelRankingTables/reservationCountByYear";
import Image from "next/image";
import RevenueByYear from "../global_components/charts/hotelRankingTables/revenueByYear";
import RevenueByMonth from "../global_components/charts/hotelRankingTables/revenueByMonth";

export default function statsPage(){



    return (
        <div className="container-fluid   master">
            <SideBar/>
            <div className="pagecontentmain">

                <div className="part">
                    <h4 className="partHeaders">Hotels ranked by reservation count</h4>
                <RankHotelByReservationCount/>
                </div>


                <div className="part">
                    <h4 className="partHeaders">Hotels ranked by average ratings</h4>
                <RankHotelsByReservationRating/>
                </div>
                


                <div className="part">
                    <h4 className="partHeaders">Rank Romms By reservation count</h4>
                <RankRoomsByReservationCount/>
                </div>


                <div className="part">
                    <h4 className="partHeaders">Rank Romms By average ratings</h4>
                <RankRoomsByReservationRating/>
                </div>

                <div className="part" style={{maxHeight:"600px", overflow:"none"}}>
                    <h4 className="partHeaders">Hotel Monthly Reservations frequency</h4>
                <ReservationCountByMonth/>
                </div>

                <div className="part" style={{maxHeight:"600px", overflow:"none"}}>
                    <h4 className="partHeaders">Hotel yearly Reservations frequency</h4>
                <ReservationCountByYear/>
                </div>

                <div className="part" style={{maxHeight:"600px", overflow:"none"}}>
                    <h4 className="partHeaders">Hotels yearly revenue</h4>
                <RevenueByYear/>
                </div>


                <div className="part" style={{maxHeight:"600px", overflow:"none"}}>
                    <h4 className="partHeaders">Hotel Monthly revenue</h4>
                <RevenueByMonth/>
                </div>
            </div>
        </div>
    )
}