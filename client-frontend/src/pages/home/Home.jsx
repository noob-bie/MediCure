import React from "react";
import Slide from "../../components/slide/Slide";
import { useState, useEffect } from "react";
import "./Home.css";

const featuredMedicines = [
  {
    name: "Paracetamol (500mg)",
    description: "Pain reliever and fever reducer.",
    price: "৳30",
    image: "PLACEHOLDER_IMAGE_LINK_1",
  },
  {
    name: "Omeprazole (20mg)",
    description: "For acidity and ulcers.",
    price: "৳60",
    image: "PLACEHOLDER_IMAGE_LINK_2",
  },
  {
    name: "Cetirizine",
    description: "Relief from allergies and hay fever.",
    price: "৳25",
    image: "PLACEHOLDER_IMAGE_LINK_3",
  },
  {
    name: "Metformin (500mg)",
    description: "For managing diabetes.",
    price: "৳50",
    image: "PLACEHOLDER_IMAGE_LINK_4",
  },
  {
    name: "Losartan (50mg)",
    description: "For high blood pressure.",
    price: "৳70",
    image: "PLACEHOLDER_IMAGE_LINK_5",
  },
  {
    name: "Atorvastatin (10mg)",
    description: "For cholesterol control.",
    price: "৳90",
    image: "PLACEHOLDER_IMAGE_LINK_6",
  },
  {
    name: "Amoxicillin (500mg)",
    description: "Antibiotic for bacterial infections.",
    price: "৳100",
    image: "PLACEHOLDER_IMAGE_LINK_7",
  },
  {
    name: "Azithromycin (500mg)",
    description: "Antibiotic for infections.",
    price: "৳120",
    image: "PLACEHOLDER_IMAGE_LINK_8",
  },
  {
    name: "Orsaline",
    description: "For dehydration and electrolyte balance.",
    price: "৳15",
    image: "PLACEHOLDER_IMAGE_LINK_9",
  },
  {
    name: "Vitamin C",
    description: "Boosts immunity.",
    price: "৳40",
    image: "PLACEHOLDER_IMAGE_LINK_10",
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
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <div className="medicine-info">
                  <h3 className="h5 mb-2">{medicine.name}</h3>
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
