import React, { useState, useEffect } from "react";
import "./Shop.css";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home_Care_link, Baby_Mom_Care_link, Medicine_link } from "./link.jsx";


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

const goods = [
  {
    name: " Napa (500mg)",
    Generic_Name: "Paracetamol",
    price: "৳30",
    image:
      "https://epharma.com.bd/storage/app/public/YAc63qF4DRdd4GParo03FyE17vVRCKEFFZc2eGoi.webp",
  },
  {
    name: " Ace (500mg)",
    Generic_Name: "Paracetamol",
    price: "৳12",
    image:
      "https://medeasy.health/_next/image?url=https://api.medeasy.health/media/medicines/ace-500-mg.jpg&w=750&q=75",
  },
  {
    name: "Losectil (20mg)",
    Generic_Name: "Omeprazole ",
    price: "৳60",
    image:
      "https://cdn2.arogga.com/eyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC8xMDg5MVwvMTA4OTEtbG9zZWN0aWwtMjAtQ2FwLWNvcHkta3BhMHF6LmpwZWciLCJlZGl0cyI6W119",
  },
  {
    name: "Maxpro (20mg)",
    Generic_Name: "Esomoprazole ",
    price: "৳60",
    image:
      "https://medex.com.bd/storage/images/packaging/maxpro-20-mg-tablet-11414064409-i1-pVhK0C8pZNFoIMztwlWS.jpg",
  },
  {
    name: "Alatrol (10 mg)",
    Generic_Name: "Cetirizine",
    price: "৳25",
    image:
      "https://medex.com.bd/storage/images/packaging/alatrol-10-mg-tablet-59253519459-i1-OXgsEr7yWZ4WnGge2aGp.jpg",
  },
  {
    name: "Isentin M (2.5mg + 500 mg)",
    Generic_Name: "Linagliptin + Metformin Hydrochloride",
    price: "৳50",
    image: "https://www.hplbd.com/products/Isentin_M.jpg",
  },
  {
    name: "Losium (50mg)",
    Generic_Name: "Losartan Potassium",
    price: "৳70",
    image:
      "https://cdn2.arogga.com/eyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC8xMDkwOFwvMTA5MDgtTG9zaXVtLTUwLWNvcHktdHJidTVnLmpwZWciLCJlZGl0cyI6W119",
  },
  {
    name: " Anzitor (10mg)",
    Generic_Name: "Atorvastatin Calcium",
    price: "৳90",
    image:
      "https://medex.com.bd/storage/images/packaging/anzitor-10-mg-tablet-72972527143-i1-WpHt9POqX2ML6NCWDQMN.webp",
  },
  {
    name: "Avloclav (250 mg+125 mg)",
    Generic_Name: "Amoxicillin + Clavulanic Acid",
    price: "৳100",
    image: "https://www.acipharma.net/assets/images/products/avloclave-sus.jpg",
  },
  {
    name: "Azicin (250mg)",
    Generic_Name: "Azithromycin Dihydrate",
    price: "৳120",
    image:
      "https://cdn2.arogga.com/eyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC8yMDk5XC8yMDk5LUF6aXRob2Npbi0yNTAtY29weS1ja3o1NjAuanBlZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MzAwLCJoZWlnaHQiOjMwMCwiZml0Ijoib3V0c2lkZSJ9fX0=",
  },
  {
    name: "Saline",
    Generic_Name: "Orsaline-N",
    price: "৳15",
    image:
      "https://medex.com.bd/storage/images/packaging/orsaline-n-1025-gm-powder-76097023982-i1-qf6Cczs1KJaSziGlKNZY.webp",
  },
  {
    name: "Ceevit(250 mg)",
    Generic_Name: "Vitamin C [Ascorbic acid]",
    price: "৳40",
    image:
      "https://medeasy.health/_next/image?url=https%3A%2F%2Fapi.medeasy.health%2Fmedia%2Fmedicines%2Fmedeasy_ceevit_250.jpg&w=750&q=75",
  },
];
export {goods};
const Shop = () => {
  const [Category, setCategory] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [orderOption, setOrderOption] = useState("");
  const [Goods, shop_goods] = useState([]);

  const location = useLocation();

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
    shop_goods(goods);
  }, []);

  // Handle sort option change
  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    // If sorting by price, popularity, or best sales, wait for order selection
    if (
      (selectedOption === "price" ||
        selectedOption === "popularity" ||
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
    let sortedGoods = [...Goods];

    if (sortOption === "bestSales") {
      sortedGoods.sort((a, b) =>
        orderOption === "descending" ? b.sales - a.sales : a.sales - b.sales
      );
    } else if (sortOption === "popularity") {
      sortedGoods.sort((a, b) =>
        orderOption === "descending"
          ? b.popularity - a.popularity
          : a.popularity - b.popularity
      );
    } else if (sortOption === "price") {
      sortedGoods.sort((a, b) => {
        let priceA = parseFloat(a.price.replace("৳", "").trim()) || 0;
        let priceB = parseFloat(b.price.replace("৳", "").trim()) || 0;
        return orderOption === "descending" ? priceB - priceA : priceA - priceB;
      });
    } else {
      sortedGoods.sort((a, b) =>
        orderOption === "descending"
          ? a.name < b.name
            ? 1
            : -1
          : a.name > b.name
          ? 1
          : -1
      );
    }

    // setProducts(sortedProducts);
    shop_goods(sortedGoods);
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
                <option value="popularity">Popularity</option>
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
              {Goods.map((goods, i) => {
                // Format the name for URL and display
                const urlName = goods.name
                  .toLowerCase()
                  .replace(/\s+/g, "")
                  .replace(/_/g, "");
                const displayName = goods.name.replace(/_/g, " ");

                return (
                  <div key={i} className="goods-card">
                    <img
                      src={goods.image || "default-image.jpg"}
                      alt={goods.name}
                      className="goods-image"
                    />
                    <div className="goods-info">
                      <h3>
                        <Link to={`/shop/${urlName}`}>{displayName}</Link>
                      </h3>
                      <p>{goods.Generic_Name}</p>
                      <h4>{goods.price}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
      <Outlet />
    </div>
  );
};

export default Shop;
