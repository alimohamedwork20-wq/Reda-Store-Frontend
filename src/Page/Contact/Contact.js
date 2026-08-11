import React, { useState } from "react";
import "./Contact.css";
import { useNavigate } from "react-router-dom";
import PageTransition from "../../Components/Helper/PageTransition";
import { accountService } from "../../Components/Apis/accountService";
import { showError, showSuccess } from "../../Components/Helper/toastCustom";

export default function Contact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const playSound = () => {
    try {
      const audio = new Audio(
        process.env.PUBLIC_URL +
          "/ksjsbwuil-apple-pay-success-sound-effect-481188.mp3",
      );
      audio.play().catch(() => {}); // يتفادى أخطاء المتصفح إذا منع الصوت التلقائي
    } catch (e) {
      console.error(e);
    }
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      showError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      // انتظر الـ API لحين إرسال البيانات بالفعل
      await accountService.contact(form.name, form.email, form.message);

      showSuccess("Message sent successfully");
      playSound();

      setForm({
        name: "",
        email: "",
        message: "",
      });

      // توجيه للصفحة بعد النجاح
      navigate("/success-content");
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="contact-page">
        <div className="container">
          <h2>
            Contact Us <i className="fa-solid fa-address-card"></i>
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

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
