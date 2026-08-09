import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./../Products/ProductsAndSlide.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";
import { showError } from "../Helper/toastCustom";
import toast from "react-hot-toast";
import { accountService } from "../Apis/accountService";
import { getSecureCookie } from "../Helper/cookieUtils";
export default function SlideProducts({ title, dis, style, api, path }) {
  const [category, setCategory] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const userId = getSecureCookie("ith_1854");
  const token = getSecureCookie("tth_1854");
  //-------------------- Get Product --------------------//
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await accountService.GetProducts(api);
        setCategory(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [api]);

  //-------------------- Get Product From Favorites --------------------//
  useEffect(() => {
    if (userId && token) {
      accountService
        .GetProductsFromFavorite(userId)
        .then((data) => setFavoriteItems(data.data))
        .catch(() => {
          showError(
            "An error occurred while retrieving products from Favorites",
          );
        });
    }
  }, []);
  //-------------------- Get Product From Cart --------------------//
  useEffect(() => {
    if (userId && token) {
      accountService
        .GetProductsInCart(userId)
        .then((data) => setCartItems(data.data))
        .catch(() => {
          showError("An error occurred while retrieving products from Cart");
        });
    }
  }, []);
  const isInFav = (id) => favoriteItems.some((fav) => fav.id == id);
  const isInCart = (id) => cartItems.some((cart) => cart.id == id);
  //-------------------- handle Share --------------------//
  const handleShare = (item) => {
    const url = `${window.location.origin}/product/${item.id}`;
    if (navigator.share) {
      navigator.share({ title: item?.title, text: item?.description, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    }
  };

  //-------------------- Add to Cart --------------------//
  function handelCart(item) {
    if (token) {
      setCartItems((prev) => [...prev, item]);
      accountService
        .AddToCart(userId, item.id)
        .then(() => {
          window.dispatchEvent(new Event("cartUpdated"));
        })
        .catch((error) => {
          console.error("Error adding product to cart on server:", error);
        });
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
        { duration: 3000 },
      );
    } else {
      showError("Please login first to manage your Cart!");
    }
  }

  //-------------------- handle Favorite Toggle --------------------//
  function handleFavToggle(item) {
    if (!token) {
      showError("Please login first to manage your favorites!");
      return;
    }
    const currentlyFav = isInFav(item.id);

    if (!currentlyFav) {
      setFavoriteItems((prev) => [...prev, item]);
      accountService
        .AddToFavorite(userId, item.id)
        .then(() => {
          window.dispatchEvent(new Event("favUpdated"));
        })
        .catch((error) => {
          console.error("Error syncing favorite status:", error);
        });
    } else {
      setFavoriteItems((prev) => prev.filter((fav) => fav.id != item.id));
      accountService
        .RemoveFromFavorIte(userId, item.id)
        .then(() => {
          window.dispatchEvent(new Event("favUpdated"));
        })
        .catch((error) => {
          console.error("Error deleting favorite:", error);
        });
    }
  }
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
    <div style={style} className="slide slide-product">
      <div className="container">
        <div className="top-slide">
          <h2>{title}</h2>
          <p>{dis}</p>
        </div>
        <Swiper
          slidesPerView={5}
          breakpoints={{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          loop={category.length > 5}
          speed={800}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          navigation
          modules={[Pagination, Navigation, Autoplay]}
          className="mySwiper"
        >
          {category.length === 0
            ? Array.from({ length: 6 }).map((_, index) => (
                <SwiperSlide key={index}>
                  <Loading />
                </SwiperSlide>
              ))
            : category.map((item) => (
                <SwiperSlide key={item.id}>
                  <div
                    className={`products ${isInCart(item.id) ? "activItems" : ""}`}
                  >
                    <div className="img-products">
                      <Link
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="link"
                        to={`/product/${item.id}`}
                      >
                        <img src={item.thumbnail} alt={item.title} />
                      </Link>

                      <div className="aicons-action">
                        <i
                          onClick={() => handleFavToggle(item)}
                          className={
                            isInFav(item.id)
                              ? "fa-solid fa-heart"
                              : "fa-regular fa-heart"
                          }
                          style={{ cursor: "pointer" }}
                        />

                        {!isInCart(item.id) ? (
                          <i
                            onClick={() => handelCart(item)}
                            className="fa-solid fa-cart-arrow-down"
                            style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <Link to={"/cart"}>
                            <i className="fa-solid fa-cart-shopping"></i>
                          </Link>
                        )}

                        <i
                          onClick={() => handleShare(item)}
                          className="fa-solid fa-share"
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </div>
                    <Link
                      to={`/product/${item.id}`}
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      <p className="name-product">{item.title}</p>
                      <div className="stars">{renderStars(item.rating)}</div>
                      <p className="price">
                        <span>{item.price}$</span>
                      </p>
                    </Link>
                    {isInCart(item.id) && (
                      <span
                        style={{ width: "fit-content" }}
                        className="badge text-bg-primary"
                      >
                        in cart
                      </span>
                    )}
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
}
