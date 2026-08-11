import React, { useState } from "react";
import "./Account_info.css";
import { accountService } from "../../../Components/Apis/accountService";
import { showSuccess, showError } from "../../../Components/Helper/toastCustom";
import {
  setSecureCookie,
  getSecureCookie,
  removeSecureCookie,
  clearUserCookies,
} from "../../../Components/Helper/cookieUtils";

export default function Account_info() {
  const [Password, setPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Otp, setOtp] = useState("");
  const [NewEmail, setNewEmail] = useState("");
  const [Loading, setLoading] = useState(false);
  const [LoadingEmail, setLoadingEmail] = useState(false);
  const [LoadingPhone, setLoadingPhone] = useState(false);
  const [LoadingPassword, setLoadingPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneCountdown, setPhoneCountdown] = useState(0);
  const [isPhoneSending, setIsPhoneSending] = useState(false);
  const emailUser = getSecureCookie("eth_1854");
  const userId = Number(getSecureCookie("ith_1854"));
  const phoneUser = getSecureCookie("pth_1854");
  //============== Countdown ==============//
  React.useEffect(() => {
    let timer;
    if (phoneCountdown > 0) {
      timer = setTimeout(() => setPhoneCountdown(phoneCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [phoneCountdown]);

  React.useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  //============== form Data ==============//
  const [formData, setFormData] = useState({
    firstName: getSecureCookie("nth_1854") || "",
    role: getSecureCookie("rth_1854") || "",
    email: emailUser || "",
    phone: phoneUser || "Not found",
  });

  //============== Avatar ==============//
  const [avatar, setAvatar] = useState(
    getSecureCookie("ath_1854") ||
      "https://i.pinimg.com/originals/ba/17/ef/ba17ef8be0c75c85adf5e145fdad7dd6.jpg",
  );

  //============== Change Name ==============//
  async function changeName() {
    if (getSecureCookie("nth_1854") !== formData.firstName) {
      try {
        const res = await accountService.changeName(userId, formData.firstName);
        setSecureCookie("name", res.data);
        showSuccess("Name updated successfully!");
      } catch (error) {
        console.error("Name Error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to update name";
        showError(errorMessage);
      }
    } else {
      showError("No changes to update.");
    }
  }

  //============== Send Otp to Email ==============//
  async function SendOtpToEmail() {
    if (countdown > 0 || isOtpSending) return;

    setIsOtpSending(true);
    try {
      await accountService.sendOtp(emailUser);
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

  //============== Change Email ==============//
  async function changeEmail() {
    setLoadingEmail(true);
    try {
      const res = await accountService.changeEmail(userId, NewEmail, Otp);
      setSecureCookie("email", res.data);
      showSuccess("Email updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      showError("The OTP is Invalid");
    } finally {
      setLoadingEmail(false);
    }
  }

  //============== Add Phone ==============//
  async function AddPhone() {
    try {
      setLoadingPhone(true);
      const res = await accountService.savePhone(
        userId,
        phoneNumber,
        emailUser,
        phoneOtp,
      );
      setSecureCookie("phone", res.data);
      showSuccess("Phone added successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      showError(error.response?.data || "Failed to add phone");
    } finally {
      setLoadingPhone(false);
    }
  }

  //============== Update Phone ==============//
  async function UpdatePhone() {
    try {
      const res = await accountService.savePhone(
        userId,
        phoneNumber,
        emailUser,
        phoneOtp,
      );
      setSecureCookie("phone", res.data);
      showSuccess("Phone updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      showError(error.response?.data || "Failed to update phone");
    }
  }

  //============== Avatar and Input Handling ==============//
  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return showError("File size is too large! Maximum is 2MB.");
      }

      try {
        showSuccess("Uploading your profile picture...");

        const res = await accountService.ImageProfile(file, userId);

        setSecureCookie("ath_1854", res.data);
        setAvatar(res.data);

        showSuccess("Avatar updated successfully!");
      } catch (error) {
        console.error("Upload Error:", error);
        showError(error.response?.data?.message || "Failed to upload avatar");
      }
    }
  }

  //============== Remove Avatar ==============//
  async function removeAvatar() {
    setAvatar(
      "https://i.pinimg.com/originals/ba/17/ef/ba17ef8be0c75c85adf5e145fdad7dd6.jpg",
    );
    removeSecureCookie("ath_1854");
    showSuccess("Avatar Removing successfully!");
    const res = await accountService.RemoveImageProfile(userId);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="account-info-container">
      <h2>Account Information</h2>
      <p className="subtitle">
        Update your profile details and personal information
      </p>

      <div className="account-form">
        {/* قسم الصورة الشخصية */}
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <img src={avatar} alt="Profile Avatar" />
            <label htmlFor="avatar-input" className="upload-btn">
              <i className="fa-solid fa-camera"></i>
            </label>
            <i onClick={removeAvatar} className="fa-solid fa-trash-can"></i>
            <input
              type="file"
              id="avatar-input"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </div>
          <p className="avatar-note">Allowed JPG, PNG. Max size of 2MB</p>
        </div>

        {/* حقول الإدخال الشخصية */}
        <div className="inputs-grid">
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <input
              type="text"
              name="role"
              disabled
              value={formData.role}
              placeholder="Role"
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              disabled
              value={formData.email}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              disabled
              value={formData.phone}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* قسم تعديل الإيميل */}
        <div className="form-email">
          <div className="security-form">
            <div style={{ paddingBottom: "0" }} className="security-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>Change Email</h3>
                <button
                  type="button"
                  data-bs-toggle="collapse"
                  href="#collapseExampleEmail"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExampleEmail"
                  style={{
                    border: "1px solid #818181b4",
                    marginBottom: "20px",
                    padding: "5px 10px",
                    borderRadius: "20px",
                  }}
                >
                  change
                </button>
              </div>
              <div
                style={{ transition: "0.3s" }}
                className="collapse"
                id="collapseExampleEmail"
              >
                <div className="input-group">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <label>Enter the code</label>
                    <label
                      style={{
                        color:
                          countdown > 0 || isOtpSending ? "#888" : "#2f87eb",
                        cursor:
                          countdown > 0 || isOtpSending
                            ? "not-allowed"
                            : "pointer",
                        border:
                          countdown > 0 || isOtpSending
                            ? "1px solid #ccc"
                            : "1px solid #2490e9c9",
                        padding: "0px 8px",
                        borderRadius: "5px",
                        background:
                          countdown > 0 || isOtpSending
                            ? "#e0e0e0"
                            : "#d1d1d1af",
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
                          : "Send"}
                    </label>
                  </div>
                  <input
                    onChange={(e) => setOtp(e.target.value)}
                    type="text"
                    name="code"
                    placeholder={`Enter the code that was sent to Gmail at "${emailUser}"`}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>New Email</label>
                  <input
                    onChange={(e) => setNewEmail(e.target.value)}
                    type="text"
                    name="newEmail"
                    placeholder="Enter new Email"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    onClick={() => changeEmail()}
                    style={{ marginBottom: "20px" }}
                    type="button"
                    className="update-btn"
                  >
                    {LoadingEmail ? "Updating..." : "Update Email"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* قسم تعديل الهاتف */}
        <div className="form-phone">
          <div className="security-form">
            <div style={{ paddingBottom: "0" }} className="security-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>{phoneUser ? "Change Phone" : "Add Phone"}</h3>
                <button
                  type="button"
                  data-bs-toggle="collapse"
                  href="#collapseExamplePhone"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExamplePhone"
                  style={{
                    border: "1px solid #818181b4",
                    marginBottom: "20px",
                    padding: "5px 10px",
                    borderRadius: "20px",
                  }}
                >
                  change
                </button>
              </div>
              <div
                style={{ transition: "0.3s" }}
                className="collapse"
                id="collapseExamplePhone"
              >
                <div className="input-group">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <label>Enter the code</label>
                    <label
                      style={{
                        color:
                          countdown > 0 || isOtpSending ? "#888" : "#2f87eb",
                        cursor:
                          countdown > 0 || isOtpSending
                            ? "not-allowed"
                            : "pointer",
                        border:
                          countdown > 0 || isOtpSending
                            ? "1px solid #ccc"
                            : "1px solid #2490e9c9",
                        padding: "0px 8px",
                        borderRadius: "5px",
                        background:
                          countdown > 0 || isOtpSending
                            ? "#e0e0e0"
                            : "#d1d1d1af",
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
                          : "Send"}
                    </label>
                  </div>

                  <input
                    type="text"
                    name="phoneCode"
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    placeholder={`Enter the code that was sent to "${emailUser}" Email`}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>
                    {phoneUser
                      ? `Enter a new Phone number`
                      : "Enter your Phone number"}
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your number"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    onClick={() => (phoneUser ? UpdatePhone() : AddPhone())}
                    style={{ marginBottom: "20px" }}
                    type="button"
                    className="update-btn"
                  >
                    {LoadingPhone
                      ? "Updating..."
                      : phoneUser
                        ? "Update Phone"
                        : "Add Phone"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* زر تسجيل الخروج */}
        <div className="logout">
          <button
            type="button"
            onClick={() => {
              clearUserCookies();
              window.location.href = "/";
            }}
            style={{
              background: "#db0101d7",
              borderRadius: "5px",
              padding: "5px 0px",
              border: "none",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#fff",
            }}
            className="logout"
          >
            Logout
          </button>
        </div>

        {/* زر حفظ التعديلات الكلية (الاسم فقط) */}
        <div className="form-actions">
          <button
            onClick={() => changeName()}
            style={{ marginTop: "5%" }}
            type="button"
            className="save-btn"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
