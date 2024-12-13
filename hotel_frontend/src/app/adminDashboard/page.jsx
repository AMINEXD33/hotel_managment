"use client";
import SideBar from "@/app/global_components/sidebar/sidebar";
import "./adminDash.css";
import PieChart from "../global_components/charts/pieChart";


export default function statsPage(){



    return (
        <div className="container-fluid   master">
            <SideBar/>
            <div className="pagecontentmain">
                <PieChart/>
            </div>
        </div>
    )
}