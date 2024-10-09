"use client";

import { useRouter } from 'next/navigation';

export default function Pagination({ currentPage, setCurrentPage, totalPages }) {
  const router = useRouter();

  // Function to handle page navigation
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return; // Ensure valid page number
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

      <span className="text-lg">Page {currentPage} of {totalPages}</span>

      <button 
        disabled={currentPage === totalPages} // Disable if on the last page
        onClick={() => goToPage(currentPage + 1)} 
        className={`px-4 py-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'text-blue-500'}`}
      >
        Next
      </button>
    </div>
  );
}
