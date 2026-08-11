import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import SlideProducts from "../../Components/SlideProducts/SlideProducts";
import Loading from "../../Components/Loading/Loading";
import Product_img from "./Product_img";
import Product_info from "./Product_info";
import PageTransition from "../../Components/Helper/PageTransition";
import { accountService } from "../../Components/Apis/accountService";
export default function ProductsDetails() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const path = Number(id);

  useEffect(() => {
    accountService.GetProductById(path).then((data) => setProduct(data.data));
  }, [id]);
  if (!product) {
    return (
      <div className="item-details">
        <div className="container">
          {/* Left Side: Images Skeleton */}
          <div className="imgs-item">
            <div className="skeleton-box skeleton-big-img"></div>
            <div className="sm-img">
              <div className="skeleton-box skeleton-sm-img"></div>
              <div className="skeleton-box skeleton-sm-img"></div>
              <div className="skeleton-box skeleton-sm-img"></div>
              <div className="skeleton-box skeleton-sm-img"></div>
            </div>
          </div>

          {/* Right Side: Product Info Skeleton */}
          <div className="item-name">
            <div className="skeleton-box skeleton-title"></div>
            <div className="skeleton-box skeleton-price"></div>
            <div className="name-details">
              <div className="skeleton-box skeleton-line full"></div>
              <div className="skeleton-box skeleton-line medium"></div>
              <div className="skeleton-box skeleton-line short"></div>
              <div className="skeleton-box skeleton-btn"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <PageTransition key={id}>
      {" "}
      <div className="item-details">
        <div className="container container-product-details">
          {/* Product Img */}
          <Product_img product={product}></Product_img>
          {/* Product Info */}
          <Product_info
            className={"Product_info"}
            product={product}
          ></Product_info>
        </div>

        {/* Slide Products */}
        <SlideProducts
          path={"/product"}
          api={product.category.slug}
          style={{ paddingTop: "10%" }}
          title={`${product.category.slug}:`}
        ></SlideProducts>
      </div>
    </PageTransition>
  );
}
