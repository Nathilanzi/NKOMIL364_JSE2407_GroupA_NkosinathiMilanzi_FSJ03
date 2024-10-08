"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Filtering() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortOrder, setSortOrder] = useState(searchParams.get('order') || ''); 

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('https://next-ecommerce-api.vercel.app/categories');
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchCategories();
  }, []);

  const updateUrl = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortOrder) params.set('order', sortOrder);
    router.push(`/?${params.toString()}`);
  };

  useEffect(() => {
    updateUrl();
  }, [searchQuery, selectedCategory, sortOrder]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleRestoreFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortOrder('');
    router.push('/');
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="mb-4">
        <select 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={selectedCategory} 
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={sortOrder} 
          onChange={handleSortChange}
        >
          <option value="">Sort by Price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      <button
        onClick={handleRestoreFilters}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
      >
        Reset Filters
      </button>
    </div>
  );
}
