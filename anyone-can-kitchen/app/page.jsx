'use client'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userSession = sessionStorage.getItem('user');

      if (!user && !userSession) {
        router.push('/sign-up');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>; // Optionally, you can display a loading spinner here
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={() => {
          signOut(auth);
          sessionStorage.removeItem('user');
        }}
        className="p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
      >
        Log out
      </button>
    </main>
  );
}
