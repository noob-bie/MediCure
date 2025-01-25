import React, { useState, useEffect, useRef } from "react";
import "./Slide.css";
import slide1 from "../../assets/images/slide1.png";
import slide2 from "../../assets/images/slide2.png";
import slide3 from "../../assets/images/slide3.png";
import slide4 from "../../assets/images/slide4.png";
import slide5 from "../../assets/images/slide5.png";

const Slide = () => {
  const slides = [
    { id: 1, image: slide1, caption: "Welcome to Our Website!" },
    { id: 2, image: slide2, caption: "Discover Amazing Features!" },
    { id: 3, image: slide3, caption: "Enjoy the Best Experience!" },
    { id: 4, image: slide4, caption: "Medicines at Your Doorsteps!" },
    { id: 5, image: slide5, caption: "Save Your Money!" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    slideInterval.current = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval.current);
  }, []);

  return (
    <div className="slider">
      <div
        className="slides"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }} // This handles the sliding effect
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="slide"
          >
            <img src={slide.image} alt={`Slide ${slide.id}`} />
            {index === currentSlide && <div className="caption">{slide.caption}</div>}
          </div>
        ))}
      </div>
      <button className="prev" onClick={prevSlide} aria-label="Previous Slide">
        &#10094;
      </button>
      <button className="next" onClick={nextSlide} aria-label="Next Slide">
        &#10095;
      </button>
    </div>
  );
};

export default Slide;
