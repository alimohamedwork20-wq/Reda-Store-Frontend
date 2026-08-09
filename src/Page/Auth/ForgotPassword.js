import React, { useState } from "react";
import PageTransition from "../../Components/Helper/PageTransition";
import { accountService } from "../../Components/Apis/accountService";
import { showError, showSuccess } from "../../Components/Helper/toastCustom";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [Email, setEmail] = useState("");
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await accountService.ForgotPassword(Email);
      localStorage.setItem("email", Email);
      showSuccess("A verification code has been sent to your email");
      navigate("/check-code");
    } catch {
      showError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  return (
    <PageTransition>
      <div className="login">
        <div className="login-form">
          <h2>
            Forgot Password{" "}
            <i
              style={{ color: "#007bff" }}
              className="fa-solid fa-arrow-right-to-bracket"
            ></i>
          </h2>

          <form onSubmit={handleSubmit}>
            <lable>Enter Your Email</lable>
            <input
              style={error ? { border: "1px solid red" } : {}}
              type="email"
              placeholder="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" disabled={Loading}>
              {Loading ? "Loading..." : "Confirm"}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
