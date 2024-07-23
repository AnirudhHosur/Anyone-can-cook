'use client'
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link from Next.js
import toast, { Toaster } from 'react-hot-toast';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const router = useRouter();

    const handleSignIn = async () => {
        if (!email || !password) {
            toast.error('Please fill out both email and password fields.');
            return;
        }
        try {
            const res = await signInWithEmailAndPassword(email, password);
            console.log({ res });
            sessionStorage.setItem('user', true);
            setEmail('');
            setPassword('');
            toast.success('Successfully signed in!');
            router.push('/');
        } catch (e) {
            console.error(e);
            let errorMessage = 'Sign-in failed. Please try again.';
            if (e.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (e.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (e.code === 'auth/invalid-email') {
                errorMessage = 'The email address is not valid.';
            }
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Sign In</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <button
                    onClick={handleSignIn}
                    className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
                >
                    Sign In
                </button>
                <div className="mt-4 text-center">
                    <span className="text-white">Not a user? </span>
                    <Link href="/sign-up" className="text-indigo-400 hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;