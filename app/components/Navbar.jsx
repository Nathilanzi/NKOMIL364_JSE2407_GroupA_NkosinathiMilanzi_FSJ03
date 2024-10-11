"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/firebaseConfig';  // Import Firebase authentication
import { onAuthStateChanged } from 'firebase/auth';

export default function Header() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [user, setUser] = useState(null);  // State for user authentication

  // Monitor the authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);  // Set the current user
    });
    return () => unsubscribe();  // Cleanup listener on unmount
  }, []);

  // Toggle navbar visibility on smaller screens
  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <header className="bg-red-600 py-4 sticky top-0 z-50"> {/* Changed to red */}
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center text-white">
          <Image 
            src="/online-shop.png"
            alt="Shop Logo" 
            width={32} 
            height={32} 
            className="h-auto w-auto mr-2"
          />
          <span className="text-2xl font-bold">Doski General</span>
        </Link>

        <button onClick={toggleNavbar} className="text-white text-2xl md:hidden">
          &#9776;
        </button>

        <nav className={`md:flex md:items-center md:space-x-4 ${showNavbar ? 'flex flex-col' : 'hidden'} bg-red-500 p-4 rounded`}> {/* Changed to red */}
          <Link href="/wishlist" className="text-white mb-2 md:mb-0">
            Wishlist
          </Link>
          <Link href="/cart" className="text-white mb-2 md:mb-0">
            Cart
          </Link>

          {/* Conditional rendering based on user authentication */}
          {user ? (
            <>
              <p className="text-white mb-2 md:mb-0">Welcome, {user.email}</p>
              <Link href="/signOut" className="text-white mb-2 md:mb-0">Sign Out</Link>
            </>
          ) : (
            <>
              <p className="text-white mb-2 md:mb-0"></p>
              <Link href="/signIn" className="text-white mb-2 md:mb-0">Sign In</Link>
              <Link href="/signUp" className="text-white mb-2 md:mb-0">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
