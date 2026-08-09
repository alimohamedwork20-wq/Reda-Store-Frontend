import React, { useState } from "react";
import "./Contact.css";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../Components/Helper/PageTransition";
import { accountService } from "../../Components/Apis/accountService";
import { showError, showSuccess } from "../../Components/Helper/toastCustom";
export default function Contact() {
  const location = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const playSound = () => {
    const audio = new Audio(
      process.env.PUBLIC_URL +
        "/ksjsbwuil-apple-pay-success-sound-effect-481188.mp3",
    );
    audio.play();
  };
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      showError("Please fill in all fields");
      return;
    }
    accountService.contact(form.name, form.email, form.message);
    location("succes-content");
    showSuccess("Message sent successfully");
    playSound();
    setForm({
      name: "",
      email: "",
      message: "",
    });
  }
  return (
    <PageTransition>
      {" "}
      <div className="contact-page">
        <div className="container">
          <h2>
            Contact Us <i className=" fa-solid fa-address-card"></i>
          </h2>

          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
            />

            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
