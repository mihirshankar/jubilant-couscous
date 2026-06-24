import React from "react";
import UserPage from "./userPage";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const About = () => {
  return (
    <div>
      {" "}
      <h1 className="title-header">About Me</h1>{" "}
      <div className="about-me-wrapper">
        {" "}
        <div className="img-wrapper align-items-center">
          {" "}
          <img
            className="profile-img"
            src="headshot.JPEG"
            alt="Headshot Photo"
          />{" "}
        </div>{" "}
        <div className="about-me-text-wrapper">
          {" "}
          <section className="about-me-text">
            {" "}
            <p>
              {" "}
              I’m a rising junior at Cornell University studying Computer
              Science and Mathematics, with a strong interest in machine
              learning and software engineering. I enjoy building practical
              systems, experimenting with new ideas, and learning through
              hands-on projects.{" "}
            </p>{" "}
            <p>
              {" "}
              My work has included a electricity load forecasting model, Formula
              1 race prediction model, and an emotion detection pipeline. These
              projects have strengthened my interest i n using data to
              understand complex problems and build useful, interactive
              applications.{" "}
            </p>{" "}
            <p>
              {" "}
              Outside of computer science, I’m captain of the Cornell Raas
              Dance Team. I also enjoy weightlifting and playing indie games.
              I’m currently making my way through Cyberpunk 2077.{" "}
            </p>{" "}
          </section>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default About;
