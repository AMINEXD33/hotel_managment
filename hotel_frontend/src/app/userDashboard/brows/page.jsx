"use client";

import SideBarNewUi from "@/app/global_components/sidebar/sidebarNewUi";
import "../../global_components/sidebar/custom.css";
import "./page.css";
import { Container } from "react-bootstrap";
import Image from "next/image";
import { nextPhotoBase, photobase } from "../../../../endpoints/endpoints";
import Filter from "@/app/global_components/checkinoutFilter/filter";
import Footer from "@/app/global_components/footer/footer";
import { useEffect, useState } from "react";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import FmdGoodSharpIcon from '@mui/icons-material/FmdGoodSharp';
import ShowerSharpIcon from '@mui/icons-material/ShowerSharp';
import KingBedSharpIcon from '@mui/icons-material/KingBedSharp';
import TypeSpecimenSharpIcon from '@mui/icons-material/TypeSpecimenSharp';
import Link from "next/link";

export default function Brows(){
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(data);


    return (
        <>
            <SideBarNewUi loggedin={true}/>
            <Container fluid style={{"display":"flex", "alignItems":"center", "justifyContent":"center"}}>
                <Container className="searchbar">
                <div className="filter"></div>
                <div className="data_filters">
                    <Filter data={data} setData={setData} setFilteredData={setFilteredData}/>
                </div>
                
                </Container>

            </Container>
            <Container fluid style={{"display":"flex", "alignItems":"center", "justifyContent":"center"}}>
                
                <Container className="roomsships_container">

                {
                    data?filteredData.map((val, index)=>{
                        let photo = null;
                        if (val.room_photos.length > 0){
                            photo = val.room_photos[0].photo;
                        }
                        return(
                            <div key={"room_"+index} className="room_ship">
                                <div className="roomPhoto">
                                    <img src={photobase+photo} className="roomphoto">
                                    </img>
                                </div>
                                <div className="roomInfos">
                                    <p className="dashed_header">Infos</p>
                                    <div className="infos">
                                        <div className="info" style={{display:"flex", gap:"10px", paddingLeft:"10px"}}>
                                            <FmdGoodSharpIcon color=""/>
                                            <p>{val.room.city}</p>
                                        </div>
                                        <div className="info" style={{display:"flex", gap:"10px", paddingLeft:"10px"}}>
                                            <ShowerSharpIcon color=""/>
                                            <p>{val.room.baths}</p>
                                        </div>
                                        <div className="info" style={{display:"flex", gap:"10px", paddingLeft:"10px"}}>
                                            <KingBedSharpIcon color=""/>
                                            <p>{val.room.beds}</p>
                                        </div>
                                        <div className="info" style={{display:"flex", gap:"10px", paddingLeft:"10px"}}>
                                            <TypeSpecimenSharpIcon color=""/>
                                            <p>{val.room.suites}</p>
                                        </div>
                                    </div>
                                    <p className="dashed_header">Rating</p>
                                    <div className="rating">
                                        <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
                                    </div>
                            
                                    <Link prefetch={false}className="bookbow" href={"/userDashboard/booking/"+ val.room.id}>Book Now</Link>
                                </div>
                                
                            </div>
                        )
                    })
                
                    :<Box sx={{ width: '100%' }}>
                    <LinearProgress   color="inherit"/>
                  </Box>
                }

                </Container>
            </Container >


            <Footer/>
        </>
    )
}