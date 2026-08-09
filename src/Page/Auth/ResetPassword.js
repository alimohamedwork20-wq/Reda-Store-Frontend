import React, { useState } from "react";
import PageTransition from "../../Components/Helper/PageTransition";
import { accountService } from "../../Components/Apis/accountService";
import { showError, showSuccess } from "../../Components/Helper/toastCustom";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [Password, setPassword] = useState("");
  const [PasswordConfirm, setPasswordConfirm] = useState("");
  const [Loading, setLoading] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const [errorPassCon, setErrorPassCon] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorPass(false);
    setErrorPassCon(false);

    if (Password.length < 6) {
      setErrorPass(true);
      return showError("New password must be at least 6 characters long!");
    }
    if (Password !== PasswordConfirm) {
      setErrorPassCon(true);
      return showError("New password and confirm password do not match!");
    }

    const email = localStorage.getItem("email");
    if (!email) {
      return showError("Email not found. Please restart the process.");
    }

    try {
      setLoading(true);
      const response = await accountService.ResetPassword(email, Password);
      if (response.data == "The password was successfully updated") {
        showSuccess("Password reset successfully! Please login.");
        localStorage.removeItem("email");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        showError(response || "Unexpected response from server.");
      }
    } catch (err) {
      console.error("🔴 Full error object:", err);

      let errorMessage = "Something went wrong. Please try again.";
      if (err.response.data) {
        errorMessage = err.response.data;
      }
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="login">
        <div className="login-form">
          <h2>
            Reset Password{" "}
            <i
              style={{ color: "#007bff" }}
              className="fa-solid fa-arrow-right-to-bracket"
            ></i>
          </h2>

          <form onSubmit={handleSubmit}>
            <label>Enter New Password</label>
            <input
              style={errorPass ? { border: "1px solid red" } : {}}
              type="password"
              placeholder="Enter the new password"
              onChange={(e) => setPassword(e.target.value)}
              value={Password}
              required
            />

            <label>Confirm Password</label>
            <input
              style={errorPassCon ? { border: "1px solid red" } : {}}
              type="password"
              placeholder="Confirm password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              value={PasswordConfirm}
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
