import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#dddddd6c",
        borderTop: "1px solid rgba(0, 0, 0, 0.04)",
      }}
      className="site-footer"
    >
      <div className="footer-container">
        {/* العمود الأول: نبذة عن المتجر */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <h2>
              <span>Reda</span> Store
            </h2>
          </div>
          <p>
            منصتك الأولى لتجربة تسوق ذكية، آمنة، وفائقة السرعة. نجمع بين أفضل
            المنتجات وأحدث تقنيات التجارة الإلكترونية لتلبية تطلعاتك.
          </p>
          <div className="social-links">
            <a href="#facebook" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#instagram" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#twitter" aria-label="Twitter">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#linkedin" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* العمود الثاني: روابط سريعة */}
        <div className="footer-col links-col">
          <h4>روابط سريعة</h4>
          <ul>
            <li>
              <Link to="/">الرئيسية</Link>
            </li>
            <li>
              <Link onClick={() => window.scrollTo(0, 0)} to="/about">
                من نحن
              </Link>
            </li>
            <li>
              <Link to="/products">المنتجات</Link>
            </li>
            <li>
              <Link to="/contact">اتصل بنا</Link>
            </li>
          </ul>
        </div>

        {/* العمود الثالث: خدمة العملاء */}
        <div className="footer-col links-col">
          <h4>دعم العملاء</h4>
          <ul>
            <li>
              <Link to="/setting/account-info">حسابي</Link>
            </li>
            <li>
              <Link to="/setting/order-history">تتبع الطلبات</Link>
            </li>
            <li>
              <Link to="/terms-conditions">سياسة الخصوصية</Link>
            </li>
            <li>
              <Link to="/terms-conditions">الشروط والأحكام</Link>
            </li>
          </ul>
        </div>

        {/* العمود الرابع: النشرة البريدية أو التواصل */}
        <div className="footer-col newsletter-col">
          <h4>ابق على اطلاع</h4>
          <p>اشترك في النشرة البريدية لتصلك أحدث العروض والمنتجات المميزة.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="newsletter-form"
          >
            <input type="email" placeholder="أدخل بريدك الإلكتروني" required />
            <button type="submit">اشتراك</button>
          </form>
        </div>
      </div>

      {/* الشريط السفلي للحقوق */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - Reda Store
          </p>
          <div className="payment-methods">
            <i className="fa-brands fa-cc-visa" title="Visa"></i>
            <i className="fa-brands fa-cc-mastercard" title="Mastercard"></i>
            <i className="fa-brands fa-cc-apple-pay" title="Apple Pay"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}
