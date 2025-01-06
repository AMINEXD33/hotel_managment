"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./sidebar.css";
import Logout from "./logout";
import { useRouter } from "next/navigation";
import "./custom.css";
export default function SideBarNewUi({loggedin}) {

  const router = useRouter();
  
  
  
  
  return (
    <Navbar expand="lg" className="bg-body-tertiary" id="navbar">
      <Container fluid>
        <Navbar.Brand href="/landingPage">Hotel Managment</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="/userDashboard/brows" active={true}>brows</Nav.Link>
            <Nav.Link href="/userDashboard/myreservations">My reservations</Nav.Link>
            <Nav.Link href="/userDashboard/myaccount">My account</Nav.Link>
          </Nav>
          {loggedin? <Form className="d-flex">
            <Button 
            onClick={
              ()=>{Logout(router)}}
            variant="outline-warning">Lougout</Button>
          </Form>:null}
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
