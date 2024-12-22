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

export default function SideBar({
  logo,
  linksList = [], //[{icon:"xxx.jpg", text:"profile", "link":"/dashboard"}],
  iconsWidthxHight = 30,
  iconsAlt = "icons",
  activeLink = 1,
  classActiveLink = "activeLink",
}) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary navbar">
      <Container fluid>
        <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="/adminDashboard" active={true}>Statistics</Nav.Link>
            <NavDropdown title="Managment" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/adminDashboard/hotelsManagment">
                Hotel managment
              </NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Rooms managment
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Reservations managment
              </NavDropdown.Item>
              <NavDropdown.Item href="#action5">
                accounts managment
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#action1">My account</Nav.Link>

          </Nav>
          <Form className="d-flex">
            <Button variant="outline-warning">Lougout</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
