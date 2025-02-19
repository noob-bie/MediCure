import React from "react";
import { useParams } from "react-router-dom";
//import {goods} from "./shop/shop_goods"; // Import goods data
//import { Home_Care_link, Baby_Mom_Care_link, Medicine_link } from "./link.js";
const SingleProduct = () => {
  const { productName } = useParams();

  // // Decode product name from URL
  // const decodedProductName = decodeURIComponent(productName);

  // // Find the matching product
  // const product = goods.find((item) => item.name === decodedProductName);

  // if (!product) {
  //   return <h2>Product Not Found</h2>;
  // }

  return (
    <div className="product-detail-container">
      {/* <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h2>{product.name}</h2>
        <h4>{product.Generic_Name}</h4>
        <p>{product.description}</p>
        <h3>Price: {product.price}</h3>
      </div> */}
    </div>
  );
};

export default SingleProduct;
