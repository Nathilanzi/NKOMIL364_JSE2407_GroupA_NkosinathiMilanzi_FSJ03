"use client"; // Ensure this is a Client Component

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Import for app router 
import { db } from '@/uploadData'; // Adjust the path as necessary
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image'; // Next.js Image component for optimization

export default function ProductDetail({ params }) {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams(); // Fetch search parameters from the URL
  const { id } = params; // Destructure the product ID from params

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const paddedId = id.toString().padStart(3, "0")
        const docRef = doc(db, 'products', paddedId); // Firebase document reference
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() }; // Combine document ID with data
          setProduct(data);
          setMainImage(data.images[0]); // Set the first image as the main image
        } else {
          console.error('No such product exists!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]); // Ensure that the useEffect runs when `id` changes

  if (!product) {
    return <p>Loading...</p>; // Display a loading state while fetching
  }

  const handleBackToProducts = () => {
    router.back(); // Use router.back() to return to the previous page
  };

  return (
    <div className="max-w-6xl mx-auto my-10 p-5 border rounded-lg shadow-lg">
      {/* Main Product Image */}
      <div className="grid gap-4 mb-4">
        <div className="relative w-full h-64">
          <Image
            src={mainImage}
            alt={product.title}
            layout="fill" // Allows dynamic adjustment for Next.js Image optimization
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Thumbnail Images */}
        <div className="grid grid-cols-5 gap-4">
          {product.images.slice(1).map((image, index) => (
            <div key={index} className="relative w-full h-32">
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg cursor-pointer"
                onClick={() => setMainImage(image)} // Update the main image on click
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <h1 className="text-2xl mb-2">{product.title}</h1>
      <p className="text-lg font-semibold text-green-600 mb-2">${product.price}</p>
      <p className="text-sm text-gray-600 mb-4">Category: {product.category}</p>

      {/* Stock and Availability */}
      <p className="text-sm text-gray-700 mb-4">
        {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
      </p>

      {/* Rating */}
      <p className="text-yellow-500 mb-4">
        Rating: {product.rating.rate} (Based on {product.rating.count} reviews)
      </p>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Tags:</h2>
          <ul className="list-disc list-inside">
            {product.tags.map((tag, index) => (
              <li key={index} className="text-sm text-gray-600">{tag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Reviews */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Reviews:</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <ul>
            {product.reviews.map((review, index) => (
              <li key={index} className="mb-4 border-b pb-4">
                <p className="font-semibold text-gray-800">{review.name}</p>
                <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                <p className="text-yellow-500">Rating: {review.rating}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews available.</p>
        )}
      </div>

      {/* Back to Products Button */}
      <button
        onClick={handleBackToProducts}
        className="text-blue-500 hover:underline"
      >
        Back to Products
      </button>
    </div>
  );
}
