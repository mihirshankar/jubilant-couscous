"use client";

import type { useState, MouseEvent } from "react";
import { NavbarText } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function HeaderBar() {
  return (
    <div className = "d-flex justify-content-center"> 
      <Navbar className = "custom-navbar">
        <Container className = "d-flex justify-content-evenly align-items-center w-80 fs-5">
          <Nav.Link href = "/">Home</Nav.Link>
          <Nav.Link href="/projects">Projects</Nav.Link>
            <div className = 'custom-navbar-brand'> 
              <Navbar.Brand className = "text-center fs-1 fw-bold">Mihir Shankar</Navbar.Brand>
            </div>
            <Nav.Link href="/about">About</Nav.Link>
          <Nav.Link href="/contact">Contact Me</Nav.Link>
        </Container>
      </Navbar>
    </div>
  );
}

export default HeaderBar;



{/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}