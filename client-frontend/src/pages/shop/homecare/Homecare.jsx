import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./Homecare.css";

const homecare_Products = [
  {
    name: " Napa (500mg)",
    price: "৳30",
    image:
      "https://epharma.com.bd/storage/app/public/YAc63qF4DRdd4GParo03FyE17vVRCKEFFZc2eGoi.webp",
  },
  {
    name: " Ace (500mg)",
    price: "৳12",
    image:
      "https://medeasy.health/_next/image?url=https://api.medeasy.health/media/medicines/ace-500-mg.jpg&w=750&q=75",
  },
  {
    name: "Losectil (20mg)",
    price: "৳60",
    image:
      "https://cdn2.arogga.com/eyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC8xMDg5MVwvMTA4OTEtbG9zZWN0aWwtMjAtQ2FwLWNvcHkta3BhMHF6LmpwZWciLCJlZGl0cyI6W119",
  },
  {
    name: "Maxpro (20mg)",
    price: "৳60",
    image:
      "https://medex.com.bd/storage/images/packaging/maxpro-20-mg-tablet-11414064409-i1-pVhK0C8pZNFoIMztwlWS.jpg",
  },
  {
    name: "Alatrol (10 mg)",
    price: "৳25",
    image:
      "https://medex.com.bd/storage/images/packaging/alatrol-10-mg-tablet-59253519459-i1-OXgsEr7yWZ4WnGge2aGp.jpg",
  },
  {
    name: "Isentin M (2.5mg + 500 mg)",
    price: "৳50",
    image: "https://www.hplbd.com/products/Isentin_M.jpg",
  },
  {
    name: "Losium (50mg)",
    price: "৳70",
    image:
      "https://cdn2.arogga.com/eyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC8xMDkwOFwvMTA5MDgtTG9zaXVtLTUwLWNvcHktdHJidTVnLmpwZWciLCJlZGl0cyI6W119",
  },
  {
    name: " Anzitor (10mg)",
    price: "৳90",
    image:
      "https://medex.com.bd/storage/images/packaging/anzitor-10-mg-tablet-72972527143-i1-WpHt9POqX2ML6NCWDQMN.webp",
  },
  {
    name: "Avloclav (250 mg+125 mg)",
    price: "৳100",
    image: "https://www.acipharma.net/assets/images/products/avloclave-sus.jpg",
  },
  {
    name: "Azicin (250mg)",
    price: "৳120",
    image:
      "https://cdn2.arogga.com/eyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC8yMDk5XC8yMDk5LUF6aXRob2Npbi0yNTAtY29weS1ja3o1NjAuanBlZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MzAwLCJoZWlnaHQiOjMwMCwiZml0Ijoib3V0c2lkZSJ9fX0=",
  },
  {
    name: "Saline",
    price: "৳15",
    image:
      "https://medex.com.bd/storage/images/packaging/orsaline-n-1025-gm-powder-76097023982-i1-qf6Cczs1KJaSziGlKNZY.webp",
  },
  {
    name: "Ceevit(250 mg)",
    price: "৳40",
    image:
      "https://medeasy.health/_next/image?url=https%3A%2F%2Fapi.medeasy.health%2Fmedia%2Fmedicines%2Fmedeasy_ceevit_250.jpg&w=750&q=75",
  },
];

const Homecare = () => {
  const [sortOption, setSortOption] = useState("");
  const [orderOption, setOrderOption] = useState("");
  const [homecare, shop_homecare] = useState([]);

  useEffect(() => {
    shop_homecare(homecare_Products);
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
    let sortedHomecare = [...homecare];

    if (sortOption === "bestSales") {
      sortedHomecare.sort((a, b) =>
        orderOption === "descending" ? b.sales - a.sales : a.sales - b.sales
      );
    } else if (sortOption === "popularity") {
      sortedHomecare.sort((a, b) =>
        orderOption === "descending"
          ? b.popularity - a.popularity
          : a.popularity - b.popularity
      );
    } else if (sortOption === "price") {
      sortedHomecare.sort((a, b) => {
        let priceA = parseFloat(a.price.replace("৳", "").trim()) || 0;
        let priceB = parseFloat(b.price.replace("৳", "").trim()) || 0;
        return orderOption === "descending" ? priceB - priceA : priceA - priceB;
      });
    } else {
      sortedHomecare.sort((a, b) =>
        orderOption === "descending"
          ? a.name < b.name
            ? 1
            : -1
          : a.name > b.name
          ? 1
          : -1
      );

      // setProducts(sortedProducts);

      shop_homecare(sortedHomecare);
    }
  };
  return (
    <div className="Homecare-container">
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

      <section className="mt-5">
        <div id="homecare_Products-container">
          {homecare.map((homecare_Products, i) => {
            // Format the name for URL and display
            const urlName = homecare_Products.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/_/g, "");
            const displayName = homecare_Products.name.replace(/_/g, " ");

            return (
              <div key={i} className="homecare_Products-card">
                <img
                  src={homecare_Products.image || "default-image.jpg"}
                  alt={homecare_Products.name}
                  className="homecare_Products-image"
                />
                <div className="homecare_Products-info">
                  <h3>
                    <Link to={`/shop/homecare/${urlName}`}>{displayName}</Link>
                  </h3>
                  <h4>{homecare_Products.price}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Homecare;
