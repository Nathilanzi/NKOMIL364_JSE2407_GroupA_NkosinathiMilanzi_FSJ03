"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterSortComponent from '@/app/components/Filter';
import Pagination from '@/app/components/Pagination';
import ProductCard from '@/app/components/ProductCard';
import Head from 'next/head';

const PAGE_SIZE = 20;

const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'id';
  const order = searchParams.get('order') || 'asc';
  const search = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProductsData = async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const { category = '', sortBy = 'id', order = 'asc', search = '' } = filters;

      // Construct query params based on filters and pagination
      const queryParams = new URLSearchParams({
        page: page,
        pageSize: PAGE_SIZE,
        search,
        category,
        sort: order // Assuming 'sort' is used in your API
      }).toString();

      const response = await fetch(`/api/products?${queryParams}`);
      console.log(products)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log("Fetched data:", data);

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Expected an array of products but got:", data);
        setProducts([]);
      }

      // Fetch total number of products from the count API
      const countResponse = await fetch(`/api/products/count`);
      const countData = await countResponse.json();
      setTotalPages(Math.ceil(countData.count / PAGE_SIZE));

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

  const applyFiltersAndSorting = (newFilters) => {
    setCurrentPage(1); // Reset to first page on filter change

    const { category, sortBy, order, search } = newFilters;

    router.push({
      pathname: '/products',
      query: {
        category: category || '',
        sort: sortBy || 'id',
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
                setCurrentPage={setCurrentPage} 
                totalPages={totalPages} 
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
