import React from "react";
import PageTransition from "../../Components/Helper/PageTransition";
import "./Setting.css";
import SettingRight from "./SettingRight";
import { useNavigate } from "react-router-dom";

export default function Setting() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="container-setting">
        <div className="content">
          <div className="container-settingLeft">
            <ul>
              <li onClick={() => navigate("account-info")}>Account Info</li>
              <li onClick={() => navigate("security-password")}>
                Security & Password
              </li>
              <li onClick={() => navigate("addresses-shipping")}>
                Addresses / Shipping
              </li>
              <li onClick={() => navigate("order-history")}>Order History</li>
              <li onClick={() => navigate("terms-conditions")}>
                Terms and Conditions
              </li>
              <li onClick={() => navigate("report-problem")}>
                Report a problem
              </li>
            </ul>
          </div>
          <SettingRight />
        </div>
      </div>
    </PageTransition>
  );
}
