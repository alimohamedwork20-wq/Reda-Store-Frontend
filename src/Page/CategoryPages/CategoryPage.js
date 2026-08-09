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
    <div className="product-card">
      <Link to={`/product/${item.id}`} className="product-card-link">
        <img src={item.thumbnail} className="product-image" alt={item.title} />
        <h3 style={{ marginTop: "15px", fontSize: "22px" }}>{item.title}</h3>
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
            e.preventDefault(); // لمنع الانتقال لصفحة تفاصيل المنتج عند الضغط على الزر
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}

      {/* قسم السعر */}
      <div className="product-price-section">
        <Link
          style={{ display: "flex", flexDirection: "column" }}
          to={`/product/${item.id}`}
          className="product-card-link"
        >
          <span className="rating">{renderStars(item.rating)}</span>
          <span
            className="price"
            style={{ fontWeight: "bold", color: "#0284c7", marginTop: "10px" }}
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
    // إعادة تعيين العدد الافتراضي ليكون 8 عند تغيير القسم
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
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "50px 0",
                }}
              >
                <Loading />
              </div>
            ) : products.length > 0 ? (
              /* 3️⃣ اقتطاع المصفوفة لعرض أول visibleCount منتج فقط */
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
