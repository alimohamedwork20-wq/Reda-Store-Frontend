import React from "react";
import { useNavigate } from "react-router-dom"; // عشان ننقله للرئيسية بعد التسجيل
import PageTransition from "../../Components/Helper/PageTransition";
import { accountService } from "../../Components/Apis/accountService";
import { showSuccess, showError } from "../../Components/Helper/toastCustom";

export default function Register() {
  const [Email, setEmail] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const [ConfirmPassword, setConfirmPassword] = React.useState("");
  const [Name, setName] = React.useState("");
  const [Loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorPassConfirm, setErrorPassConfirm] = React.useState(false);
  const [errorPass, setErrorPass] = React.useState(false);
  const navigate = useNavigate();

  // 1️⃣ أضفنا async هنا 👇
  async function handleSubmit(e) {
    e.preventDefault();

    // فحص تطابق الباسورد قبل ما نكلم السيرفر
    if (Password !== ConfirmPassword) {
      setErrorPassConfirm(true);
      showError("Passwords do not match! Please try again.");
      return;
    } else {
      setErrorPassConfirm(false);
    }
    if (Password.length < 6) {
      setErrorPass(true);
      showError("Password must be at least 6 characters long!");
      return;
    } else {
      setErrorPass(false);
    }
    try {
      setLoading(true);
      setError(false);

      // 2️⃣ أضفنا await هنا 👇
      const res = await accountService.register(Email, Password, Name);

      if (res.status === 200 || res.status === 201) {
        setError(false);
        showSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      const status = error.response?.status;

      if (status === 400) {
        setError(true);
        const serverMessage =
          error.response?.data?.Message || "Email already exists";

        showError(serverMessage);
      } else {
        showError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <title>Register | Reda Store</title>
      <div className="login">
        <div className="login-form">
          <h2>
            Register{" "}
            <i
              style={{ color: "#007bff" }}
              className="fa-solid fa-address-card"
            ></i>
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={Email}
              onFocus={() => setError(false)}
              style={{ border: error ? "1px solid red" : "" }}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={Password}
              onFocus={() => setErrorPass(false)}
              style={{ border: errorPass ? "1px solid red" : "" }}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              onFocus={() => setErrorPassConfirm(false)}
              style={{ border: errorPassConfirm ? "1px solid red" : "" }}
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={Loading}>
              {Loading ? "Creating Account..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
