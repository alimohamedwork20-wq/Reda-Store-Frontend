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
    if (!token) {
      setFavoriteItems([]);
      return;
    }

    const getProductsFromFavorite = async () => {
      try {
        const res = await accountService.GetProductsFromFavorite();
        setFavoriteItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        showError("An error occurred while retrieving products from Favorites");
      }
    };

    getProductsFromFavorite();
  }, [token]);

  //-------------------- Get Product From Cart --------------------//
  useEffect(() => {
    if (!token) {
      setCartItems([]);
      return;
    }

    accountService
      .GetProductsInCart()
      .then((data) => setCartItems(Array.isArray(data.data) ? data.data : []))
      .catch(() => {
        showError("An error occurred while retrieving products from Cart");
      });
  }, [token]);

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
    if (!token) {
      showError("Please login first to manage your Cart!");
      return;
    }

    setCartItems((prev) => [...prev, item]);
    accountService
      .AddToCart(item.id)
      .then(() => {
        window.dispatchEvent(new Event("cartUpdated"));
      })
      .catch((error) => {
        console.error("Error adding product to cart on server:", error);
        setCartItems((prev) => prev.filter((cart) => cart.id != item.id));
        showError(error.response?.data || "Could not add product to cart");
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
        .AddToFavorite(item.id)
        .then(() => {
          window.dispatchEvent(new Event("favUpdated"));
        })
        .catch((error) => {
          console.error("Error syncing favorite status:", error);
          setFavoriteItems((prev) => prev.filter((fav) => fav.id != item.id));
          showError(
            error.response?.data || "Could not add product to Favorite",
          );
        });
    } else {
      setFavoriteItems((prev) => prev.filter((fav) => fav.id != item.id));
      accountService
        .RemoveFromFavorIte(item.id)
        .then(() => {
          window.dispatchEvent(new Event("favUpdated"));
        })
        .catch((error) => {
          console.error("Error deleting favorite:", error);
          setFavoriteItems((prev) => [...prev, item]);
          showError(
            error.response?.data || "Could not remove product from Favorite",
          );
        });
    }
  }

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
    <div style={style} className="slide slide-product">
      <div className="container">
        <div className="top-slide">
          <h2>{title}</h2>
          <p>{dis}</p>
        </div>
        <Swiper
          slidesPerView={5}
          breakpoints={{
            0: { slidesPerView: 2 },
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
            ? Array.from({ length: 5 }).map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="products skeleton-card">
                    <div className="skeleton-img"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-stars"></div>
                    <div className="skeleton-price"></div>
                  </div>
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
