import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { accountService } from "../../Components/Apis/accountService";
import { showError } from "../../Components/Helper/toastCustom";
import { getSecureCookie } from "../../Components/Helper/cookieUtils";

export default function Product_info({ product }) {
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const token = getSecureCookie("tth_1854");

  //---------------------- Get Product From Cart && Favorite ----------------------//
  useEffect(() => {
    if (!token) {
      setCartItems([]);
      setFavoriteItems([]);
      return;
    }

    accountService
      .GetProductsInCart()
      .then((data) => setCartItems(data?.data || []))
      .catch(() => {
        showError("An error occurred while retrieving products from Cart");
      });

    accountService
      .GetProductsFromFavorite()
      .then((data) => setFavoriteItems(data?.data || []))
      .catch(() => {
        showError("An error occurred while retrieving products from Favorite");
      });
  }, [token]);

  //---------------------- Check Product Status ----------------------//
  const isInCart = cartItems.some((item) => item.id == product?.id);
  const isInFav = (id) => favoriteItems.some((fav) => fav.id == id);

  //---------------------- Add to Cart ----------------------//
  function handelCart() {
    if (!token) {
      showError("Please login first to manage your Cart!");
      return;
    }

    setCartItems((prev) => [...prev, product]);

    // Only productId is sent by the frontend. The backend gets the user id
    // from the authenticated JWT claims.
    accountService
      .AddToCart(product.id)
      .then(() => window.dispatchEvent(new Event("cartUpdated")))
      .catch((error) => {
        console.error("Error adding product to cart:", error);
        setCartItems((prev) => prev.filter((item) => item.id != product.id));
        showError(error.response?.data || "Could not add product to cart");
      });

    toast.success(
      <div className="stoast-wrapper">
        <img
          src={product?.thumbnail}
          className="stoast-img"
          alt={product?.title}
        />
        <div className="stoast-content">
          <strong>{product?.title}</strong>
          <p>Added to cart</p>
          <Link to="/cart">
            <button className="btn">View</button>
          </Link>
        </div>
      </div>,
      { duration: 3000 },
    );
  }

  //---------------------- Toggle Favorite ----------------------//
  function handelFavorite() {
    if (!token) {
      showError("Please login first to manage your Favorite!");
      return;
    }

    const currentlyFav = isInFav(product?.id);

    if (!currentlyFav) {
      setFavoriteItems((prev) => [...prev, product]);

      accountService
        .AddToFavorite(product.id)
        .then(() => window.dispatchEvent(new Event("favUpdated")))
        .catch((error) => {
          console.error("Error adding product to Favorite:", error);
          setFavoriteItems((prev) =>
            prev.filter((fav) => fav.id != product.id),
          );
          showError(error.response?.data || "Could not add product to Favorite");
        });
    } else {
      setFavoriteItems((prev) => prev.filter((fav) => fav.id != product.id));

      accountService
        .RemoveFromFavorIte(product.id)
        .then(() => window.dispatchEvent(new Event("favUpdated")))
        .catch((error) => {
          console.error("Error removing product from Favorite:", error);
          setFavoriteItems((prev) => [...prev, product]);
          showError(error.response?.data || "Could not remove product from Favorite");
        });
    }
  }

  //---------------------- handle Share ----------------------//
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title || "My Website",
        text: product?.description || "Check this out!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
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
    <div className="item-name Product_info">
      <title>{product.title + " | Reda store"}</title>
      <h1>{product?.title}</h1>
      <div className="stars">{renderStars(product.rating)}</div>
      <p className="price">
        <span>{product?.price}$</span>
      </p>
      <div className="name-details">
        <p style={{ fontWeight: "600", color: "#676767" }}>
          Availability: <span>Available</span>
        </p>
        <p style={{ fontWeight: "600", color: "#676767" }}>
          Brand: <span>{product?.brand}</span>
        </p>
        <p className="dis">{product?.description}</p>
        <h3>
          <span>
            Hurry Up! Only <span className="stock">{product?.stock}</span>{" "}
            Products Left in Stock.
          </span>
        </h3>

        {isInCart ? (
          <button className="btn">
            <Link style={{ color: "white" }} to={"/cart"}>
              View cart <i className="fa-solid fa-cart-shopping"></i>
            </Link>
          </button>
        ) : (
          <button onClick={handelCart} className="btn">
            Add to cart <i className="fa-solid fa-cart-arrow-down"></i>
          </button>
        )}

        <div className="icons">
          <i
            onClick={handelFavorite}
            style={{ cursor: "pointer", color: "#008cff" }}
            className={
              isInFav(product?.id)
                ? "fa-solid fa-heart"
                : "fa-regular fa-heart"
            }
          ></i>
          <i
            onClick={handleShare}
            style={{ cursor: "pointer" }}
            className="fa-solid fa-share"
          ></i>
        </div>
      </div>
    </div>
  );
}
