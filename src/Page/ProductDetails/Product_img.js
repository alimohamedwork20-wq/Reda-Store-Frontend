import React, { useState } from "react";

export default function Product_img({ product }) {
  const [active, setActive] = useState("");
  const mainImage = active || product?.thumbnail || "";
  return (
    <div className="imgs-item">
      <div className="big-img">
        <img src={mainImage} alt=""></img>
      </div>
      <div className="sm-img">
        {product?.images?.map((item, index) => (
          <img
            className={`${active === item.imageUrl ? "activ" : ""}`}
            onClick={() => setActive(item.imageUrl)}
            key={index}
            src={item.imageUrl}
            alt=""
          ></img>
        ))}
      </div>
    </div>
  );
}
