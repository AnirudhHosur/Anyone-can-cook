'use client'
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import Link from 'next/link'; // Import Link from Next.js
import toast, { Toaster } from 'react-hot-toast';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

    const handleSignUp = async () => {
        if (!email || !password) {
            toast.error('Please fill out both email and password fields.');
            return;
        }
        try {
            const res = await createUserWithEmailAndPassword(email, password);
            console.log({ res });
            sessionStorage.setItem('user', true);
            setEmail('');
            setPassword('');
            toast.success('Successfully registered!');
        } catch (e) {
            console.error(e);
            let errorMessage = 'Registration failed. Please try again.';
            if (e.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already in use.';
            } else if (e.code === 'auth/invalid-email') {
                errorMessage = 'The email address is not valid.';
            } else if (e.code === 'auth/weak-password') {
                errorMessage = 'The password is too weak.';
            }
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Sign Up</h1>
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
                    onClick={handleSignUp}
                    className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
                >
                    Sign Up
                </button>
                <div className="mt-4 text-center">
                    <span className="text-white">Already a user? </span>
                    <Link href="/sign-in" className="text-indigo-400 hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;