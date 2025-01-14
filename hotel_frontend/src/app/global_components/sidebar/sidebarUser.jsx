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

export default function SideBarUser({
  logo,
  linksList = [], //[{icon:"xxx.jpg", text:"profile", "link":"/dashboard"}],
  iconsWidthxHight = 30,
  iconsAlt = "icons",
  activeLink = 1,
  classActiveLink = "activeLink",
}) {

  const router = useRouter();
  return (
    <Navbar expand="lg" className="bg-body-tertiary navbar">
      <Container fluid>
        <Navbar.Brand href="#">Hotel Managment</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="/userDashboard" active={true}>brows</Nav.Link>
            <Nav.Link href="#action1">My reservations</Nav.Link>
            <Nav.Link href="#action1">My account</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Button 
            onClick={
              ()=>{Logout(router)}}
            variant="outline-warning">Lougout</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
