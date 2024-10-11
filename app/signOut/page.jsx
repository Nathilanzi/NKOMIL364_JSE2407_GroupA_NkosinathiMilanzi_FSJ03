// app/signOut/page.jsx
"use client";

import { useEffect } from 'react';
import { logOut } from '../auhtentication';// Imported log-out function
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await logOut();
        router.push('/');
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };
    handleSignOut();
  }, [router]);

  return (
    <div>
      <h1>Signing Out...</h1>
      <p>Please wait...</p>
    </div>
  );
}
