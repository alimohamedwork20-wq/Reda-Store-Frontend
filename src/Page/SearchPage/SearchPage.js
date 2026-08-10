import React, { use, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "./SearchPage.css";
import PageTransition from "../../Components/Helper/PageTransition";
import { accountService } from "../../Components/Apis/accountService";
import { getSecureCookie } from "../../Components/Helper/cookieUtils";

export default function SearchPage() {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const isInCart = (id) => cartItems.some((cart) => cart.id === id);
  const userId = Number(getSecureCookie("ith_1854"));
  const token = getSecureCookie("tth_1854");

  // 1️⃣ إعطاء مصفوفة فارغة كقيمة أوليّة لتجنب undefined
  const [products, setProducts] = useState([]);
  const query = new URLSearchParams(useLocation().search).get("query");

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const res = await accountService.GetProductWithSearch(query);
        setProducts(res?.data || []);
        console.log(res);
      } catch (err) {
        console.error("Search fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query]);

  //------------------------ Add to Cart ------------------------//
  function handelCart(item) {
    if (token && userId) {
      accountService.AddToCart(userId, item.id);
    }
    toast.success(
      <div className="stoast-wrapper">
        <img src={item.thumbnail} alt="" className="stoast-img" />
        <div className="stoast-content">
          <strong>{item.title}</strong>
          <p>Added to cart</p>

          <Link to="/cart">
            <button
              style={{
                background: "#228bed",
                padding: "10px",
                color: "white",
                borderRadius: "100px",
              }}
              className="toast-btn"
            >
              View
            </button>
          </Link>
        </div>
      </div>,
      { duration: 2500 },
    );
  }

  //------------------------ handle Share ------------------------//
  const handleShare = (item) => {
    const url = `${window.location.origin}/product/${item.id}`;

    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  //-------------------- handle Total Rating --------------------//
  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;

    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(numRating);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fa-solid fa-star-half-alt"></i>);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>);
    }

    return stars;
  };

  return (
    <PageTransition>
      <div style={{ transform: "translateX(3%)" }} className="search-page">
        {loading ? (
          <dotlottie-wc
            src="https://lottie.host/25e310ff-377c-42be-acf1-943e55f62e44/h20OCToRD3.lottie"
            style={{ width: 300, height: 300 }}
            autoPlay=""
            loop=""
          />
        ) : products?.length > 0 ? ( // 4️⃣ حماية إضافية مع optional chaining
          products.map((item, index) => (
            <div
              key={item.id || index}
              className={`card card-item ${isInCart(item.id) ? "activItems" : ""}`}
              style={{ width: "18rem" }}
            >
              <div className="img-products">
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.thumbnail}
                    className="card-img-top"
                    alt="..."
                  />
                </Link>
                <div className="icons">
                  <i className="fa-regular fa-heart"></i>

                  {!isInCart(item.id) ? (
                    <i
                      onClick={() => handelCart(item)}
                      className="fa-solid fa-cart-arrow-down"
                    ></i>
                  ) : (
                    <i className="fa-solid fa-cart-shopping"></i>
                  )}

                  <i
                    onClick={() => handleShare(item)}
                    className="fa-solid fa-share"
                  ></i>
                </div>
              </div>
              <Link to={`/product/${item.id}`}>
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text"></p>
                  <div className="stars">{renderStars(item.rating)}</div>
                  <p className="price">
                    <span>{item.price}$</span>
                  </p>
                  {isInCart(item.id) ? (
                    <span className="badge text-bg-primary">in cart</span>
                  ) : (
                    ""
                  )}
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <dotlottie-wc
              src="https://lottie.host/24d0005d-5118-49f2-8d5f-e26425493db0/WTXal7hBFa.lottie"
              style={{ width: 300, height: 300 }}
              autoPlay=""
              loop=""
            />
          </div>
        )}
      </div>
    </PageTransition>
  );
}
