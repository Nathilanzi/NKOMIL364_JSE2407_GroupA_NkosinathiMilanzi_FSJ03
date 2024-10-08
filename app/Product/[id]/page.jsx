"use client"; // This is a Client Component because it uses state or client-side behavior

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/uploadData';// Adjust the path as necessary
import { doc, getDoc} from 'firebase/firestore';

export default function ProductDetail({ params }) {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams(); // Get the search parameters from the URL
  const { id } = params; // Destructure the id from the params

  useEffect(() => {
    const fetchProduct = async () => {
      try {
          const docRef = doc(db, 'products', id); // Reference the specific product document by id
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
              const data = { id: docSnap.id, ...docSnap.data() }; // Include the document ID
              setProduct(data);
              setMainImage(data.images[0]); // Set the first image as the main image
          } else {
              console.error('No such product!');
          }
      } catch (error) {
          console.error('Error fetching product:', error);
      }
  };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  const handleBackToProducts = () => {
    // Use router.back() to navigate back to the previous page
    router.back();
  };

  return (
    <div className="max-w-6xl mx-auto my-10 p-5 border rounded-lg shadow-lg">
      {/* Main product image */}
      <div className="grid gap-4 mb-4">
        <div>
          <img 
            src={mainImage} 
            alt={product.title} 
            className="h-64 rounded-lg" 
          />
        </div>
        
        {/* Thumbnail images */}
        <div className="grid grid-cols-5 gap-4">
          {product.images.slice(1).map((image, index) => (
            <div key={index}>
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`} 
                className="h-auto max-w-full rounded-lg cursor-pointer" 
                onClick={() => setMainImage(image)} // Change main image on thumbnail click
              />
            </div>
          ))}
        </div>
      </div>
      
      <h1 className="text-2xl mb-2">{product.title}</h1>
      <p className="text-lg font-semibold text-green-600 mb-2">${product.price}</p>
      <p className="text-sm text-gray-600 mb-4">Category: {product.category}</p>
      
      {/* Display stock and availability */}
      <p className="text-sm text-gray-700 mb-4">
        {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
      </p>

      {/* Display rating */}
      <p className="text-yellow-500 mb-4">
        Rating: {product.rating.rate} (Based on {product.rating.count} reviews)
      </p>

      {/* Display tags */}
      <div className="mb-4">
        {product.tags && product.tags.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Tags:</h2>
            <ul className="list-disc list-inside">
              {product.tags.map((tag, index) => (
                <li key={index} className="text-sm text-gray-600">{tag}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Display reviews */}
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
      
      {/* Back to products link */}
      <button 
        onClick={handleBackToProducts}
        className="text-blue-500 hover:underline"
      >
        Back to Products
      </button>
    </div>
  );
}
