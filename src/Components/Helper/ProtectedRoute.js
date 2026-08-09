import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { showError } from "./toastCustom";
import { getSecureCookie } from "./cookieUtils";
export default function ProtectedRoute() {
  // التشيك على الـ Token في الـ LocalStorage (أو الـ State حسب نظامك)
  const token = getSecureCookie("tth_1854");

  // لو الـ Token موجود، أظهر الشاشة المطلوبة (Outlet)، لو مش موجود رجعه لصفحة الـ login
  return token ? (
    <Outlet />
  ) : (
    <>
      <Navigate to="/login" replace />
      {showError("Please Login first")}
    </>
  );
}
