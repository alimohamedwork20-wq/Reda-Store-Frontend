import React, { useState, useEffect } from "react";
import PageTransition from "../../Components/Helper/PageTransition";
import { accountService } from "../../Components/Apis/accountService";
import { showError, showSuccess } from "../../Components/Helper/toastCustom";
import { useNavigate } from "react-router-dom";

export default function CheckCode({ props }) {
  const [Code, setCode] = useState("");
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // إضافة حالة العد التنازلي وإرسال OTP
  const [countdown, setCountdown] = useState(0);
  const [isOtpSending, setIsOtpSending] = useState(false);

  const navigate = useNavigate();

  // ============== العد التنازلي ==============
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // ============== إرسال OTP إلى البريد الإلكتروني ==============
  async function SendOtpToEmail() {
    // منع الإرسال إذا كان العد التنازلي يعمل أو كان هناك طلب قيد التنفيذ
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
      setCountdown(60); // بدء العد التنازلي لمدة 60 ثانية
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP. Try again.";
      showError(errorMessage);
    } finally {
      setIsOtpSending(false);
    }
  }

  // ============== التحقق من الكود ==============
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

          <form style={{ gap: "0" }} onSubmit={handleSubmit}>
            {/* حقل إدخال الكود مع زر إرسال OTP */}
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label>Enter the code that was sent to your email</label>
                <span
                  style={{
                    color: countdown > 0 || isOtpSending ? "#888" : "#2f87eb",
                    cursor:
                      countdown > 0 || isOtpSending ? "not-allowed" : "pointer",
                    border:
                      countdown > 0 || isOtpSending
                        ? "1px solid #ccc"
                        : "1px solid #2490e9c9",
                    padding: "2px 10px",
                    borderRadius: "5px",
                    background:
                      countdown > 0 || isOtpSending ? "#e0e0e0" : "#d1d1d1af",
                    fontSize: "14px",
                    pointerEvents:
                      countdown > 0 || isOtpSending ? "none" : "auto",
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
                style={
                  error
                    ? {
                        border: "1px solid red",
                        width: "100%",
                        marginTop: "25px",
                      }
                    : { width: "100%", marginTop: "25px" }
                }
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
