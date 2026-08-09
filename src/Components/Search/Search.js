import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { accountService } from "../Apis/accountService";

export default function Search() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false); // إضافة اختياري
  const navigate = useNavigate();
  const location = useLocation();

  function handleSubmit(e) {
    e.preventDefault();

    if (search.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
      setSuggestions([]);
      setSearch("");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  // إعادة تعيين الفورم عند تغيير الصفحة
  useEffect(() => {
    setSearch("");
    setSuggestions([]);
  }, [location.pathname]);

  // 🔥 البحث التلقائي (كل ما يكتب حرف)
  useEffect(() => {
    // ✅ لو الـ search فاضي، امسح الاقتراحات ومتبعتش طلب
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    // ✅ منع الطلبات المتكررة وربطها بـ loading
    setLoading(true);

    // ✅ استدعاء الـ API مع إزالة المسافات الزائدة
    accountService
      .GetProductWithSearch(search.trim())
      .then((response) => {
        // ✅ تأكد إن response.data موجودة، ولو مش موجودة خليها array فاضي
        const products = response.data || [];
        setSuggestions(products.slice(0, 5));
      })
      .catch((err) => {
        console.error("Search error:", err);
        setSuggestions([]); // لو حصل خطأ، فضى الاقتراحات
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search]); // يتنفذ كل ما search تتغير

  return (
    <div>
      <form onSubmit={handleSubmit} className="search-box">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search For Products"
        />
        <button type="submit">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>

      {/* عرض الاقتراحات */}
      {search.trim() !== "" && !loading && suggestions.length > 0 && (
        <div style={{ width: "450px" }} className="search-suggestions">
          {suggestions.map((item) => (
            <li
              key={item.id}
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <img
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  marginRight: "10px",
                }}
                src={item.thumbnail}
                alt={item.title}
              />
              <Link
                style={{ width: "100%" }}
                to={`product/${item.id}`}
                onClick={() => {
                  setSuggestions([]); // إغلاق الاقتراحات عند الضغط
                  setSearch(""); // تنظيف الفورم
                }}
              >
                <p style={{ cursor: "pointer", color: "black", margin: 0 }}>
                  {item.title}
                </p>
              </Link>
            </li>
          ))}
        </div>
      )}

      {/* عرض رسالة لو مفيش نتايج */}
      {search.trim() !== "" && !loading && suggestions.length === 0 && (
        <div
          className="search-suggestions"
          style={{ padding: "10px", width: "450px", color: "#888" }}
        >
          No products found.
        </div>
      )}
    </div>
  );
}
