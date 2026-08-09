import React from "react";
import "./Terms_Conditions.css";

export default function Terms_Conditions() {
  return (
    <div className="terms-container">
      <h2>Terms & Conditions</h2>
      <p className="subtitle">
        Please read these terms and conditions carefully before using our
        services
      </p>

      <div className="terms-content">
        {/* البند الأول */}
        <div className="terms-section">
          <div className="section-title">
            <i className="fa-solid fa-circle-info"></i>
            <h3>1. Introduction</h3>
          </div>
          <p>
            Welcome to Reda Store. By accessing or using our website, creating
            an account, or purchasing products, you agree to be bound by these
            terms, conditions, and all applicable laws. If you do not agree with
            any part of these terms, please do not use our platform.
          </p>
        </div>

        {/* البند الثاني */}
        <div className="terms-section">
          <div className="section-title">
            <i className="fa-solid fa-user-shield"></i>
            <h3>2. User Accounts & Security</h3>
          </div>
          <p>
            When you create an account with us, you guarantee that the
            information you provide is accurate and complete. You are solely
            responsible for maintaining the confidentiality of your account
            password and for restricting access to your computer or device.
          </p>
        </div>

        {/* البند الثالث */}
        <div className="terms-section">
          <div className="section-title">
            <i className="fa-solid fa-credit-card"></i>
            <h3>3. Pricing & Payments</h3>
          </div>
          <p>
            All prices are subject to change without prior notice. We accept
            various payment methods including Credit/Debit Cards and Cash on
            Delivery (COD). We reserve the right to refuse or cancel any order
            if fraud or an unauthorized transaction is suspected.
          </p>
        </div>

        {/* البند الرابع */}
        <div className="terms-section">
          <div className="section-title">
            <i className="fa-solid fa-truck-fast"></i>
            <h3>4. Shipping & Delivery</h3>
          </div>
          <p>
            Delivery times are estimates and may vary due to external shipping
            carriers or unforeseen circumstances. Reda Store is not liable for
            shipping delays once the product has left our warehouse, but we will
            fully assist you in tracking and receiving your package safely.
          </p>
        </div>

        {/* البند الخامس */}
        <div className="terms-section">
          <div className="section-title">
            <i className="fa-solid fa-arrow-rotate-left"></i>
            <h3>5. Return & Refund Policy</h3>
          </div>
          <p>
            Customers have the right to request a return or exchange within 14
            days of delivery (or 30 days if the item has a manufacturing
            defect), provided the product is unused, in its original packaging,
            and accompanied by the invoice.
          </p>
        </div>

        {/* البند السادس */}
        <div className="terms-section">
          <div className="section-title">
            <i className="fa-solid fa-copyright"></i>
            <h3>6. Intellectual Property</h3>
          </div>
          <p>
            All content on this website, including texts, graphics, logos,
            images, code, and software, is the exclusive property of Reda Store
            and is protected by copyright laws. Unauthorized duplication or
            distribution is strictly prohibited.
          </p>
        </div>
      </div>

      {/* لمحة سريعة في الآخر لتأكيد الموافقة */}
      <div className="terms-footer">
        <p>Last updated: June 2026</p>
      </div>
    </div>
  );
}
