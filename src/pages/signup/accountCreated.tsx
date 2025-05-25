// "use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

export default function AccountCreated() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/home');
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 md:flex md:items-center md:justify-center p-4">
            <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-sm">
                <div className="item-center">
                    <div className="mb-4 item-center">
                        <svg className="w-16 h-16 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <circle cx="10" cy="10" r="10" />
                            <path
                                fill="white"
                                d="M7 10l2 2 4-4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold">Account Created on Musafir App</h1>
                    <p className="mt-2 text-gray-600">
                        You wouldn’t have to enter these details again while trip registrations
                    </p>
                </div>
            </div>
        </div>
    )
}

