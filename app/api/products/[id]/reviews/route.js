import { db } from "@/app/firebase"; // Ensure your Firebase setup is correctly exporting the Firestore instance
import { getAuth } from "firebase-admin/auth";
import { doc, addDoc, deleteDoc, updateDoc, collection } from "firebase/firestore";

// Middleware for verifying Firebase ID token
/**
 * This function verifies the Firebase ID token passed in the Authorization header.
 * It ensures that only authenticated users can perform certain actions (like posting or updating reviews).
 * 
 * @param {Request} req - The HTTP request object, which contains the Authorization header.
 * @returns {Object} - Decoded token object if the token is valid.
 * @throws {Error} - Throws an error if the token is invalid or missing.
 */
const verifyToken = async (req) => {
  const authHeader = req.headers.authorization; // Retrieve the Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error("Unauthorized: No token provided"); // Return an error if the token is missing
  }

  const token = authHeader.split('Bearer ')[1]; // Extract the token from the 'Bearer' scheme
  const auth = getAuth(); // Get Firebase Admin Auth instance to verify the token
  const decodedToken = await auth.verifyIdToken(token); // Verify the token and decode user information
  return decodedToken; // Return the decoded token
};

// Handle POST request to submit a review
/**
 * This function handles the creation of a new review for a product.
 * 
 * @param {Request} req - The incoming HTTP request (expects rating, comment, reviewerName, reviewerEmail in JSON body).
 * @param {Object} params - The parameters from the request URL (product ID in this case).
 * @returns {Response} - A response with a success or error message.
 */
export async function POST(req, { params }) {
  const { id } = params; // Extract product ID from URL parameters
  const { rating, comment, reviewerName, reviewerEmail } = await req.json(); // Parse the request body to get review details

  // Ensure the review contains the required fields
  if (!rating || !comment) {
    return new Response(JSON.stringify({ message: "Rating and comment are required" }), { status: 400 });
  }

  try {
    const user = await verifyToken(req); // Verify that the user is authenticated using their token
    const review = {
      rating, // User-provided rating
      comment, // User-provided comment
      reviewerName: reviewerName || user.name || "Anonymous", // Use the provided reviewer name or fallback to user's name or "Anonymous"
      reviewerEmail: reviewerEmail || user.email, // Use the provided email or fallback to user's email
      date: new Date().toISOString(), // Store the current date as the review date
    };

    // Add the review to the Firestore collection for the product's reviews
    await addDoc(collection(db, `products/${id}/reviews`), review);

    // Return success response
    return new Response(JSON.stringify({ message: "Review added successfully" }), { status: 201 });
  } catch (error) {
    console.error("Error adding review:", error); // Log any errors
    return new Response(JSON.stringify({ message: error.message }), { status: 500 }); // Return an error response
  }
}

// Handle PUT request to update a review
/**
 * This function handles updating an existing review for a product.
 * 
 * @param {Request} req - The incoming HTTP request (expects reviewId, rating, and comment in JSON body).
 * @param {Object} params - The parameters from the request URL (product ID in this case).
 * @returns {Response} - A response with a success or error message.
 */
export async function PUT(req, { params }) {
  const { id } = params; // Extract product ID from URL parameters
  const { reviewId, rating, comment } = await req.json(); // Parse the request body to get the review ID and updated review details

  // Ensure the review update contains all required fields
  if (!reviewId || !rating || !comment) {
    return new Response(JSON.stringify({ message: "Review ID, rating, and comment are required" }), { status: 400 });
  }

  try {
    const user = await verifyToken(req); // Verify that the user is authenticated
    const reviewRef = doc(db, `products/${id}/reviews`, reviewId); // Reference the specific review in Firestore

    // Update the review document with new data
    await updateDoc(reviewRef, {
      rating, // Updated rating
      comment, // Updated comment
      date: new Date().toISOString(), // Update the date to reflect the edit time
    });

    // Return success response
    return new Response(JSON.stringify({ message: "Review updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating review:", error); // Log any errors
    return new Response(JSON.stringify({ message: error.message }), { status: 500 }); // Return an error response
  }
}

// Handle DELETE request to remove a review
/**
 * This function handles deleting a review from a product.
 * 
 * @param {Request} req - The incoming HTTP request (expects reviewId in JSON body).
 * @param {Object} params - The parameters from the request URL (product ID in this case).
 * @returns {Response} - A response with a success or error message.
 */
export async function DELETE(req, { params }) {
  const { id } = params; // Extract product ID from URL parameters
  const { reviewId } = await req.json(); // Parse the request body to get the review ID to delete

  // Ensure the request contains the review ID
  if (!reviewId) {
    return new Response(JSON.stringify({ message: "Review ID is required" }), { status: 400 });
  }

  try {
    const user = await verifyToken(req); // Verify that the user is authenticated
    const reviewRef = doc(db, `products/${id}/reviews`, reviewId); // Reference the specific review in Firestore

    // Delete the review document from Firestore
    await deleteDoc(reviewRef);

    // Return success response
    return new Response(JSON.stringify({ message: "Review deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting review:", error); // Log any errors
    return new Response(JSON.stringify({ message: error.message }), { status: 500 }); // Return an error response
  }
}
