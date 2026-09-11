// src/pages/Dashboard/Dashboard.jsx
import React, { useState } from "react";
import UserManagement from "..//UserManagement/UserManagement";
import ContactManagement from "../ContactManagement/ContactManagement";
import ReportsManagement from "../ReportsManagement/ReportsManagement";
import { getSecureCookie } from "../../../Components/Helper/cookieUtils";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const userRole = getSecureCookie("rth_1854");

  if (userRole !== "Admin") {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="dashboard-container" dir="rtl">
      <title>Dashboard | Reda store</title>
      {/* الشريط الجانبي Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">لوحة التحكم</div>
        <nav className="sidebar-nav">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            <i
              style={{ paddingLeft: "6px" }}
              className="fa-solid fa-chart-simple"
            ></i>{" "}
            نظرة عامة
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            <i
              style={{ paddingLeft: "6px" }}
              className="fa-solid fa-user-group"
            ></i>{" "}
            إدارة المستخدمين
          </button>
          <button
            className={activeTab === "contacts" ? "active" : ""}
            onClick={() => setActiveTab("contacts")}
          >
            <i
              style={{ paddingLeft: "6px" }}
              className="fa-solid fa-message"
            ></i>{" "}
            التواصل
          </button>
          <button
            className={activeTab === "reports" ? "active" : ""}
            onClick={() => setActiveTab("reports")}
          >
            <i
              style={{ paddingLeft: "6px" }}
              className="fa-solid fa-file-circle-exclamation"
            ></i>{" "}
            البلاغات
          </button>
        </nav>
      </aside>

      {/* المحتوى الرئيسي Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <h2>مرحباً بك، المسؤول</h2>
          <span className="user-avatar">AD</span>
        </header>

        <div className="dashboard-body">
          {(activeTab === "all" || activeTab === "reports") && (
            <div className="section-wrapper">
              <ReportsManagement />
            </div>
          )}

          {(activeTab === "all" || activeTab === "users") && (
            <div className="section-wrapper">
              <UserManagement />
            </div>
          )}

          {(activeTab === "all" || activeTab === "contacts") && (
            <div className="section-wrapper">
              <ContactManagement />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
