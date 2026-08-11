import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { accountService } from "../Apis/accountService";

export default function Search() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // البحث التلقائي
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    accountService
      .GetProductWithSearch(search.trim())
      .then((response) => {
        const products = response.data || [];
        setSuggestions(products.slice(0, 5));
      })
      .catch((err) => {
        console.error("Search error:", err);
        setSuggestions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search]);

  return (
    <div className="search-wrapper">
      <form onSubmit={handleSubmit} className="search-box">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search For Products..."
        />
        <button type="submit">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>

      {/* عرض الاقتراحات */}
      {search.trim() !== "" && !loading && suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((item) => (
            <li key={item.id} className="suggestion-item">
              <Link
                to={`/product/${item.id}`}
                onClick={() => {
                  setSuggestions([]);
                  setSearch("");
                }}
                className="suggestion-link"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="suggestion-img"
                />
                <span className="suggestion-title">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* رسالة عدم وجود نتائج */}
      {search.trim() !== "" && !loading && suggestions.length === 0 && (
        <div className="search-suggestions empty-suggestions">
          No products found.
        </div>
      )}
    </div>
  );
}
