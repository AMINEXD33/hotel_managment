"use client";
import { Container } from "react-bootstrap";
import Link from "next/link";
import TextField from '@mui/material/TextField';
import "./footer.css";
export default function Footer() {
  return (
    <Container fluid className="footer_master_container">
      <Container className="footer_section">
        <div className="part1">
            Pages
            <div className="row">
                <Link href="">Home</Link>
                <Link href="">Services</Link>
                <Link href="">About</Link>
            </div>
        </div>

        <div className="part2">
        <h5>Subscribe to our newsletter</h5>
        <p>Lorem ipsum dolor sit amet consectetur adipiscing elit aliquam.</p>
        <div>
        <TextField id="outlined-basic" label="Email" variant="outlined" />
        <button>SUBSCRIBE</button>
        </div>
        </div>

        <div className="part3"></div>
      </Container>
      <p style={{fontSize:"smaller"}}>Copyright © Suite X  | Designed by BRIX Templates - Powered by Webflow</p>
    </Container>
  );
}
