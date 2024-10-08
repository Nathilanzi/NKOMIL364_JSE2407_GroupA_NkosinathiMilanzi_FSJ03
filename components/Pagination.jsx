"use client"; // This is a Client Component because it uses state or client-side behavior

import { useRouter } from 'next/navigation';

export default function Pagination({ currentPage, setCurrentPage }) {
  const router = useRouter();

  // Function to handle page navigation
  const goToPage = (page) => {
    setCurrentPage(page); // Update current page state
    router.push(`?page=${page}`); // Update URL
  };

  return (
    <div className="flex justify-center space-x-4">
      <button 
        disabled={currentPage === 1} 
        onClick={() => goToPage(currentPage - 1)}
        className={`px-4 py-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'text-blue-500'}`}
      >
        Previous
      </button>

      <span className="text-lg">Page {currentPage}</span>

      <button 
        onClick={() => goToPage(currentPage + 1)} 
        className={`px-4 py-2 ${currentPage === 1 ? 'text-blue-500' : ''}`}
      >
        Next
      </button>
    </div>
  );
}
