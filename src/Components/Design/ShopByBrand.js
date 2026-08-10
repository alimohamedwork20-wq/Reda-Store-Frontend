import React from "react";
import { Link } from "react-router-dom";
import "./ShopByBrand.css";

const publicUrl = process.env.PUBLIC_URL;

const brandsData = [
  {
    id: 1,
    name: "SAMSUNG",
    slug: "samsung",
    logo: `./img/samsung.jpg`,
  },
  { id: 2, name: "iPhone", slug: "apple", logo: `./img/iphone.jpg` },
  {
    id: 3,
    name: "Xiaomi",
    slug: "xiaomi",
    logo: `./img/xiaomi.jpg`,
  },

  {
    id: 5,
    name: "Infinix",
    slug: "infinix",
    logo: `./img/infinx.jpg`,
  },
  { id: 6, name: "HONOR", slug: "honor", logo: `${publicUrl}/img/honor.jpg` },
  { id: 7, name: "oppo", slug: "oppo", logo: `${publicUrl}/img/oppo.jpg` },
  {
    id: 9,
    name: "realme",
    slug: "realme",
    logo: `./img/realmejpg.jpg`,
  },

  {
    id: 12,
    name: "Iphone",
    slug: "iphone",
    logo: `./img/iphone.jpg`,
  },
];

export default function ShopByBrand() {
  return (
    <section className="shop-by-brand-section">
      <h2 className="section-title">Shopping by brand</h2>
      <p>
        Shop according to your brand; we partner with the most famous brands.
      </p>
      <div className="brands-grid">
        {brandsData.map((brand) => (
          <div className="brand-logo-wrapper">
            <img src={brand.logo} alt={brand.name} className="brand-logo-img" />
          </div>
        ))}
      </div>
    </section>
  );
}
