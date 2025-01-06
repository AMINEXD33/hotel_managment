"use client";
import SideBarNewUi from "../global_components/sidebar/sidebarNewUi";
import Container from "react-bootstrap/Container";
import "./style.css";
import Image from "next/image";
import { nextPhotoBase, photobase } from "../../../endpoints/endpoints";
import { useEffect, useRef, useState } from "react";
import massCall from "../massCall";
import Footer from "../global_components/footer/footer";
import {
  API_getHotelsLite,
  API_getCities,
  API_getRoomsUser,
} from "../../../endpoints/endpoints";
import Link from "next/link";


const observedClasses = ["triplePhotoStaticDisplay", "roomsRelax", "roomGo"];


function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const elementHeight = rect.bottom - rect.top;
    const elementWidth = rect.right - rect.left;

    const isVerticalVisible = rect.top < window.innerHeight && rect.bottom > 0;
    const isHorizontalVisible = rect.left < window.innerWidth && rect.right > 0;

    // Check if more than 50% of the element is visible
    const verticalVisibility = Math.max(0, Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top));
    const horizontalVisibility = Math.max(0, Math.min(window.innerWidth, rect.right) - Math.max(0, rect.left));

    const verticalVisibilityPercentage = (verticalVisibility / elementHeight) * 100;
    const horizontalVisibilityPercentage = (horizontalVisibility / elementWidth) * 100;

    return (
        isVerticalVisible &&
        isHorizontalVisible &&
        verticalVisibilityPercentage > 10 &&
        horizontalVisibilityPercentage > 10
    );
}

function observationRootine(elements){
    for (let element of elements){
        console.log(isInViewport(element));
        if (isInViewport(element)){
            element.classList.remove("innactive");
            element.classList.add("active");
        }
    }
}






export default function LandingPage() {
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [HotelinitialData, setHotelinitialData] = useState([]);
  const [CityinitialData, setCityinitialData] = useState([]);

  const Observedclass1 = useRef();
  const Observedclass2 = useRef();
  const Observedclass3 = useRef();

  useEffect(() => {
    setDataIsLoaded(false);
    function objintoArray(key, objects) {
      let tmpArr = [];
      for (let obj of objects) {
        tmpArr.push(obj[key]);
      }
      return tmpArr;
    }
    const callHotels = { url: API_getHotelsLite(), method: "GET" };
    const callCities = { url: API_getCities(), method: "GET" };
    const callRooms = { url: API_getRoomsUser(), method: "GET" };


    let promises = massCall([callHotels, callCities, callRooms]);
    promises
      .then(async (promises) => {
        let index = 0;
        for (let promis of promises) {
          if (promis.status === "fulfilled") {
            let data = await promis.value.json();
            console.warn("damn data .>>>", data);
            if (Array.isArray(data)) {
              if (index === 0) {
                setHotelinitialData(objintoArray("name", data));
              } else if (index === 1) {
                setCityinitialData(objintoArray("city", data));
              } else if (index === 2) {
                setData(data);
                setFilterData(data);
              }
            } else {
              console.warn("the data is not an array then it's not valid");
            }
          }
          index++;
        }
      })
      .catch((err) => {
        console.warn("can't get hotels lite liste", err);
      })
      .finally(() => {
        setDataIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    const wrapper = ()=>{observationRootine([
        Observedclass1.current,
        Observedclass2.current,
        Observedclass3.current
    ])}
    document.body.addEventListener("scroll", wrapper);
    return () => {
      document.body.removeEventListener("scroll", wrapper);
    };
  }, []);
  return (
    <div className="landingpage">
      <SideBarNewUi loggedin={false}/>
      <Container fluid className="container_ NameSection">
        <h1 id="sectionnameheader">
          Enjoy the comfort and luxury in your room
        </h1>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut .
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea .
        </p>
        <Link href={"/userDashboard/brows"} className="custombuttonWhite">BROWSE ROOMS</Link>
      </Container>

      <Container ref={Observedclass1} fluid className="innactive container_ triplePhotoStaticDisplay">
        <div className="colorBack1"></div>
        <div className="colorBack2"></div>
        <div className="img_container">
          <Image
            src={nextPhotoBase + "4444.jpg"}
            width={300}
            height={490}
            alt="photo"
            quality={80}
            layout="fixed"
          />
          <Image
            src={nextPhotoBase + "5555.jpg"}
            width={300}
            height={490}
            layout=""
            alt="photo"
            quality={80}
          />
          <Image
            src={nextPhotoBase + "6666.jpg"}
            width={300}
            height={490}
            layout=""
            alt="photo"
            quality={80}
          />
        </div>
      </Container>

      <Container ref={Observedclass2} fluid className="innactive container_ roomsRelax">
        <Container>
        <div className="ship ship1">
          <Image
            src={nextPhotoBase + "7777.jpg"}
            width={450}
            height={690}
            layout=""
            alt="photo"
            quality={80}
          />
          <div className="shipinfos">
            <p className="about">About</p>
            <h1>Relax in one of our luxury hotels</h1>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat in reprehenderit in
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum duis aute irure dolor
              in.
            </p>
            <Link href={"/userDashboard/brows"} className="buttonblacktowhite">Explore More</Link>
          </div>
        </div>

        <div className="ship ship2">
          <Image
            src={nextPhotoBase + "5555.jpg"}
            width={500}
            height={690}
            layout=""
            alt="photo"
            quality={80}
          />
          <div className="shipinfos">
            <p>
              Faucibus etiam neque lorem eu. In ac tortor risus scelerisque
              sollicitudin malesuada ac ornare. Dolor odio blandit diam sagittis
              nam scelerisque. Amet ac nisl sed neque dui pellentesque amet quis
              nisi. Pellentesque pellentesque volutpat duis mattis aliquet.
              Nulla varius senectus laoreet. Nullam imperdiet semper ornare
              justo. Eu enim urna eget sed. Semper massa non sed malesuada neque
              suspendisse dignissim. Amet nibh urna amet lorem dolor pharetra
              sem. Ut orci nibh libero sed urna dolor nulla lectus nisi. Diam id
              aenean convallis vulputate dolor cursus nunc vitae cras. Praesent.
            </p>{" "}
          </div>
        </div>
      </Container>
      </Container>

      <Container ref={Observedclass3} fluid className="innactive container_ roomGo">
        <Container className="rooms">
        <div>
          <p className="about about2">Rooms</p>
          <div>
            <h3>Carefully luxury rooms designed for your comfort</h3>
          </div>
        </div>
        <div className="rooms_container">
        {data.map((room, indx) => {
          if (indx === 2) {
            return;
          }
          return (
            <div className="room" key={"room"+indx}>
            <a href="/">
            <Image
                src={photobase + room.room_photos[0].photo}
                width={500}
                height={500}
                layout=""
                alt="photo"
                quality={80}
              />
              <div className="roominfo">
                <h4>{room.room.suites}</h4>
                <h5>{room.room.price}$/h</h5>
              </div>
            </a>
              
            </div>
          );
        })}
        </div>
        <Link href={"/userDashboard/brows"} className="custombuttonWhite">
        BROWSE MORE...
        </Link>
      </Container>
      </Container>
      <Footer/>
    </div>
  );
}
