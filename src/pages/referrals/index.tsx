import React from 'react';
import { Navigation } from '../navigation';
import withAuth from '@/hoc/withAuth';

function Referrals() {

    return (
        <div className='min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0'>
            <div className='bg-white w-full max-w-md mx-auto rounded-lg h-screen p-3'>
                {/* Header */}
                <header className='flex items-center justify-center p-4'>
                    <h1 className='text-2xl font-semibold'>Referrals</h1>
                </header>

                {/* Main Content */}
                <main className='px-4 pb-24 pt-24'>
                    <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                        <p className="text-center text-xl mb-2">
                            Comming Soon!
                        </p>
                        <p className="text-justify">
                            We're working on something exciting! Soon you'll be able to refer friends and family to join our community, earn rewards, and share the joy of travel together. Stay tuned for this amazing feature!
                        </p>
                    </div>
                </main>

                {/* Navigation */}
                <Navigation />
            </div>
        </div>
    );
}

export default withAuth(Referrals);
