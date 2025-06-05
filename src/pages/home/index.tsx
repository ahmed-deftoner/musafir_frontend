import React, { useState, useEffect } from 'react';
import { Navigation } from '../navigation';
import withAuth from '@/hoc/withAuth';
import HomeEventCard from '@/components/cards/HomeEventCard';
import useFlagshipHook from '../../hooks/useFlagshipHandler';

function Home() {
  const actionFlagship = useFlagshipHook();
  const [flagships, setFlagships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlagships = async () => {
    try {
      setIsLoading(true);
      const data = await actionFlagship.getAllFlagships();
      if (data) {
        setFlagships(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching flagships:', error);
    }
  };

  useEffect(() => {
    fetchFlagships();
  }, []);

  return (
    <div className='min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0'>
      <div className='bg-white w-full max-w-md mx-auto rounded-lg h-screen p-3'>
        {/* Header */}
        <header className='flex items-center justify-center p-4'>
          <h1 className='text-2xl font-semibold'>Home</h1>
        </header>

        {/* Main Content */}
        <main className='px-4 pb-24'>
          <h2 className='mb-6 text-3xl font-bold text-[#2B2D42]'>Upcoming Flagships</h2>

          <div className='space-y-4'>
            {flagships.length > 0 ? (
              flagships.map((event) => {
                return (
                  <HomeEventCard
                    key={event._id}
                    {...event}
                  />
                );
              })
            ) : isLoading ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-xl font-medium mb-2">Loading Flagships For You</p>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="text-xl font-medium mb-2">No Flagships Available Yet</p>
                <p className="text-lg ">Stay tuned! We're working on bringing exciting new flagships your way.</p>
              </div>
            )}
          </div>
        </main>

        {/* Navigation */}
        <Navigation />
      </div>
    </div>
  );
}

export default withAuth(Home);
