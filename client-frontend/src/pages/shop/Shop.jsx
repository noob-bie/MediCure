import React, { useState, useEffect } from "react";
import "./Shop.css";
import { Outlet, Link, useLocation, useParams } from "react-router-dom";
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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdckwZSGAFtD6SqoOZA-QUOSRuY_Sob7paMg&s",
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
  const [loadingProducts, setLoadingProducts] = useState(false);
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
    description: "Here you can find all your necessary products of Healthcare, Home Care, Baby & Mom Care, and Medicines in one place.",
  };

  // Determine content based on the current route
  const content = pageContent[location.pathname] || defaultContent;

  useEffect(() => {
    setCategory(Category_type);
  }, []);

  // Fetch products with sorting parameters
  const fetchProducts = async (sortBy = null, sortDirection = 'asc') => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      let apiUrl = "/products";
      const params = new URLSearchParams();

      // Add category parameter if on category route
      if (location.pathname.startsWith('/shop/') && location.pathname !== '/shop') {
        const category = location.pathname.split('/')[2];
        params.append('category', category);
      }

      // Add sorting parameters
      if (sortBy) {
        params.append('sortBy', sortBy);
        params.append('sortDirection', sortDirection);
      }

      // Append parameters to URL if they exist
      if (params.toString()) {
        apiUrl += `?${params.toString()}`;
      }

      console.log("API URL:", apiUrl);
      const res = await axiosInstance.get(apiUrl);
      setProducts(res.data);
      console.log("Products:", res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProductsError("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Initial fetch when component mounts or route changes
  useEffect(() => {
    fetchProducts();
  }, [location.pathname]);

  // Handle sort option change
  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    // Reset order option when sort changes
    if (selectedOption === "") {
      setOrderOption("");
      fetchProducts(); // Fetch without sorting
      return;
    }

    // If we have an order option, apply sorting immediately
    if (orderOption) {
      fetchProducts(selectedOption, orderOption);
    }
  };

  const handleOrderChange = (e) => {
    const selectedOption = e.target.value;
    setOrderOption(selectedOption);

    // If we have a sort option, apply sorting
    if (sortOption && selectedOption) {
      fetchProducts(sortOption, selectedOption);
    } else if (selectedOption === "") {
      // If order is cleared, fetch without sorting
      setSortOption("");
      fetchProducts();
    }
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
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="">Select</option>
                <option value="sales_count">Best Sales</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </select>
            </div>

            <div className="order-container">
              <label htmlFor="order" className="order-label">
                Order by:
              </label>
              <select
                id="order"
                className="order-dropdown"
                value={orderOption}
                onChange={handleOrderChange}
              >
                <option value="">Select</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
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
            <strong>Find Your Daily Necessaries</strong>
          </div>

          <section className="mt-5">
            <div id="goods-container">
              {loadingProducts ? (
                <p>Loading products...</p>
              ) : productsError ? (
                <p>Error: {productsError}</p>
              ) : products.length === 0 ? (
                <p>No products found.</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="goods-card">
                    <img 
                      src={product.image || "default-image.jpg"} 
                      alt={product.name} 
                      className="goods-image" 
                    />
                    <div className="goods-info">
                      <h3>
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                      </h3>
                      <p>{product.category}</p>
                      <h4>
                        ৳{typeof product.price === 'string' 
                          ? parseFloat(product.price).toFixed(2) 
                          : parseFloat(product.price || 0).toFixed(2)
                        }
                      </h4>
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