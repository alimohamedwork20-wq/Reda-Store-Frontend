import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import PageTransition from "../../Components/Helper/PageTransition";
import { accountService } from "../../Components/Apis/accountService";
import { showError, showSuccess } from "../../Components/Helper/toastCustom";
import {
  setUserCookies,
  removeSecureCookie,
} from "../../Components/Helper/cookieUtils";

export default function Login() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(false);

    try {
      setLoading(true);
      const res = await accountService.login(Email.trim(), Password.trim());
      const userData = res.data;

      setUserCookies({
        tth_1854: userData.token,
        nth_1854: userData.name,
        eth_1854: userData.email,
        rth_1854: userData.role,
        pth_1854: userData.phone || null,
        ath_1854: userData.avatar || null,
        tfh_1854: userData.two_Factor,
      });

      // Remove the legacy client-side user id cookie if it exists.
      removeSecureCookie("ith_1854");

      if (userData.status === true) {
        if (!userData.two_Factor) {
          showSuccess(`Welcome back, ${userData.name}!`);
          navigate("/", { replace: true });
        } else {
          navigate("/two-factor-auth", { replace: true });
        }
      } else if (userData.status === false) {
        showError("الحساب معطل");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(true);

      const status = error.response?.status;
      if (status === 404 || status === 400 || status === 401 || !status) {
        if (Email.includes("@")) {
          showError("Invalid email or password. Please try again.");
        } else {
          showError("Invalid phone or password. Please try again.");
        }
      } else {
        showError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  const getInputType = () => {
    if (Email.includes("@")) return "email";
    return "text";
  };

  return (
    <PageTransition>
      <title>Login | Reda Store</title>
      <div className="login">
        <div className="login-form">
          <h2>
            Login{" "}
            <i
              style={{ color: "#007bff" }}
              className="fa-solid fa-arrow-right-to-bracket"
            ></i>
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              style={error ? { border: "1px solid red" } : {}}
              type={getInputType()}
              placeholder="Email or Phone"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              style={error ? { border: "1px solid red" } : {}}
              type="password"
              placeholder="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link to="/forgot-password">Forgot Password?</Link>
            <button type="submit" disabled={Loading}>
              {Loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
