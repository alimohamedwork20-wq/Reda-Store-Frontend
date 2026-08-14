import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { accountService } from "../../Components/Apis/accountService";
import { showError } from "../../Components/Helper/toastCustom";
import { getSecureCookie } from "../../Components/Helper/cookieUtils";
export default function Product_info({ product }) {
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const userId = Number(getSecureCookie("ith_1854"));
  const token = getSecureCookie("tth_1854");

  //---------------------- Get Product From Cart && Favorite ----------------------//
  useEffect(() => {
    if (token && userId) {
      // جلب السلة
      accountService
        .GetProductsInCart(userId)
        .then((data) => setCartItems(data?.data || []))
        .catch(() => {
          showError("An error occurred while retrieving products from Cart");
        });

      // جلب المفضلات
      accountService
        .GetProductsFromFavorite(userId)
        .then((data) => setFavoriteItems(data?.data || []))
        .catch(() => {
          showError(
            "An error occurred while retrieving products from Favorite",
          );
        });
    }
  }, [token, userId]);

  //---------------------- Check Product Status ----------------------//
  const isInCart = cartItems.some((item) => item.id == product?.id);
  const isInFav = (id) => favoriteItems.some((fav) => fav.id == id);

  //---------------------- Add to Cart ----------------------//
  function handelCart() {
    if (!token) {
      showError("Please login first to manage your Cart!");
      return;
    }

    // 1. تحديث الـ State محلياً فوراً
    setCartItems((prev) => [...prev, product]);

    // 2. إرسال الطلب للسيرفر وإشعار باقي المكونات (مثل الهيدر)
    accountService
      .AddToCart(userId, product.id)
      .then(() => window.dispatchEvent(new Event("cartUpdated")))
      .catch((error) => {
        console.error("Error adding product to cart:", error);
        // التراجع في حال حدوث خطأ
        setCartItems((prev) => prev.filter((item) => item.id != product.id));
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
      // إضافة للمفضلة محلياً
      setFavoriteItems((prev) => [...prev, product]);

      accountService
        .AddToFavorite(userId, product.id)
        .then(() => window.dispatchEvent(new Event("favUpdated")))
        .catch((error) => {
          console.error("Error adding product to Favorite:", error);
          setFavoriteItems((prev) =>
            prev.filter((fav) => fav.id != product.id),
          );
        });
    } else {
      // حذف من المفضلة محلياً
      setFavoriteItems((prev) => prev.filter((fav) => fav.id != product.id));

      accountService
        .RemoveFromFavorIte(userId, product.id)
        .then(() => window.dispatchEvent(new Event("favUpdated")))
        .catch((error) => {
          console.error("Error removing product from Favorite:", error);
          setFavoriteItems((prev) => [...prev, product]);
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

    // 2. حساب عدد النجوم
    const fullStars = Math.floor(numRating); // عدد النجوم الكاملة (مثال: 3.5 → 3)
    const hasHalfStar = numRating % 1 >= 0.5; // هل يوجد نصف نجمة؟ (0.5 فأكثر)
    const emptyStars = 5 - Math.ceil(numRating); // عدد النجوم الفارغة (مثال: 3.5 → 5 - 4 = 1)

    const stars = [];

    // 3. إضافة النجوم الكاملة
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
    }

    // 4. إضافة نصف نجمة (إذا وجدت)
    if (hasHalfStar) {
      stars.push(<i key="half" className="fa-solid fa-star-half-alt"></i>);
    }

    // 5. إضافة النجوم الفارغة
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
            style={{
              cursor: "pointer",
              color: "#008cff",
            }}
            className={
              isInFav(product?.id) ? "fa-solid fa-heart" : "fa-regular fa-heart"
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
