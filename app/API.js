import axios from 'axios';
import { db } from '@/uploadData'; // Adjust the path as necessary
import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';

// const BASE_URL = 'https://next-ecommerce-api.vercel.app';

/**
 * Fetches products based on various filters and sorting options.
 *
 * @async
 * @param {Object} params - The parameters for fetching products.
 * @param {string} [params.sortBy='id'] - The field to sort by (default is 'id').
 * @param {string} [params.order='asc'] - The order of sorting (default is 'asc').
 * @param {number} [params.limit=20] - The maximum number of products to fetch (default is 20).
 * @param {number} [params.skip=0] - The number of products to skip (for pagination).
 * @param {string} [params.category=''] - The category to filter products by (default is an empty string).
 * @param {string} [params.search=''] - The search term to filter products by (default is an empty string).
 * @returns {Promise<Array>} A promise that resolves to an array of fetched products.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export const fetchProducts = async (params) => {
    try {
        const productsRef = collection(db, 'products'); // Assuming your collection is named 'products'
        const q = query(
            productsRef,
            orderBy(params.sortBy || 'id', params.order || 'asc'), // Default order by 'id'
            limit(params.limit || 20), // Default limit
            startAfter(params.skip || 0) // Pagination
        );

        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Format data

        console.log("Fetched products successfully:", products);
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

/**
 * Fetches categories from the API.
 *
 * @async
 * @returns {Promise<Array>} A promise that resolves to an array of fetched categories.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export const fetchCategories = async () => {
    try {
        const categoriesRef = collection(db, 'categories'); // Assuming your collection is named 'categories'
        const querySnapshot = await getDocs(categoriesRef);
        const categories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log("Fetched categories successfully:", categories);
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};