import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Headers.css";
import Search from "../Search/Search";
import toast from "react-hot-toast";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { accountService } from "../Apis/accountService";
import { getSecureCookie } from "../Helper/cookieUtils";
export default function TopHeaders() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [handelCart, setHandelCart] = useState(0);
  const token = getSecureCookie("tth_1854");
  const userId = Number(getSecureCookie("ith_1854"));

  const number = cartItems.length;
  const numberF = favoriteItems.length;

  //----------------  Scroll ----------------//
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 1);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //---------------- Get Product From Cart ----------------//
  useEffect(() => {
    const fetchCart = async () => {
      if (token && userId && fetchCart) {
        try {
          const response = await accountService.GetProductsInCart(userId);
          if (response && response.data) {
            setCartItems(response.data);
          }
        } catch (error) {
          console.error("Error fetching favorites from server:", error);
        }
      }
    };

    fetchCart();
    window.addEventListener("cartUpdated", fetchCart);
    return () => {
      window.removeEventListener("cartUpdated", fetchCart);
    };
  }, [token, userId, setFavoriteItems, handelCart]);

  //---------------- Get Product From Favorite ----------------//
  useEffect(() => {
    const fetchFavorites = async () => {
      if (token && userId && setFavoriteItems) {
        try {
          const response = await accountService.GetProductsFromFavorite(userId);
          if (response && response.data) {
            setFavoriteItems(response.data);
          }
        } catch (error) {
          console.error("Error fetching favorites from server:", error);
        }
      }
    };
    fetchFavorites();
    window.addEventListener("favUpdated", fetchFavorites);
    return () => {
      window.removeEventListener("favUpdated", fetchFavorites);
    };
  }, [token, userId, setFavoriteItems]);

  //----------------  Add Product In Cart ----------------//
  function AddToCart(item) {
    if (token && userId) {
      accountService
        .AddToCart(userId, item.id)
        .then(() => {
          setHandelCart((prev) => prev + 1);
        })
        .catch((err) => {
          console.error("Error syncing cart addition with server:", err);
        });
    }

    toast.success(
      <div className="stoast-wrapper">
        <img src={item.thumbnail} className="stoast-img" alt={item.title} />
        <div className="stoast-content">
          <strong>{item.title}</strong>
          <p>Added to cart</p>
          <Link to="/cart">
            <button className="btn">View</button>
          </Link>
        </div>
      </div>,
      { duration: 3000, position: "bottom-right" },
    );
  }

  //----------------  handle Share ----------------//
  const handleShare = (item) => {
    const url = `${window.location.origin}/product/${item.id}`;
    if (navigator.share) {
      navigator.share({ title: item?.title, text: item?.description, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    }
  };

  //----------------  Close Offcanvas ----------------//
  const closeOffcanvas = () => {
    const el = document.querySelector(".offcanvas.show");
    if (el) {
      const instance = window.bootstrap.Offcanvas.getInstance(el);
      instance?.hide();
    }
  };

  //----------------  Delete Product From Favorite ----------------//
  const handleDeleteProductFromFav = (itemId) => {
    if (token && userId) {
      accountService
        .RemoveFromFavorIte(userId, itemId)
        .then(() =>
          setFavoriteItems((prev) => prev.filter((item) => item.id !== itemId)),
        )
        .then(() => setHandelCart((prev) => prev + 1))
        .catch((err) => {
          console.error("Error deleting favorite from server:", err);
        });
    }
  };

  function CheckProductInCart(item) {
    if (!item) return false;
    return cartItems.some((p) => p.id == item);
  }
  return (
    <div
      style={{
        background: isScrolled ? "#f2f2f2" : "transparent",
        borderBottom: isScrolled ? "#cccccc solid 1px" : "transparent",
        transition: "0.15s",
      }}
      className="top-header"
    >
      <div className="container">
        <Link className="logo" to="/">
          <img src={process.env.PUBLIC_URL + "/img/logo.png"} alt="Logo" />
        </Link>
        <Search />
        <div className="header-icons">
          <Tippy content="Favorite" placement="bottom">
            <div
              className="icon"
              style={{ cursor: "pointer" }}
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasScrolling"
            >
              <i className="fa-regular fa-heart"></i>
              <span className="count">{numberF}</span>
            </div>
          </Tippy>

          <Tippy content="Cart" placement="bottom">
            <div className="icon">
              <Link to={"cart"}>
                <i className="text-black fa-solid fa-cart-shopping"></i>
              </Link>
              <span className="count">{number}</span>
            </div>
          </Tippy>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-start"
        style={{ transition: "0.3s" }}
        data-bs-scroll="true"
        data-bs-backdrop="true"
        tabIndex={-1}
        id="offcanvasScrolling"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasScrollingLabel">
            Favorite
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          <div>
            {favoriteItems && favoriteItems.length !== 0 ? (
              favoriteItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="card"
                  style={{ width: "16rem", margin: "15px auto" }}
                >
                  <img
                    style={{
                      width: "200px",
                      paddingTop: "20px",
                      objectFit: "cover",
                      margin: "auto",
                    }}
                    src={item.thumbnail}
                    className="card-img-top"
                    alt={item.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <div className="stars">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <span
                      style={{ fontSize: "20px", fontWeight: "700" }}
                      className="price"
                    >
                      {item.price}$
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {CheckProductInCart(item.id) ? (
                        <Link
                          onClick={() => closeOffcanvas()}
                          to={"cart"}
                          className="btn btn-primary"
                          style={{ margin: "10px 0" }}
                        >
                          View Cart
                        </Link>
                      ) : (
                        <button
                          onClick={() => AddToCart(item)}
                          className="btn btn-primary"
                          style={{ margin: "10px 0" }}
                        >
                          Add Cart
                        </button>
                      )}
                      <Link
                        onClick={() => closeOffcanvas()}
                        style={{ transform: "translateY(10%)" }}
                        to={`product/${item.id}`}
                      >
                        <i
                          style={{
                            fontSize: "20px",
                            color: "#1285e9",
                            cursor: "pointer",
                          }}
                          className="fa-solid fa-eye"
                        ></i>
                      </Link>
                      <i
                        onClick={() => handleShare(item)}
                        style={{
                          fontSize: "20px",
                          color: "#1285e9",
                          cursor: "pointer",
                        }}
                        className="fa-solid fa-share"
                      ></i>
                      <i
                        onClick={() => handleDeleteProductFromFav(item.id)}
                        style={{
                          fontSize: "20px",
                          color: "red",
                          cursor: "pointer",
                        }}
                        className="fa-solid fa-trash-can"
                      ></i>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "20%",
                  fontSize: "20px",
                }}
              >
                Your favorite is empty
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
