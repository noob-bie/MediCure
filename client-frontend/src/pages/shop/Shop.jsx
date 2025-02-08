import React, { useState, useEffect } from "react";
import "./Shop.css";
import { Link } from "react-router-dom";
import { Home_Care_link, Baby_Mom_Care_link, Medicine_link } from "./link.jsx";

const Products_type = [
  {
    name: "Baby & Mom Care",
    description: "Care Comes to You",
    image: Baby_Mom_Care_link,
  },

  {
    name: "Healthcare",
    description: "Care Comes to You",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdckwZSGAFtD6SqoOZA-QUOSRuY_Sob7paMg&s",
  },
  {
    name: "Home Care",
    description: "Care Comes to You",
    image: Home_Care_link,
  },
  
  {
    name: "Medicines",
    description: "Care Comes to You",
    image: Medicine_link,
  },
];

const med = [
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


const healthcare_Products = [
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


const babyANDmom_Products = [
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

const Shop = () => {
  const [Products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [orderOption, setOrderOption] = useState("");
  const [Med, shop_med] = useState([]);
  const[healthcare,shop_heatlcare]=useState([]);
  const[homecare,shop_homecare]=useState([]);
  const[baby_mom,shop_babyMoM]=useState([]);


  useEffect(() => {
    setProducts(Products_type);
  }, []);

  useEffect(() => {
    shop_med(med);
  }, []);

  useEffect(()=>{
    shop_heatlcare(healthcare_Products);
  }, []);

  useEffect(()=>{
    shop_homecare(homecare_Products);
  },[]);

  useEffect(()=>{
    shop_babyMoM(babyANDmom_Products);
  },[]);

  // Handle sort option change
  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);
  
    // If sorting by price, popularity, or best sales, wait for order selection
    if ((selectedOption === "price" || selectedOption === "popularity" || selectedOption === "bestSales") && !orderOption) {
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
    // let sortedProducts = [...Products];
    let sortedMeds = [...Med];
    let sortedHealthcare=[...healthcare];
    let sortedHomecare=[...homecare];
    let sortedBabyaNdMomcare=[...baby_mom];


  
    if (sortOption === "bestSales") {
      // sortedProducts.sort((a, b) => (orderOption === "descending" ? b.sales - a.sales : a.sales - b.sales));
      sortedMeds.sort((a, b) => (orderOption === "descending" ? b.sales - a.sales : a.sales - b.sales));
      sortedHealthcare.sort((a, b) => (orderOption === "descending" ? b.sales - a.sales : a.sales - b.sales));
      sortedHomecare.sort((a, b) => (orderOption === "descending" ? b.sales - a.sales : a.sales - b.sales));
      sortedBabyaNdMomcare.sort((a, b) => (orderOption === "descending" ? b.sales - a.sales : a.sales - b.sales));
    } else if (sortOption === "popularity") {
      // sortedProducts.sort((a, b) => (orderOption === "descending" ? b.popularity - a.popularity : a.popularity - b.popularity));
      sortedMeds.sort((a, b) => (orderOption === "descending" ? b.popularity - a.popularity : a.popularity - b.popularity));
      sortedHealthcare.sort((a, b) => (orderOption === "descending" ? b.popularity - a.popularity : a.popularity - b.popularity));
      sortedHomecare.sort((a, b) => (orderOption === "descending" ? b.popularity - a.popularity : a.popularity - b.popularity));
      sortedBabyaNdMomcare.sort((a, b) => (orderOption === "descending" ? b.popularity - a.popularity : a.popularity - b.popularity));
    } else if (sortOption === "price") {
      sortedMeds.sort((a, b) => {
        let priceA = parseFloat(a.price.replace("৳", "").trim()) || 0;
        let priceB = parseFloat(b.price.replace("৳", "").trim()) || 0;
        return orderOption === "descending" ? priceB - priceA : priceA - priceB;
      });

      sortedHealthcare.sort((a, b) => {
        let priceA = parseFloat(a.price.replace("৳", "").trim()) || 0;
        let priceB = parseFloat(b.price.replace("৳", "").trim()) || 0;
        return orderOption === "descending" ? priceB - priceA : priceA - priceB;
      });

      sortedHomecare.sort((a, b) => {
        let priceA = parseFloat(a.price.replace("৳", "").trim()) || 0;
        let priceB = parseFloat(b.price.replace("৳", "").trim()) || 0;
        return orderOption === "descending" ? priceB - priceA : priceA - priceB;
      });

      sortedBabyaNdMomcare.sort((a, b) => {
        let priceA = parseFloat(a.price.replace("৳", "").trim()) || 0;
        let priceB = parseFloat(b.price.replace("৳", "").trim()) || 0;
        return orderOption === "descending" ? priceB - priceA : priceA - priceB;
      });

    } else {
      // Default: Sort by name
      // sortedProducts.sort((a, b) =>
      //   orderOption === "descending" ? (a.name < b.name ? 1 : -1) : (a.name > b.name ? 1 : -1)
      // );
      sortedMeds.sort((a, b) =>
        orderOption === "descending" ? (a.name < b.name ? 1 : -1) : (a.name > b.name ? 1 : -1)
      );

      sortedHealthcare.sort((a, b) =>
        orderOption === "descending" ? (a.name < b.name ? 1 : -1) : (a.name > b.name ? 1 : -1)
      );

      sortedHomecare.sort((a, b) =>
        orderOption === "descending" ? (a.name < b.name ? 1 : -1) : (a.name > b.name ? 1 : -1)
      );

      sortedBabyaNdMomcare.sort((a, b) =>
        orderOption === "descending" ? (a.name < b.name ? 1 : -1) : (a.name > b.name ? 1 : -1)
      );
    }
  
    // setProducts(sortedProducts);
    shop_med(sortedMeds);
    shop_heatlcare(sortedHealthcare);
    shop_homecare(sortedHomecare);
    shop_babyMoM(sortedBabyaNdMomcare);

  };
  

  return (
    <div className="Shop-container">
      <div className="content">
        <h2>Shop Here</h2>
        <p>
          Here you can find all your necessary products of Healthcare, Home
          Care, Baby & Mom Care, and Medicines in one place.
        </p>
      </div>

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
        <div id="products-container">
          {Products.map((product, i) => {
            // Format the name for URL and display
            const urlName = product.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/_/g, "");
            const displayName = product.name.replace(/_/g, " ");

            return (
              <div key={i} className="products-card">
                <img
                  src={product.image || "default-image.jpg"}
                  alt={product.name}
                  className="product-image"
                />
                <div className="products_type-info">
                  <h3>
                    <Link to={`/${urlName}`}>{displayName}</Link>
                  </h3>
                  <p>{product.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>



      <div className="medi-container">
        <strong>Medicines</strong>
      </div>

      <section className="mt-5">
        <div id="med-container">
          {Med.map((med, i) => {
            // Format the name for URL and display
            const urlName = med.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/_/g, "");
            const displayName = med.name.replace(/_/g, " ");

            return (
              <div key={i} className="med-card">
                <img
                  src={med.image || "default-image.jpg"}
                  alt={med.name}
                  className="med-image"
                />
                <div className="med-info">
                  <h3>
                    <Link to={`/${urlName}`}>{displayName}</Link>
                  </h3>
                  <p>{med.Generic_Name}</p>
                  <h4>{med.price}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </section>



      <div className="health-container">
        <strong>HealthCare</strong>
      </div>

      <section className="mt-5">
        <div id="healthcare_Products-container">
          {healthcare.map((healthcare_Products, i) => {
            // Format the name for URL and display
            const urlName = healthcare_Products.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/_/g, "");
            const displayName = healthcare_Products.name.replace(/_/g, " ");

            return (
              <div key={i} className="healthcare_Products-card">
                <img
                  src={healthcare_Products.image || "default-image.jpg"}
                  alt={healthcare_Products.name}
                  className="healthcare_Products-image"
                />
                <div className="healthcare_Products-info">
                  <h3>
                    <Link to={`/${urlName}`}>{displayName}</Link>
                  </h3>
                  
                  <h4>{healthcare_Products.price}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      <div className="homecare-container">
        <strong>HomeCare</strong>
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
                    <Link to={`/${urlName}`}>{displayName}</Link>
                  </h3>
                  <h4>{homecare_Products.price}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      <div className="babyANDmom-container">
        <strong>Baby & Mom</strong>
      </div>

      <section className="mt-5">
        <div id="babyANDmom_Products-container">
          {baby_mom.map((babyANDmom_Products, i) => {
            // Format the name for URL and display
            const urlName = babyANDmom_Products.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/_/g, "");
            const displayName = babyANDmom_Products.name.replace(/_/g, " ");

            return (
              <div key={i} className="babyANDmom_Products-card">
                <img
                  src={babyANDmom_Products.image || "default-image.jpg"}
                  alt={babyANDmom_Products.name}
                  className="babyANDmom_Products-image"
                />
                <div className="babyANDmom_Products-info">
                  <h3>
                    <Link to={`/${urlName}`}>{displayName}</Link>
                  </h3>
                 
                  <h4>{babyANDmom_Products.price}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </section>


    </div>
  );
};

export default Shop;
