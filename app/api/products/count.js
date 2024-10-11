"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import FilterSortComponent from '@/app/components/Filter';
import Pagination from '@/app/components/Pagination';
import ProductCard from '@/app/components/ProductCard';
import { fetchProducts } from './API'; 
import Head from 'next/head';

const PAGE_SIZE = 20;

/**
 * ProductsPage component to display a list of products with filtering, sorting, and pagination.
 */
const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query parameters from URL
  const category = searchParams.get('category') || ''; 
  const sortBy = searchParams.get('sortBy') || 'id'; 
  const order = searchParams.get('order') || 'asc'; 
  const search = searchParams.get('search') || ''; 
  const page = parseInt(searchParams.get('page')) || 1; // Get current page from search params

  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // State to store total product count

  /**
   * Fetches products based on the current filters and pagination.
   */
  const fetchProductsData = async () => {
    setLoading(true);
    setError(null); 

    try {
      // Fetch products
      const response = await fetchProducts({
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search,
        category,
        sortBy,
        order
      });

      if (response.products && Array.isArray(response.products)) {
        setProducts(response.products);
      } else {
        console.error("Expected an array of products but got:", response);
        setProducts([]);
      }

      // Fetch total product count
      const countResponse = await fetch('/api/product/count');
      const countData = await countResponse.json();
      
      if (countResponse.ok) {
        setTotalCount(countData.count); // Set total count from the response
        setTotalPages(Math.ceil(countData.count / PAGE_SIZE)); // Calculate total pages
      } else {
        console.error("Error fetching total product count:", countData.message);
        setTotalCount(0);
        setTotalPages(1);
      }

    } catch (err) {
      setError(err.message);
      setProducts([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products whenever the query params change
  useEffect(() => {
    fetchProductsData();
  }, [category, sortBy, order, search, page]);

  /**
   * Handles page changes for pagination.
   */
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      // Update the URL to reflect the current page
      router.push({
        pathname: '/products',
        query: {
          category,
          sortBy,
          order,
          search,
          page: newPage // Add the current page to the query
        },
      });
    }
  };

  /**
   * Applies new filters and sorting to the product list.
   */
  const applyFiltersAndSorting = (newFilters) => {
    const { category, sortBy, order, search } = newFilters;

    router.push({
      pathname: '/products',
      query: {
        category: category || '',
        sortBy: sortBy || 'id',
        order: order || 'asc',
        search: search || '',
        page: 1 // Reset to page 1 on filter change
      },
    });
  };

  return (
    <>
      <Head>
        <title>{`Products - Your Store Name`}</title>
        <meta name="description" content="Explore our wide range of products available at your store." />
        <meta name="robots" content="index, follow" />
      </Head>
      
      <div className="mx-auto">
        <FilterSortComponent
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
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Render pagination */}
              <Pagination 
                currentPage={page} 
                totalItems={totalCount} // Use total count for pagination
                itemsPerPage={PAGE_SIZE} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
