import React from "react";
import { Link } from "react-router-dom";
import "./TopCategorySection.css";

const publicUrl = process.env.PUBLIC_URL;

// اختيار 4 أقسام من القائمة الخاصة بك
const topCategories = [
  {
    id: 1,
    title: "Laptops",
    description: "High performance laptops for work & gaming",
    itemCount: "120+ Products",
    image: `https://eshop.orange.eg/api/CatalogAPI/images/thumbs/0004195_gaming-laptops.jpeg`, // استبدل باسم الصورة عندك
    link: "/category/laptops",
  },
  {
    id: 2,
    title: "Mobile Accessories",
    description: "Cases, chargers, screen protectors & more",
    itemCount: "350+ Products",
    image: `https://www.shutterstock.com/image-photo/mobile-accessories-includes-power-bank-260nw-1791010007.jpg`,
    link: "/category/mobile-accessories",
  },
  {
    id: 3,
    title: "Kitchen Accessories",
    description: "Modern smart tools & essential gadgets",
    itemCount: "90+ Products",
    image: `https://i.ebayimg.com/images/g/sSAAAOSwG-diPZPf/s-l1200.jpg`,
    link: "/category/kitchen-accessories",
  },
  {
    id: 4,
    title: "Mens Watches",
    description: "Elevate your living space with luxury items",
    itemCount: "200+ Products",
    image: `https://www.shutterstock.com/image-photo/luxury-watches-isolated-on-white-260nw-1735132982.jpg`,
    link: "/category/mens-watches",
  },
];

export default function TopCategories() {
  return (
    <section className="top-categories-section">
      {/* رأس القسم مع العنوان والخط الأزرق السفلي */}
      <div className="section-header">
        <h2 className="section-title">Top Categories</h2>
        <div className="title-underline"></div>
        <p className="section-subtitle">
          Explore our most popular and most shopped categories this month
        </p>
      </div>

      {/* شبكة الأقسام الأربعة */}
      <div className="top-categories-grid">
        {topCategories.map((cat) => (
          <Link to={cat.link} key={cat.id} className="category-card">
            <div className="category-img-wrapper">
              <img src={cat.image} alt={cat.title} className="category-img" />
            </div>

            <div className="category-info">
              <h3 className="category-card-title">{cat.title}</h3>
              <p className="category-card-desc">{cat.description}</p>
              <span className="category-count">{cat.itemCount}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
