import React from "react";
import Slide from "../../components/slide/Slide";
import { useState, useEffect } from "react";
import "./Home.css";

const featuredMedicines = [
  {
    name: " Napa (500mg)",
    Generic_Name:"Paracetamol",
    description: "Pain reliever and fever reducer.",
    price: "৳30",
    image: "https://epharma.com.bd/storage/app/public/YAc63qF4DRdd4GParo03FyE17vVRCKEFFZc2eGoi.webp",
  },
  {
    name: " Ace (500mg)",
    Generic_Name:"Paracetamol",
    description: "Pain reliever and fever reducer.",
    price: "৳12",
    image: "https://medeasy.health/_next/image?url=https://api.medeasy.health/media/medicines/ace-500-mg.jpg&w=750&q=75",
  },
  {
    name: "Losectil (20mg)",
    Generic_Name:"Omeprazole ",
    description: "For acidity and ulcers.",
    price: "৳60",
    image: "https://cdn2.arogga.com/eyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC8xMDg5MVwvMTA4OTEtbG9zZWN0aWwtMjAtQ2FwLWNvcHkta3BhMHF6LmpwZWciLCJlZGl0cyI6W119",
  },
  {
    name: "Maxpro (20mg)",
    Generic_Name:"Esomoprazole ",
    description: "For acidity and ulcers.",
    price: "৳60",
    image: "https://medex.com.bd/storage/images/packaging/maxpro-20-mg-tablet-11414064409-i1-pVhK0C8pZNFoIMztwlWS.jpg",
  },
  {
    name: "Alatrol (10 mg)",
    Generic_Name:"Cetirizine",
    description: "Relief from allergies and hay fever.",
    price: "৳25",
    image: "https://medex.com.bd/storage/images/packaging/alatrol-10-mg-tablet-59253519459-i1-OXgsEr7yWZ4WnGge2aGp.jpg",
  },
  {
    name: "Isentin M (2.5mg + 500 mg)",
    Generic_Name:"Linagliptin + Metformin Hydrochloride",
    description: "For managing diabetes.",
    price: "৳50",
    image: "https://www.hplbd.com/products/Isentin_M.jpg",
  },
  {
    name: "Losium (50mg)",
    Generic_Name:"Losartan Potassium",
    description: "For high blood pressure.",
    price: "৳70",
    image: "https://cdn2.arogga.com/eyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC8xMDkwOFwvMTA5MDgtTG9zaXVtLTUwLWNvcHktdHJidTVnLmpwZWciLCJlZGl0cyI6W119",
  },
  {
    name: " Anzitor (10mg)",
    Generic_Name:"Atorvastatin Calcium",
    description: "For cholesterol control.",
    price: "৳90",
    image: "https://medex.com.bd/storage/images/packaging/anzitor-10-mg-tablet-72972527143-i1-WpHt9POqX2ML6NCWDQMN.webp",
  },
  {
    name: "Avloclav (250 mg+125 mg)",
    Generic_Name:"Amoxicillin + Clavulanic Acid",
    description: "Antibiotic for bacterial infections.",
    price: "৳100",
    image: "https://www.acipharma.net/assets/images/products/avloclave-sus.jpg",
  },
  {
    name: "Azicin (250mg)",
    Generic_Name:"Azithromycin Dihydrate",
    description: "Antibiotic for infections.",
    price: "৳120",
    image: "https://cdn2.arogga.com/eyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC8yMDk5XC8yMDk5LUF6aXRob2Npbi0yNTAtY29weS1ja3o1NjAuanBlZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MzAwLCJoZWlnaHQiOjMwMCwiZml0Ijoib3V0c2lkZSJ9fX0=",
  },
  {
    name: "Saline",
    Generic_Name:"Orsaline-N",
    description: "For dehydration and electrolyte balance.",
    price: "৳15",
    image: "https://medex.com.bd/storage/images/packaging/orsaline-n-1025-gm-powder-76097023982-i1-qf6Cczs1KJaSziGlKNZY.webp",
  },
  {
    name: "Ceevit(250 mg)",
    Generic_Name:"Vitamin C [Ascorbic acid]",
    description: "Boosts immunity.",
    price: "৳40",
    image: "https://medeasy.health/_next/image?url=https%3A%2F%2Fapi.medeasy.health%2Fmedia%2Fmedicines%2Fmedeasy_ceevit_250.jpg&w=750&q=75",
  },
];

const Home = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    setMedicines(featuredMedicines);
  }, []);

  return (
    <div className="home-container">
      <Slide />
      <div className="content">
        <h2>Welcome to Medicure</h2>
        <p>Your trusted online pharmacy.</p>
        <p>
          At Medicure, we make healthcare accessible, affordable, and reliable.
          Explore our range of trusted medicines, wellness products, and health
          solutions tailored to your needs. Whether managing chronic conditions
          or looking for everyday essentials, we’re here to prioritize your
          health with care and convenience.
        </p>
      </div>

      <section className="mt-5">
        <h2 className="text-center">Featured Medicines</h2>
        <div className="mt-3 row g-4" id="medicines-container">
          {medicines.map((medicine, i) => (
            <div key={i} className="col-md-4">
              <div className="medicine-card text-center p-3 shadow-sm rounded">
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="img-fluid mb-3"
                  style={{
                    borderRadius: "8px",
                    height: "160px",
                    objectFit: "cover",
                  }}
                />
                <div className="medicine-info">
                
                  <h3 className="h5 mb-2">{medicine.name}</h3>
                  <h4 className="h6 mb-2" >{medicine.Generic_Name}</h4>
                  <p className="mb-1">{medicine.description}</p>
                  
                  <p className="mb-0 text-primary fw-bold">
                    Price: {medicine.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
