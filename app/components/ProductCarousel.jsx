// components/ProductCarousel.jsx
'use client'; // This tells Next.js this is a client-side component

import { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';

export default function ProductCarousel({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="carousel relative mb-6">
      {/* Previous arrow button */}
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
        onClick={handlePrev}
      >
        <FaArrowLeft />
      </button>

      {/* Current image */}
      < Image src={images[currentImageIndex]} 
      alt={`Product Image ${currentImageIndex + 1}`} 
      width={300}
      height={300}
      className="w-full h-96 object-contain rounded" />

      {/* Next arrow button */}
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
        onClick={handleNext}
      >
        <FaArrowRight />
      </button>

      {/* Image indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${currentImageIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
