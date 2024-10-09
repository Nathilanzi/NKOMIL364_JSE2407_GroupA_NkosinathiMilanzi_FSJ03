import { collection, getDocs, query, orderBy, limit, startAfter, where, getCountFromServer } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
/**
 * Fetches products based on various filters and sorting options.
 *
 * @async
 * @param {Object} params - The parameters for fetching products.
 * @param {string} [params.sortBy='id'] - The field to sort by (default is 'id').
 * @param {string} [params.order='asc'] - The order of sorting (default is 'asc').
 * @param {number} [params.limit=20] - The maximum number of products to fetch (default is 20).
 * @param {string} [params.category=''] - The category to filter products by (default is an empty string).
 * @param {string} [params.search=''] - The search term to filter products by (default is an empty string).
 * @param {Object} [params.lastDoc=null] - The last document snapshot for pagination (optional).
 * @returns {Promise<Array>} A promise that resolves to an array of fetched products.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export const fetchProducts = async (params) => {
  try {
    const productsRef = collection(db, 'products'); // Collection is 'products'

    // Initialize query
    let q = query(productsRef);

    // Add sorting
    if (params.sortBy) {
      q = query(q, orderBy(params.sortBy, params.order || 'asc'));
    }

    // Add category filter if provided
    if (params.category) {
      q = query(q, where('category', '==', params.category));
    }

    // Add search filter if a search query is provided
    if (params.search) {
      q = query(q, where('name', '>=', params.search), where('name', '<=', params.search + '\uf8ff'));
    }

    // Add pagination if `lastDoc` is provided for `startAfter`
    if (params.lastDoc) {
      q = query(q, startAfter(params.lastDoc));
    }

    // Limit the number of documents fetched
    q = query(q, limit(params.limit || 20));

    // Fetch data from Firestore
    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]; // For pagination

    const products = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));

    console.log("Fetched products successfully:", products);

    return {
      products,
      lastDoc: lastVisible, // Return the last document for pagination
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetches categories from Firestore.
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

    console.log("Fetched categories successfully:", categories[0].categories);
    return categories[0].categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetches the total count of products in the Firestore collection.
 *
 * @async
 * @returns {Promise<number>} A promise that resolves to the total count of products.
 */
export const fetchTotalProductCount = async () => {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getCountFromServer(productsRef);
    return snapshot.data().count; // Returns the total count of products
  } catch (error) {
    console.error('Error fetching product count:', error);
    throw error;
  }
};
