import React from "react";
import { Link } from "react-router-dom";
import "./TopSaleingProducts.css";

// استخدام مسار الصور المحلي من مجلد public/img
const publicUrl = process.env.PUBLIC_URL;

const topProducts = [
  {
    id: 1,
    title: "iPhone 13 Pro Max",
    category: "Mobile",
    price: "1099.99$",
    oldPrice: "1299.99$",
    rating: 5,
    image: `${publicUrl}/img/TopCategoryIphone.webp`,
    badge: "الأكثر مبيعاً 🔥",
    slug: "155",
  },
  {
    id: 2,
    title: "Apple MacBook Pro 14 Inch Space Grey",
    category: "Laptop",
    price: "1199.99$",
    oldPrice: "1599.99$",
    rating: 5,
    image: `${publicUrl}/img/TopCategoryLaptop.webp`,
    badge: "الأكثر مبيعاً 🔥",
    slug: "110",
  },
  {
    id: 3,
    title: "Realme C35",
    category: "Mobile",
    price: "149.99$",
    oldPrice: "219.99$",
    rating: 4,
    image: `${publicUrl}/img/TopCategoryRealme.webp`,
    badge: "الأعلى تقييماً ⭐",
    slug: "160",
  },
  {
    id: 4,
    title: "Brown Leather Belt Watch",
    category: "Watch",
    price: "89.99$",
    oldPrice: "112.99$",
    rating: 4,
    image: `${publicUrl}/img/TopCategoryWatch.webp`,
    badge: "صفقة اليوم 🏷️",
    slug: "125",
  },
];

export default function TopCategorysSales() {
  return (
    <section className="top-selling-section">
      {/* رأس القسم مع العنوان والخط السفلي المخصص */}
      <div className="section-header">
        <h2 className="section-title">Top sellers in the categories</h2>
        <div className="title-underline"></div>
        <p className="section-subtitle">
          Explore the most requested and popular products from our customers
          this week
        </p>
      </div>

      {/* شبكة/سلايدر المنتجات الأكثر مبيعاً */}
      <div className="top-products-grid">
        {topProducts.map((product) => (
          <div key={product.id} className="top-product-card">
            {/* شارة التمييز */}
            <span className="product-badge">{product.badge}</span>

            {/* صورة المنتج */}
            <div className="product-img-wrapper">
              <img
                src={product.image}
                alt={product.title}
                className="top-product-img"
              />
            </div>

            {/* تفاصيل المنتج */}
            <div className="product-info">
              <span className="product-category-tag">{product.category}</span>
              <h3 className="product-title-text">{product.title}</h3>

              {/* النجوم */}
              <div style={{ fontSize: "23px" }} className="product-rating">
                {"★".repeat(product.rating)}
                {"☆".repeat(5 - product.rating)}
              </div>

              {/* السعر والزر */}
              <div className="product-price-row">
                <div className="price-box">
                  <span className="current-price">{product.price}</span>
                  {product.oldPrice && (
                    <span className="old-price">{product.oldPrice}</span>
                  )}
                </div>
                <Link to={`/product/${product.slug}`} className="buy-now-btn">
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
