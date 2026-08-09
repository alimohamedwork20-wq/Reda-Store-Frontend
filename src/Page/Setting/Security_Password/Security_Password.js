import React, { useEffect, useState } from "react";
import "./Security_Password.css";
import { showSuccess, showError } from "../../../Components/Helper/toastCustom";
import { accountService } from "../../../Components/Apis/accountService";
import Swal from "sweetalert2";
import {
  getSecureCookie,
  setSecureCookie,
  clearUserCookies,
} from "../../../Components/Helper/cookieUtils";

export default function SecurityPassword() {
  const [LoadingPassword, setLoadingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [userData, setUserData] = useState({
    twoFactor: null,
  });
  const [twoFactor, setTwoFactor] = useState();
  const userId = Number(getSecureCookie("ith_1854"));

  useEffect(() => {
    const GetUser = async () => {
      const res = await accountService.GetUserById(userId);
      if (res.data) {
        setTwoFactor(res.data.twoFactor);
      }
    };
    GetUser();
  }, [twoFactor]);
  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return showError("New password and confirm password do not match!");
    }

    if (passwordData.newPassword.length < 6) {
      return showError("New password must be at least 6 characters long!");
    }

    try {
      setLoadingPassword(true);
      const res = await accountService.changePassword(
        userId,
        passwordData.currentPassword,
        passwordData.newPassword,
      );
      showSuccess("Password updated successfully!");

      setLoadingPassword(false);
      // تفريغ الحقول بعد النجاح
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Full Error Object:", error);
      setLoadingPassword(false);

      // جلب رسالة الخطأ من الباكيند وعرضها فوراً للمستخدم
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Something went wrong!";
      showError(errorMessage);
    } finally {
      setLoadingPassword(false);
    }
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleToggle2FA = async () => {
    setTwoFactor(!twoFactor);
    if (!twoFactor) {
      try {
        const res = await accountService.TurnOnTwoFactor(userId);
        showSuccess("Two-Factor Authentication enabled!");
      } catch (error) {
        console.error("Error enabling 2FA:", error);
        showError("Failed to enable Two-Factor Authentication.");
      }
    } else {
      try {
        const res = await accountService.TurnOffTwoFactor(userId);
        showSuccess("Two-Factor Authentication disabled!");
      } catch (error) {
        console.error("Error disabling 2FA:", error);
        showError("Failed to disable Two-Factor Authentication.");
      }
    }
  };
  const handleDelete = () => {
    Swal.fire({
      title: "Delete Account",
      text: "Are you sure? You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        accountService.deleteAccount(userId).then(() => {
          showSuccess("Account deleted successfully!");
          clearUserCookies();
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        });
      }
    });
  };

  return (
    <div className="security-container">
      <h2>Security & Password</h2>
      <p className="subtitle">
        Manage your account's password and security settings
      </p>

      {/* 🔐 الجزء الأول: فورم تغيير الباسورد */}
      <form onSubmit={handlePasswordSubmit} className="security-form">
        <div className="security-card">
          <h3>Change Password</h3>

          <div className="input-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
            />
          </div>

          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="update-btn">
              {LoadingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </form>

      {/* 🛡️ الجزء الثاني: المصادقة الثنائية (2FA) */}
      <div className="security-card extra-security">
        <div className="security-info">
          <h3>Two-Factor Authentication (2FA)</h3>
          <p>
            Secure your account with an extra layer of security by requiring a
            verification code.
          </p>
        </div>

        {/* زرار الـ Toggle الشيك */}
        <label className="switch">
          <input
            type="checkbox"
            checked={twoFactor}
            onChange={handleToggle2FA}
          />
          <span className="slider round"></span>
        </label>
      </div>
      {/* � Delete account */}
      <div className="security-card extra-security">
        <div className="security-info">
          <h3>Delete Account</h3>
          <p>
            Please note that you cannot recover your account after making this
            decision.
          </p>
        </div>

        {/* زرار الـ Toggle الشيك */}
        <button
          onClick={handleDelete}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
