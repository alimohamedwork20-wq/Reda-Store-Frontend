import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageTransition from "../../Components/Helper/PageTransition";
import ArrowUp from "../../Components/Helper/ArrowUp";
import Loading from "../../Components/Loading/Loading";
import { accountService } from "../../Components/Apis/accountService";
import "./CategoryPage.css";

// مكون فرعي لبطاقة المنتج لإدارة حالة الـ Show More لكل منتج على حدة
function ProductCard({ item }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // دالة بسيطة لتقدير ما إذا كان النص طويلاً بما يكفي ليستحق ظهور زر Show More
  const isLongDescription = item.description && item.description.length > 80;

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
    <div className="product-card">
      <div>
        <Link to={`/product/${item.id}`} className="product-card-link">
          <img
            src={item.thumbnail}
            className="product-image"
            alt={item.title}
          />
          <h3>{item.title}</h3>
        </Link>

        {/* الوصف مع التحكم في ظهوره بالكامل أو سطرين */}
        <p className={`product-desc ${isExpanded ? "expanded" : ""}`}>
          {item.description}
        </p>

        {/* زر Show More الخاص بوصف المنتج */}
        {isLongDescription && (
          <button
            className="show-more-btn"
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {/* قسم السعر في أسفل الكارت */}
      <div className="product-price-section">
        <Link
          style={{ display: "flex", flexDirection: "column" }}
          to={`/product/${item.id}`}
          className="product-card-link"
        >
          <span className="rating">{renderStars(item.rating)}</span>
          <span
            className="price"
            style={{ fontWeight: "bold", color: "#0284c7", marginTop: "6px" }}
          >
            ${item.price}
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ حالة لإدارة عدد المنتجات المعروضة (القيمة الافتراضية 8)
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
        setLoading(false); // ✅ تصحيح: إيقاف التحميل بعد استلام البيانات
      }
    }

    if (lastPart) {
      GetCategorys();
    }
  }, [lastPart]);

  // 2️⃣ دالة إظهار كل المنتجات المتبقية
  const handleShowMoreProducts = () => {
    setVisibleCount(products.length);
  };

  return (
    <PageTransition>
      <div className="category-products">
        <div className="container">
          {/* الهيدر */}
          <div style={{ borderBottom: "1px solid #bdbdbd" }}>
            <h1
              style={{
                textTransform: "capitalize",
                color: "#1d99f2",
                marginTop: "30px",
              }}
            >
              {lastPart} ({products.length})
            </h1>
            <h5
              style={{
                borderBottom: "1px solid #2c8ae7",
                margin: "0",
                padding: "10px 0",
                width: "fit-content",
              }}
            >
              product:
            </h5>
          </div>

          {/* شبكة المنتجات */}
          <div className="products-grid-container">
            {loading ? (
              /* عرض 8 كروت Skeleton مصممة خصيصاً للتناسق مع الـ Grid */
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="product-card skeleton-card">
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
              <p>No products found.</p>
            )}
          </div>

          {/* 4️⃣ زر Show More Products المخصص للصفحة */}
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
