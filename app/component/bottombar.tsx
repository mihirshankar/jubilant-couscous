"use client";

import type { useState, MouseEvent } from "react";
import { NavbarText } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAsyncList } from "react-stately/useAsyncList";
import { images } from "../projects_data";
import Carousel from "react-bootstrap/Carousel";

export interface Project {
  images: {
    src: string;
    name: string;
    link: string;
  }[];
}
function BottomBar() {
  return (
    <div>
      <div className="custom-border">
        <Navbar className="custom-bottomBar">
          <div className="wrapper">
            <div className="project-background">
              {[...images, ...images].map(({ src, name, link }, index) => (
                <a
                  type="button"
                  className="project-button"
                  key={`${name}-${index}`}
                  href={link}
                >
                  <img src={src} alt={name} className="project-image" />
                  <div className ="project-name">{name}</div>


                </a>
              ))}
            </div>
          </div>
        </Navbar>
      </div>
    </div>
  );
}

export default BottomBar;
