"use client";
import React from "react";
import { useState } from "react";

import emailjs from "@emailjs/browser";

const ContactMe = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const serviceID = "service_z2hsxbm";
    const templateID = "template_qzfih4q";
    const publicKey = "Wtj2jUUrWFQLBQPij";
    const form = e.target as HTMLFormElement;

    const templateParams = {
      name: name,
      email: email,
      to_name: "Mihir",
      message: message,
      time: new Date().toLocaleString(),
    };

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log("Email sent successfully", response);
        setName("");
        setEmail("");
        setMessage("");
        setSent(true);
      })
      .catch((error) => {
        console.error("Error sending email: ", error);
      });

    form.reset();
  };

  const formIsIncomplete =
    name.trim() === "" || email.trim() === "" || message.trim() === "";

  return (
    <form onSubmit={handleSubmit} className="email-form">
      <h1 style={{ color: "#dff3e3", margin: "20px" }}> Message </h1>
      <input
        type="text"
        placeholder="Enter Name"
        id="full-name"
        onChange={(e) => setName(e.target.value)}
        className="input"
        required
      />
      <input
        type="email"
        placeholder="Enter Email"
        id="email-address"
        onChange={(e) => setEmail(e.target.value)}
        className="input"
        required
      />
      <textarea
        cols={30}
        rows={4}
        placeholder="Enter your message!"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setSent(false);
        }}
        id="message"
        className="textarea"
        required
      />
      <button type="submit" className="send-button" disabled={formIsIncomplete}>
        Send Email
      </button>


      {sent && (
        <div
          style={{
            color: "#dff3e3",
          }}
        >
          Message Sent
        </div>
      )}
    </form>
  );
};

export default ContactMe;
