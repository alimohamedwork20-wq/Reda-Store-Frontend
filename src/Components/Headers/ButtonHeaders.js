import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Headers.css";
import toast from "react-hot-toast";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import CryptoJS from "crypto-js";
import { getSecureCookie } from "../Helper/cookieUtils";
export default function ButtonHeaders() {
  const [productsList, setProductsList] = useState([]);
  const [categoryActiv, setCategoryActiv] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const path = useLocation();
  const userRole = getSecureCookie("rth_1854");
  const token = getSecureCookie("tth_1854");

  // إغلاق قائمة الأقسام فور تغيير المسار (URL)
  useEffect(() => {
    setCategoryActiv(false);
  }, [path.pathname]);

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => setProductsList(data));
  }, []);

  const navLinks = [
    { title: "Home", link: "/" },
    { title: "About", link: "/about" },
    { title: "Blog", link: "/blog" },
    { title: "Contact", link: "/contact" },
    { title: "Setting", link: "/setting" },
  ];

  const filteredLinks =
    userRole === "Admin"
      ? [...navLinks, { title: "Dashboard", link: "/admin" }]
      : navLinks;

  const [width, setWidth] = useState(window.innerWidth);

  // 👈 المرجع هنا ليشمل الزرار والقائمة معاً
  const categoryNavRef = useRef();

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ إغلاق القائمة عند الضغط خارج الـ category-nav بكتمله
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        categoryNavRef.current &&
        !categoryNavRef.current.contains(e.target)
      ) {
        setCategoryActiv(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="buttom-header">
      <div className="container">
        <nav>
          {/* ✅ نقل الـ ref هنا ليشمل الزرار والقائمة معاً */}
          <div className="category-nav" ref={categoryNavRef}>
            <div
              onClick={() => setCategoryActiv((prev) => !prev)}
              className="category-btn"
            >
              <i className="fa-solid fa-bars"></i>
              <p>Browse Category</p>
              {!categoryActiv ? (
                <i className="fa-solid fa-caret-down"></i>
              ) : (
                <i className="fa-solid fa-sort-up"></i>
              )}
            </div>

            <div
              className={
                categoryActiv ? "category-select actives" : "category-select"
              }
            >
              {productsList.map((item, index) => (
                <Link
                  onClick={() => setCategoryActiv(false)}
                  key={index}
                  to={`/category/${item.slug}`} // ✅ أضفنا / لتفادي أخطاء الـ Relative path
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {width < 1090 && (
            <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <i className="fa-solid fa-bars"></i>
            </div>
          )}

          {width > 1090 ? (
            <div className="category-list">
              {filteredLinks.map((item, index) => (
                <li
                  key={index}
                  className={path.pathname === item.link ? "active" : ""}
                >
                  <Link to={item.link}> {item.title}</Link>
                </li>
              ))}
            </div>
          ) : (
            <div className={`category-list ${menuOpen ? "open" : ""}`}>
              {filteredLinks.map((item, index) => (
                <Link
                  key={index}
                  style={{ color: "white" }}
                  onClick={() => setMenuOpen(false)}
                  to={item.link}
                >
                  <li className={path.pathname === item.link ? "active" : ""}>
                    {item.title}
                  </li>
                </Link>
              ))}
            </div>
          )}

          <div className="sign-icons">
            {token ? (
              ""
            ) : (
              <>
                <Link to="/login">
                  <Tippy content="Login" placement="bottom">
                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  </Tippy>
                </Link>{" "}
                <Link to="/register">
                  <Tippy content="Register" placement="bottom">
                    <i className="fa-solid fa-user-plus"></i>
                  </Tippy>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
