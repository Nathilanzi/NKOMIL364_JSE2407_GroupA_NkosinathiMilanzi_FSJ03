"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import FilterSortComponent from '@/components/Filter';
import Pagination from '@/components/Pagination';
import ProductCard from '@/components/ProductCard';
import { fetchProducts } from './API'; 
import Head from 'next/head';
import Link from 'next/link'; // Ensure Link is imported

const PAGE_SIZE = 20;

/**
 * ProductsPage component to display a list of products with filtering, sorting, and pagination.
 *
 * @component
 * @returns {JSX.Element} The rendered ProductsPage component.
 */
const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Deconstructing URL to get query parameters for category, sort, and search
  const category = searchParams.get('category') || ''; 
  const sortBy = searchParams.get('sortBy') || 'id'; 
  const order = searchParams.get('order') || 'asc'; 
  const search = searchParams.get('search') || ''; 

  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /**
   * Fetches products data based on current filters and pagination.
   *
   * @async
   * @param {number} page - The current page number.
   * @param {Object} filters - The filters for fetching products.
   * @param {string} filters.category - The selected category filter.
   * @param {string} filters.sortBy - The field to sort by.
   * @param {string} filters.order - The order of sorting ('asc' or 'desc').
   * @param {string} filters.search - The search term to filter products.
   */
  const fetchProductsData = async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null); 

    try {
      const response = await fetchProducts({
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search,
        category,
        sortBy,
        order
      });

      console.log("Fetched data:", response); // Log fetched data

      if (Array.isArray(response)) {
        setProducts(response);
        setTotalPages(Math.ceil(response.length / PAGE_SIZE));
      } else {
        console.error("Expected an array of products but got:", response);
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filters = {
      category: category || undefined,
      sortBy: sortBy || undefined,
      order: order || undefined,
      search: search || undefined,
    };

    fetchProductsData(currentPage, filters);
  }, [category, sortBy, order, search, currentPage]);

  /**
   * Handles page changes for pagination.
   *
   * @param {number} page - The page number to navigate to.
   */
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Applies new filters and sorting to the product list.
   *
   * @param {Object} newFilters - The new filters to apply.
   * @param {string} newFilters.category - The selected category filter.
   * @param {string} newFilters.sortBy - The field to sort by.
   * @param {string} newFilters.order - The order of sorting ('asc' or 'desc').
   * @param {string} newFilters.search - The search term to filter products.
   */
  const applyFiltersAndSorting = (newFilters) => {
    setCurrentPage(1); // Reset to first page on filter change

    const { category, sortBy, order, search } = newFilters;

    console.log("Applying new filters and sorting:", newFilters);

    router.push({
      pathname: '/products',
      query: {
        category: category || '',
        sortBy: sortBy || 'id',
        order: order || 'asc',
        search: search || '',
      },
    });
  };

  return (
    <>
      <Head>
        <title>{`Products - Your Store Name`}</title>
        <meta name="description" content="Explore our wide range of products available at your store." />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="mx-auto">
        <FilterSortComponent
          setProducts={setProducts}
          setLoading={setLoading}
          applyFiltersAndSorting={applyFiltersAndSorting}
          currentCategory={category}
          currentSort={sortBy}
          currentOrder={order}
          currentSearch={search}
        />

        <div>
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : products.length === 0 ? (
            <p>No products available</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.isArray(products) && products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />

              {/* Pagination controls */}
              <div className="flex justify-center space-x-4 my-10">
                {currentPage > 1 && (
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    className="px-4 py-2 text-blue-500"
                  >
                    Previous
                  </button>
                )}
                <span className="text-lg">Page {currentPage} of {totalPages}</span>
                {currentPage < totalPages && (
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    className="px-4 py-2 text-blue-500"
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;