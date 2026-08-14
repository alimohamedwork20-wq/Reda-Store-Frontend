const fs = require("fs");

const BASE_URL = "https://reda-store-five.vercel.app";

async function generateSitemap() {
  try {
    // جلب الـ Categories
    const categoriesResponse = await fetch(
      "https://dummyjson.com/products/categories",
    );

    const categories = await categoriesResponse.json();

    // جلب كل المنتجات
    const productsResponse = await fetch(
      "https://dummyjson.com/products?limit=0",
    );

    const productsData = await productsResponse.json();
    const products = productsData.products;

    let urls = "";

    // =========================
    // الصفحة الرئيسية
    // =========================
    urls += `
  <url>
    <loc>${BASE_URL}/</loc>
    <priority>1.0</priority>
  </url>`;

    // =========================
    // Categories
    // =========================
    categories.forEach((category) => {
      urls += `
  <url>
    <loc>${BASE_URL}/category/${category.slug}</loc>
    <priority>0.8</priority>
  </url>`;
    });

    // =========================
    // Products
    // =========================
    products.forEach((product) => {
      urls += `
  <url>
    <loc>${BASE_URL}/product/${product.id}</loc>
    <priority>0.7</priority>
  </url>`;
    });

    // =========================
    // الصفحات العامة
    // =========================

    urls += `
  <url>
    <loc>${BASE_URL}/about</loc>
    <priority>0.7</priority>
  </url>`;

    urls += `
  <url>
    <loc>${BASE_URL}/contact</loc>
    <priority>0.7</priority>
  </url>`;

    urls += `
  <url>
    <loc>${BASE_URL}/blog</loc>
    <priority>0.8</priority>
  </url>`;

    // =========================
    // Login / Register
    // =========================

    urls += `
  <url>
    <loc>${BASE_URL}/login</loc>
    <priority>0.5</priority>
  </url>`;

    urls += `
  <url>
    <loc>${BASE_URL}/register</loc>
    <priority>0.5</priority>
  </url>`;

    // =========================
    // إنشاء Sitemap
    // =========================

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    fs.writeFileSync("public/sitemap.xml", sitemap);

    console.log("✅ Sitemap generated successfully!");
    console.log(`📂 Categories: ${categories.length}`);
    console.log(`📦 Products: ${products.length}`);
  } catch (error) {
    console.error("❌ Sitemap generation failed:", error);
    process.exit(1);
  }
}

generateSitemap();
