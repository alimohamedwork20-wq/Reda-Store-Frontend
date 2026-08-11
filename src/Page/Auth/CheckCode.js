import React, { useState, useEffect } from "react";
import PageTransition from "../../Components/Helper/PageTransition";
import { accountService } from "../../Components/Apis/accountService";
import { showError, showSuccess } from "../../Components/Helper/toastCustom";
import { useNavigate } from "react-router-dom";

export default function CheckCode({ props }) {
  const [Code, setCode] = useState("");
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [isOtpSending, setIsOtpSending] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  async function SendOtpToEmail() {
    if (countdown > 0 || isOtpSending) return;

    const email = localStorage.getItem("email");
    if (!email) {
      showError("Email not found. Please restart the process.");
      return;
    }

    setIsOtpSending(true);
    try {
      await accountService.sendOtp(email);
      showSuccess("OTP sent successfully!");
      setCountdown(60);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP. Try again.";
      showError(errorMessage);
    } finally {
      setIsOtpSending(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await accountService.CheckCodeToResetPassword(
        localStorage.getItem("email"),
        Code,
      );
      if (res.data === "Verified") {
        navigate(props.url);
        showSuccess("Verified");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(true);
        showError("Code Invalid");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="login">
        <div className="login-form">
          <h2>
            {props.title}{" "}
            <i
              style={{ color: "#007bff" }}
              className="fa-solid fa-arrow-right-to-bracket"
            ></i>
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              {/* 🎯 تم استخدام كلاس otp-header للتحكم في التجاوب */}
              <div
                className="otp-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label style={{ margin: 0 }}>
                  Enter the code sent to your email
                </label>
                <span
                  style={{
                    color: countdown > 0 || isOtpSending ? "#888" : "#007bff",
                    cursor:
                      countdown > 0 || isOtpSending ? "not-allowed" : "pointer",
                    border: "1px solid #cbd5e1",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background:
                      countdown > 0 || isOtpSending ? "#f1f5f9" : "#e0f2fe",
                    fontSize: "13px",
                    pointerEvents:
                      countdown > 0 || isOtpSending ? "none" : "auto",
                    whiteSpace: "nowrap",
                  }}
                  onClick={SendOtpToEmail}
                >
                  {isOtpSending
                    ? "Sending..."
                    : countdown > 0
                      ? `Resend in ${countdown}s`
                      : "Send Code"}
                </span>
              </div>
              <input
                style={{
                  width: "100%",
                  marginTop: "12px",
                  border: error ? "1px solid red" : undefined,
                }}
                type="text"
                placeholder="Enter the code"
                value={Code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={Loading}>
              {Loading ? "Loading..." : props.submitButtonText}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
