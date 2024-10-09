"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchCategories } from '@/app/API'; // Adjust the import path as necessary

export default function Filtering() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortOrder, setSortOrder] = useState(searchParams.get('order') || '');

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategoriesFromFirestore = async () => {
      try {
        const data = await fetchCategories(`/api/categories`); // Call your Firestore fetch function
        console.log('Fetched categories:', data);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategoriesFromFirestore();
  }, []);

  // Update URL when searchQuery changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    router.push(`/?${params.toString()}`);
  }, [searchQuery]);

  // Update URL when selectedCategory changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`);
  }, [selectedCategory]);

  // Update URL when sortOrder changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortOrder) {
      params.set('order', sortOrder);
    } else {
      params.delete('order');
    }
    router.push(`/?${params.toString()}`);
  }, [sortOrder]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle category select
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle sorting
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Reset filters
  const handleRestoreFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortOrder('');
    router.push('/'); // Reset the URL to default
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {/* Search Field */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <select 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={selectedCategory} 
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.length > 0 ? (
            categories.map((category) => (
              <option key={category} value={category}> {/* Assuming categories have 'id' and 'name' */}
                {category}
              </option>
            ))
          ) : (
            <option disabled>No categories available</option>
          )}
        </select>
      </div>

      {/* Sorting Filter */}
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

      {/* Reset Filters Button */}
      <button
        onClick={handleRestoreFilters}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
      >
        Reset Filters
      </button>
    </div>
  );
}
