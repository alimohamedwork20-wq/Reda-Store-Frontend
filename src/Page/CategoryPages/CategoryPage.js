import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageTransition from "../../Components/Helper/PageTransition";
import ArrowUp from "../../Components/Helper/ArrowUp";
import { accountService } from "../../Components/Apis/accountService";
import "./CategoryPage.css";

// مكون معزول لكل كارت منتج لإدارة حالته الخاصة بشكل مستقل
function ProductCard({ item }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // التأكد من وجود وصف وطوله أكبر من 80 حرف
  const isLongDescription = item.description && item.description.length > 80;

  // دالة تقييم النجوم
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

  // دالة تبديل حالة النص الكارت ده بس
  const handleToggleExpand = (e) => {
    e.preventDefault();
    e.stopPropagation(); // منع انتشار الحدث للعناصر الأب
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="product-card">
      <div className="product-card-body">
        <Link to={`/product/${item.id}`} className="product-card-link">
          <div className="product-image-wrapper">
            <img
              src={item.thumbnail}
              className="product-image"
              alt={item.title}
              loading="lazy"
            />
          </div>
          <h3>{item.title}</h3>
        </Link>

        {/* الوصف المعتمد على State الكارت المحلي فقط */}
        <p className={`product-desc ${isExpanded ? "expanded" : ""}`}>
          {item.description}
        </p>

        {/* زرار Show More / Show Less */}
        {isLongDescription && (
          <button
            type="button"
            className="show-more-btn"
            onClick={handleToggleExpand}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {/* قسم السعر والتقييم في أسفل الكارت */}
      <div className="product-price-section">
        <Link
          to={`/product/${item.id}`}
          className="product-card-link flex-col product-price-section-price"
        >
          <span className="rating">{renderStars(item.rating)}</span>
          <span className="price">${item.price}</span>
        </Link>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  const path = location.pathname;
  const lastPart = path.split("/").filter(Boolean).pop();

  useEffect(() => {
    setLoading(true);
    setProducts([]);
    setVisibleCount(8);

    async function GetCategorys() {
      try {
        const res = await accountService.GetProducts(lastPart);
        setProducts(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (lastPart) {
      GetCategorys();
    }
  }, [lastPart]);

  const handleShowMoreProducts = () => {
    setVisibleCount(products.length);
  };

  return (
    <PageTransition>
      <div className="category-products">
        <div className="container">
          {/* الهيدر */}
          <div className="category-header">
            <h1>
              {lastPart} ({products.length})
            </h1>
            <h5>product:</h5>
          </div>

          {/* شبكة المنتجات */}
          <div className="products-grid-container">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="product-card skeleton-card"
                >
                  <div className="skeleton-img"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-price"></div>
                </div>
              ))
            ) : products.length > 0 ? (
              products
                .slice(0, visibleCount)
                .map((item) => <ProductCard key={item.id} item={item} />)
            ) : (
              <p className="no-products">No products found.</p>
            )}
          </div>

          {/* زر عرض المزيد من المنتجات */}
          {!loading && visibleCount < products.length && (
            <div className="load-more-container">
              <button
                className="load-more-products-btn"
                onClick={handleShowMoreProducts}
              >
                Show More Products
              </button>
            </div>
          )}
        </div>
      </div>
      <ArrowUp />
    </PageTransition>
  );
}
