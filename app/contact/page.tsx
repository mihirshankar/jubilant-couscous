"use client";

import React from "react";
import emailjs from '@emailjs/browser';
import ContactMe from "./contact_me";

const page = () => {
  return (
    <div>
      <h1 className="title-header">Contact Me</h1>

      <div className="contact-me-wrapper">
        <div className="social">
          <li>Follow me on&nbsp;
            <a className = "link" href="https://www.linkedin.com/in/mihir-shankar">
             linkedin
            </a>
          </li>
          <li>Reach out though&nbsp;
            <a className = "link" href="mailto:ms3785@cornell.edu">
             email
            </a>
          </li>
          <li>Check out my&nbsp;
            <a className = "link" href="https://github.com/mihirshankar">
             github
            </a>
          </li>
        </div>

        <div className = "message" >
          <ContactMe/>
          
        </div>

      </div>
    </div>
  );
};

export default page;
