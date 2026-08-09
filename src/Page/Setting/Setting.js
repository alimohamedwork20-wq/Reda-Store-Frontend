import React from "react";
import PageTransition from "../../Components/Helper/PageTransition";
import "./Setting.css";
import SettingRight from "./SettingRight";
import { useNavigate } from "react-router-dom";
export default function Setting() {
  const Navigate = useNavigate();
  return (
    <PageTransition>
      {" "}
      <div className="container-setting">
        <div className="content">
          <div className="container-settingLeft">
            <div
              style={{ width: "100%", height: "100%", margin: "0" }}
              className="content"
            >
              <ul>
                <li onClick={() => Navigate("account-info")}>Account Info</li>
                <li onClick={() => Navigate("security-password")}>
                  Security & Password
                </li>
                <li onClick={() => Navigate("addresses-shipping")}>
                  Addresses / Shipping
                </li>
                <li onClick={() => Navigate("order-history")}>Order History</li>
                <li onClick={() => Navigate("terms-conditions")}>
                  Terms and Conditions
                </li>
                <li onClick={() => Navigate("report-problem")}>
                  Report a problem
                </li>
              </ul>
            </div>
          </div>
          <SettingRight></SettingRight>
        </div>
      </div>
    </PageTransition>
  );
}
