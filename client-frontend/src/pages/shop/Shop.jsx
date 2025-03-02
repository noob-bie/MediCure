import React, { useState, useEffect } from "react";
import "./Shop.css";
import { Outlet, Link, useLocation,useParams } from "react-router-dom";
import { Home_Care_link, Baby_Mom_Care_link, Medicine_link } from "./link.jsx";
import axiosInstance from "../../utils/axiosInstance.js";


const Category_type = [
  {
    name: "Baby & Mom Care",
    description: "Nurture for Moms and Little ones",
    image: Baby_Mom_Care_link,
  },

  {
    name: "Healthcare",
    description: "Essential Healthcare Wellness and Vitality",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdckwZSGAFtD6SqoOZA-QUOSRuY_Sob7paMg&s",
  },
  {
    name: "Home Care",
    description: "Healty Solution for Every Home",
    image: Home_Care_link,
  },

  {
    name: "Medicines",
    description: "Reliable medications for being healthy and protected.",
    image: Medicine_link,
  },
];


const Shop = () => {
  const [Category, setCategory] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [orderOption, setOrderOption] = useState("");
  const [products, setProducts] = useState([]); 
  const [allProducts, setAllProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(false); // Loading state
  const [productsError, setProductsError] = useState(null);

  const location = useLocation();
  const { categoryName } = useParams();

  // Check if we are at the base route or a sub-route
  const isBaseRoute = location.pathname === "/shop";

  // Define content based on the URL path
  const pageContent = {
    "/shop/medicines": {
      title: "Welcome to the realm of Medicines",
      description: "Find Your all emergency medicines here.",
    },
    "/shop/homecare": {
      title: "Homecare Essentials",
      description: "All your homecare needs in one place.",
    },
    "/shop/healthcare": {
      title: "Healthcare Products",
      description: "Your health, our priority.",
    },
    "/shop/baby&momcare": {
      title: "Baby & Mom Care",
      description: "Best products for moms and babies.",
    },
  };
  // Default shop content
  const defaultContent = {
    title: "Shop Here",
    description:
      "Here you can find all your necessary products of Healthcare, Home Care, Baby & Mom Care, and Medicines in one place.",
  };

  // Determine content based on the current route
  const content = pageContent[location.pathname] || defaultContent;

  useEffect(() => {
    setCategory(Category_type);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true); // Set loading to true before API call
      setProductsError(null); // Clear any previous errors
      try {
          let apiUrl = "/products"; // Base API URL
          if (location.pathname.startsWith('/shop/') && location.pathname !== '/shop') { // Check if path starts with /shop/ and is not just /shop (meaning category route)
              const category = location.pathname.split('/')[2]; // Extract category from path e.g., /shop/healthcare => healthcare
              apiUrl = `/products?category=${category}`; // Add category as query parameter
          }

          const res = await axiosInstance.get(apiUrl);
          setProducts(res.data);
          setAllProducts(res.data);
        } catch(err) {  console.error("Error fetching products:", err);
        }
        finally {
          setLoadingProducts(false); // Set loading to false after API call (success or error)
        }
      };
      fetchProducts();
  }, [location.pathname]);


  // Handle sort option change
  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    // If sorting by price, popularity, or best sales, wait for order selection
    if (
      (selectedOption === "price" ||
        selectedOption === "bestSales") &&
      !orderOption
    ) {
      return;
    }

    applySortingAndOrdering(selectedOption, orderOption);
  };

  const handleOrderChange = (e) => {
    const selectedOption = e.target.value;
    setOrderOption(selectedOption);

    // If no sort option is selected, do nothing
    if (!sortOption) return;

    applySortingAndOrdering(sortOption, selectedOption);
  };

  // Function to apply sorting based on current options
  const applySortingAndOrdering = (sortOption, orderOption) => {
    let sortedProducts = [...allProducts];

    if (sortOption === "bestSales") {
      sortedProducts.sort((a, b) =>
        orderOption === "descending" ? b.sales_count - a.sales_count : a.sales_count - b.sales_count
      );
    } else if (sortOption === "price") {
      sortedProducts.sort((a, b) => {
        let priceA = parseFloat(a.price.replace("৳", "").trim()) || 0;
        let priceB = parseFloat(b.price.replace("৳", "").trim()) || 0;
        return orderOption === "descending" ? priceB - priceA : priceA - priceB;
      });
    } else {
      sortedProducts.sort((a, b) =>
        orderOption === "descending"
          ? a.name < b.name
            ? 1
            : -1
          : a.name > b.name
          ? 1
          : -1
      );
    }

    setProducts(sortedProducts);
  };

  return (
    <div className="Shop-container">
      <div className="content">
        <h2>{content.title}</h2>
        <p>{content.description}</p>
      </div>
      {/* Show categories only on the main shop page */}
      {isBaseRoute && (
        <>
          {/* Dropdowns for sorting */}
          <div className="dropdown-container">
            <div className="sort-container">
              <label htmlFor="sort" className="sort-label">
                Sort by:
              </label>
              <select
                id="sort"
                className="sort-dropdown"
                onChange={handleSortChange}
              >
                <option value="">Select</option>
                <option value="bestSales">Best Sales</option>
                <option value="price">Price</option>
              </select>
            </div>

            <div className="order-container">
              <label htmlFor="order" className="order-label">
                Order by:
              </label>
              <select
                id="order"
                className="order-dropdown"
                onChange={handleOrderChange}
              >
                <option value="">Select</option>
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </select>
            </div>
          </div>

          <div className="category-container">
            <strong>Category</strong>
          </div>

          <section className="mt-5">
            <div id="Category-container">
              {Category.map((category, i) => {
                // Format the name for URL and display
                const urlName = category.name
                  .toLowerCase()
                  .replace(/\s+/g, "")
                  .replace(/_/g, "");
                const displayName = category.name.replace(/_/g, " ");

                return (
                  <div key={i} className="category-card">
                    <img
                      src={category.image || "default-image.jpg"}
                      alt={category.name}
                      className="category-image"
                    />
                    <div className="category_type-info">
                      <h3>
                        <Link to={`/shop/${urlName}`}>{displayName}</Link>
                      </h3>
                      <p>{category.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="goods-container">
            <strong>Find Your Daily Necessaries </strong>
          </div>

          <section className="mt-5">
            <div id="goods-container">
            {products.length === 0 ? (
                <p>Loading products...</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="goods-card">
                    <img src={product.image ? product.image : "default-image.jpg"} alt={product.name} className="goods-image" />
                    <div className="goods-info">
                      <h3>
                      <Link to={`/shop/${product.id}`}>{product.name}</Link>
                      </h3>
                      <p>{product.category}</p>
                      {console.log("Product Price Type:", typeof product.price, "Value:", product.price)}
                      <h4>৳{product.price ? parseFloat(product.price).toFixed(2) : "N/A"}</h4>
                    </div>
                  </div>
                ))
              )}

            </div>
          </section>
        </>
      )}
      <Outlet />
    </div>
  );
};

export default Shop;
