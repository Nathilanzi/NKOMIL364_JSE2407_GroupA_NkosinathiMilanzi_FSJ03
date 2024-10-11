"use client"; // Ensure this is a Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import for app router 
import { db } from '@/firebaseConfig'; // Adjust the path as necessary
import { doc, getDoc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; // Import Firebase auth for user state
import Image from 'next/image'; // Next.js Image component for optimization

export default function ProductDetail({ params }) {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [user, setUser] = useState(null); // Track authenticated user
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [editingReview, setEditingReview] = useState(null); // Review being edited
  const [error, setError] = useState(''); // Track errors
  const router = useRouter();
  const { id } = params;

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the authenticated user
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const paddedId = id.toString().padStart(3, "0");
        const docRef = doc(db, 'products', paddedId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setProduct(data);
          setMainImage(data.images?.[0]); // Use optional chaining
        } else {
          setError('No such product exists!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error fetching product.');
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return <p>Loading...</p>; // Display loading state while fetching
  }

  // Add review to the product
  const handleAddReview = async () => {
    if (!user) return; // Ensure user is authenticated
    if (!newReview.rating || !newReview.comment) {
      setError('Please provide a rating and a comment.');
      return;
    }

    try {
      const review = {
        rating: newReview.rating,
        comment: newReview.comment,
        name: user.displayName || "Anonymous",
        email: user.email,
        date: new Date().toISOString(),
      };

      await addDoc(collection(db, `products/${id}/reviews`), review);
      setProduct((prevProduct) => ({
        ...prevProduct,
        reviews: [...prevProduct.reviews, review], // Add the new review locally
      }));
      setNewReview({ rating: '', comment: '' }); // Clear review input
      setError(''); // Clear error state
    } catch (error) {
      console.error('Error adding review:', error);
      setError('Error adding review.');
    }
  };

  // Edit an existing review
  const handleEditReview = async () => {
    if (!user || !editingReview) return; // Ensure user is authenticated

    try {
      const reviewRef = doc(db, `products/${id}/reviews`, editingReview.id);
      await updateDoc(reviewRef, {
        rating: editingReview.rating,
        comment: editingReview.comment,
        date: new Date().toISOString(), // Update timestamp
      });

      // Update review locally
      setProduct((prevProduct) => ({
        ...prevProduct,
        reviews: prevProduct.reviews.map((review) =>
          review.id === editingReview.id ? editingReview : review
        ),
      }));
      setEditingReview(null); // Clear editing state
      setError(''); // Clear error state
    } catch (error) {
      console.error('Error editing review:', error);
      setError('Error editing review.');
    }
  };

  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    if (!user) return; // Ensure user is authenticated

    try {
      const reviewRef = doc(db, `products/${id}/reviews`, reviewId);
      await deleteDoc(reviewRef);

      // Remove the review locally
      setProduct((prevProduct) => ({
        ...prevProduct,
        reviews: prevProduct.reviews.filter((review) => review.id !== reviewId),
      }));
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Error deleting review.');
    }
  };

  const handleBackToProducts = () => {
    router.back(); // Use router.back() to return to the previous page
  };

  return (
    <div className="max-w-6xl mx-auto my-10 p-5 border rounded-lg shadow-lg">
      {error && <p className="text-red-500">{error}</p>} {/* Display errors */}
      <div className="grid gap-4 mb-4">
        <div className="relative w-full h-64">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
            priority={true}
          />
        </div>

        {/* Thumbnail Images */}
        <div className="grid grid-cols-5 gap-4">
          {product.images?.slice(1).map((image, index) => ( // Use optional chaining
            <div key={index} className="relative w-full h-32">
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 20vw, (max-width: 1200px) 10vw, 5vw"
                style={{ objectFit: 'cover' }}
                className="rounded-lg cursor-pointer"
                onClick={() => setMainImage(image)}
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-2xl mb-2">{product.title}</h1>
      <p className="text-lg font-semibold text-green-600 mb-2">${product.price}</p>
      <p className="text-sm text-gray-600 mb-4">Category: {product.category}</p>

      <p className="text-sm text-gray-700 mb-4">
        {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
      </p>

      <p className="text-yellow-500 mb-4">
        Rating: {product.rating.rate} (Based on {product.rating.count} reviews)
      </p>

      {/* Reviews Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Reviews:</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <ul>
            {product.reviews.map((review) => (
              <li key={review.id} className="mb-4 border-b pb-4">
                <p className="font-semibold text-gray-800">{review.name}</p>
                <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                <p className="text-yellow-500">Rating: {review.rating}</p>
                {user && user.email === review.email && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingReview(review)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews available.</p>
        )}

        {/* Add or Edit Review Form */}
        {user ? (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">
              {editingReview ? 'Edit Your Review' : 'Add a Review'}
            </h3>
            <input
              type="number"
              min="1"
              max="5"
              value={editingReview ? editingReview.rating : newReview.rating}
              onChange={(e) =>
                editingReview
                  ? setEditingReview({ ...editingReview, rating: e.target.value })
                  : setNewReview({ ...newReview, rating: e.target.value })
              }
              placeholder="Rating (1-5)"
              className="border p-2 rounded mb-2 w-full"
            />
            <textarea
              value={editingReview ? editingReview.comment : newReview.comment}
              onChange={(e) =>
                editingReview
                  ? setEditingReview({ ...editingReview, comment: e.target.value })
                  : setNewReview({ ...newReview, comment: e.target.value })
              }
              placeholder="Your review"
              className="border p-2 rounded mb-2 w-full"
            />
            <button
              onClick={editingReview ? handleEditReview : handleAddReview}
              className="bg-blue-500 text-white p-2 rounded"
            >
              {editingReview ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        ) : (
          <p className="text-sm text-red-500 mt-4">
            You must be signed in to leave a review.
          </p>
        )}
      </div>

      <button
        onClick={handleBackToProducts}
        className="mt-4 bg-gray-300 text-black p-2 rounded"
      >
        Back to Products
      </button>
    </div>
  );
}
