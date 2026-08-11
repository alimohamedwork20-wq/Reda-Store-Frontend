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
      await accountService.ForgotPassword(Email);
      localStorage.setItem("email", Email);
      showSuccess("A verification code has been sent to your email");
      navigate("/check-code");
    } catch {
      showError("Something went wrong");
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="login">
        <div className="login-form">
          <h2>
            Forgot Password <i className="fa-solid fa-key"></i>
          </h2>

          <form onSubmit={handleSubmit}>
            <label>Enter Your Email</label>
            <input
              style={error ? { border: "1.5px solid #ef4444" } : {}}
              type="email"
              placeholder="e.g. name@example.com"
              value={Email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
              required
            />

            <button type="submit" disabled={Loading}>
              {Loading ? "Sending Code..." : "Send Verification Code"}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
