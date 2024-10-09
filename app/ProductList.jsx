"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Pagination from './Pagination';
import { fetchProducts } from './API';// Adjust the import based on your structure

export default function ProductsPage({ searchParams }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page) || 1);
  
  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await fetchProducts(currentPage);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }

    loadProducts();
  }, [currentPage]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-8">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {products.map((product) => (
          <Link key={product.data.id} href={`/products/${product.data.id}`}>
            <div className="p-4 border rounded-lg text-center hover:scale-105 transition-transform">
              <Image 
                src={product.data.image} 
                alt={product.data.title} 
                width={300}
                height={300}
                className="w-full h-auto mb-4" 
              />
              <h2 className="text-xl mb-2">{product.data.title}</h2>
              <p className="text-lg font-semibold text-green-600">${product.data.price}</p>
              <p className="text-sm text-gray-600">Category: {product.data.category}</p>
              <p className="text-yellow-500">Rating: {product.data.rating.rate}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination controls */}
      <Pagination currentPage={currentPage} />
      <div className="flex justify-center space-x-4 my-10">
        {currentPage > 1 && (
          <Link href={`?page=${currentPage - 1}`} className="px-4 py-2 text-blue-500">
            Previous
          </Link>
        )}
        <span className="text-lg">Page {currentPage}</span>
        <Link href={`?page=${currentPage + 1}`} className="px-4 py-2 text-blue-500">
          Next
        </Link>
      </div>
    </div>
  );
}
