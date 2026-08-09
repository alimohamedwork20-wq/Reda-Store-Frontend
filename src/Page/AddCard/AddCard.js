import React, { useState } from "react";
import "./AddCard.css";
import PageTransition from "../../Components/Helper/PageTransition";
import ArrowUp from "../../Components/Helper/ArrowUp";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { transform } from "framer-motion";
import { setSecureCookie } from "./../../Components/Helper/cookieUtils";
export default function AddCard() {
  const [cardNumber, setCardNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardType, setCardType] = useState("default");
  const navigate = useNavigate();

  const detectCardType = (number) => {
    const cleanNumber = number.replace(/\s+/g, "");
    if (/^4/.test(cleanNumber)) {
      return "visa";
    } else if (/^(5[1-5]|2[2-7])/.test(cleanNumber)) {
      return "mastercard";
    } else if (/^5078/.test(cleanNumber) || /^50/.test(cleanNumber)) {
      return "meeza";
    } else if (/^3[47]/.test(cleanNumber)) {
      return "amex";
    }
    return "default";
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);

    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted);
    setCardType(detectCardType(value));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);

    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    setCvv(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cardData = {
      cardNumber: cardNumber.replace(/\s/g, ""),
      expiryDate,
      cvv,
      cardHolder,
      cardType,
    };
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSecureCookie("cth_1854", "true");
      toast.success("Card added successfully!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#0088ff",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#0088ff",
        },
      });
      navigate("/");
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setCardHolder("");
      setCardType("default");
    }, 3000);
  };
  const logos = {
    visa: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
    mastercard:
      "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    meeza:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Meeza_logo.svg/512px-Meeza_logo.svg.png",
    amex: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
  };

  return (
    <PageTransition>
      <div className="add-card-container">
        <div className="add-card-wrapper">
          <h2>Add Credit / Debit Card</h2>

          {/* المعاينة التفاعلية للبطاقة */}
          <div className={`credit-card-preview ${cardType}`}>
            <div className="card-top">
              <div className="chip"></div>
              {logos[cardType] && (
                <img
                  style={{ marginLeft: "10px" }}
                  src={logos[cardType]}
                  alt={cardType}
                  className="card-brand-logo"
                />
              )}
            </div>
            <div className="card-number-display">
              {cardNumber || "•••• •••• •••• ••••"}
            </div>
            <div className="card-bottom">
              <div className="card-holder-display">
                <span>Card Holder</span>
                <p>{cardHolder || "YOUR NAME"}</p>
              </div>
              <div className="card-expiry-display">
                <span>Expires</span>
                <p>{expiryDate || "MM/YY"}</p>
              </div>
            </div>
          </div>

          {/* الفورم */}
          <form onSubmit={handleSubmit} className="card-form">
            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                placeholder="e.g. Ali Mohamed"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Card Number</label>
              <div className="input-with-logo">
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  required
                />
                {logos[cardType] && (
                  <img
                    src={logos[cardType]}
                    alt={cardType}
                    className="input-card-logo"
                  />
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>CVV / CVC</label>
                <input
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={handleCvvChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="save-card-btn">
              {loading ? (
                <div className="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Save Card"
              )}
            </button>
          </form>
        </div>
      </div>
      <ArrowUp />
    </PageTransition>
  );
}
