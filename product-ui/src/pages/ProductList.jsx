import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductList.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});
  const [scrollIndex, setScrollIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;

      if (width <= 600 && isPortrait) setVisibleCount(1);
      else if (width <= 900) setVisibleCount(2);
      else if (width <= 1200) setVisibleCount(3);
      else setVisibleCount(4);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    window.addEventListener("orientationchange", updateVisibleCount);
    return () => {
      window.removeEventListener("resize", updateVisibleCount);
      window.removeEventListener("orientationchange", updateVisibleCount);
    };
  }, []);

  useEffect(() => {
    axios
      .get("https://product-list-1dn8.onrender.com/products")
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error("Products fetch error:", err));
  }, []);

  const handleColorSelect = (productName, colorKey) => {
    setSelectedColors((prev) => ({ ...prev, [productName]: colorKey }));
  };

  const maxIndex = Math.max(0, products.length - visibleCount);
  const handleScroll = (direction) => {
    let newIndex = scrollIndex + (direction === "right" ? 1 : -1);
    if (newIndex < 0) newIndex = 0;
    if (newIndex > maxIndex) newIndex = maxIndex;
    setScrollIndex(newIndex);
  };

  const computePrice = (p) =>
    p?.price !== undefined && !isNaN(Number(p.price))
      ? Number(p.price).toFixed(2)
      : "N/A";

  const computeRating = (p) => {
    const popularityRaw = Number(p.popularityScore) || 0;
    const normalized = popularityRaw <= 1 ? popularityRaw : popularityRaw / 100;
    return (normalized * 5).toFixed(1);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const fillLevel = Math.min(Math.max(rating - (i - 1), 0), 1);
      stars.push(
        <span
          key={i}
          className="star dynamic"
          style={{ "--fill": `${fillLevel * 100}%` }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const colorHex = {
    yellow: "#E6CA97",
    white: "#D9D9D9",
    rose: "#E1A4A9",
    gold: "#E6CA97",
    silver: "#D9D9D9",
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Product List</h1>

      <div className="product-slider-container">
        <button
          className="arrow-btn left"
          onClick={() => handleScroll("left")}
          disabled={scrollIndex === 0}
          aria-label="previous"
        >
          ◀
        </button>

        <div className="product-slider">
          <div
            className="product-slider-inner"
            style={{
              transform: `translateX(-${scrollIndex * (100 / visibleCount)}%)`,
            }}
          >
            {products.map((p, idx) => {
              const productName = p.name || `product-${idx}`;
              const availableColors = p.images ? Object.keys(p.images) : [];
              const defaultColor =
                selectedColors[productName] ||
                (availableColors[0] ?? "yellow");
              const imageUrl = p.images ? p.images[defaultColor] : "";
              const rating = Number(computeRating(p));

              return (
                <div
                  className="product-card"
                  key={productName}
                  style={{ flex: `0 0 ${100 / visibleCount}%` }}
                >
                  <div className="product-image-wrap">
                    {imageUrl ? (
                      <img src={imageUrl} alt={productName} loading="lazy" />
                    ) : (
                      <div className="placeholder">No Image</div>
                    )}
                  </div>

                  <h3 className="product-title">{productName}</h3>
                  <p className="product-price">${computePrice(p)} USD</p>

                  <div className="color-options">
                    {availableColors.map((colorKey) => (
                      <button
                        key={colorKey}
                        className={`color-btn ${
                          defaultColor === colorKey ? "active" : ""
                        }`}
                        onClick={() => handleColorSelect(productName, colorKey)}
                        title={colorKey}
                        style={{
                          backgroundColor: colorHex[colorKey] || "#ccc",
                        }}
                        aria-pressed={defaultColor === colorKey}
                      />
                    ))}
                  </div>

                  <div className="rating-section">
                    <div className="stars">{renderStars(rating)}</div>
                    <span className="rating-text">{rating}/5</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="arrow-btn right"
          onClick={() => handleScroll("right")}
          disabled={scrollIndex >= maxIndex}
          aria-label="next"
        >
          ▶
        </button>
      </div>
    </div>
  );
}