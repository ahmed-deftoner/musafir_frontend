'use client';
import { useState, useEffect } from 'react';
import Navigation from '../navigation';
import withAuth from '@/hoc/withAuth';
import useUserHandler from '@/hooks/useUserHandler';


function UserSettings() {
  const [userData, setUserData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userHandler = useUserHandler();

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await userHandler.getMe();
      setUserData(response);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load user data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full bg-gray-50 md:flex md:items-center md:justify-center p-0'>
      <div className='bg-white w-full max-w-md mx-auto rounded-lg shadow-sm h-screen'>
        <Navigation />

        <div className='flex-1 flex flex-col overflow-hidden'>
          <main className='flex-1 overflow-y-auto bg-white h-full'>
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <header className='flex items-center justify-center p-2 mt-2'>
              <h1 className='text-2xl font-semibold'>User Settings</h1>
            </header>
            <form className='space-y-6 h-full p-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                <input
                  type='text'
                  name='fullName'
                  value={userData.fullName}
                  disabled
                  required
                  className='w-full px-3 py-2 border rounded-md disabled:bg-gray-100'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <input
                  type='email'
                  name='email'
                  value={userData.email}
                  disabled
                  required
                  className='w-full px-3 py-2 border rounded-md disabled:bg-gray-100'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Phone</label>
                <input
                  type='tel'
                  name='phone'
                  value={userData.phone}
                  disabled
                  required
                  className='w-full px-3 py-2 border rounded-md disabled:bg-gray-100'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>CNIC</label>
                <input
                  type='text'
                  name='cnic'
                  value={userData.cnic}
                  disabled
                  required
                  className='w-full px-3 py-2 border rounded-md disabled:bg-gray-100'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Referral ID</label>
                <input
                  type='text'
                  name='referralID'
                  value={userData.referralID}
                  disabled
                  className='w-full px-3 py-2 border rounded-md bg-gray-100'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Verification Status</label>
                <input
                  type='text'
                  name='verificationStatus'
                  value={userData.verification.status ? 'Verified' : 'Un-Verified'}
                  disabled
                  className='w-full px-3 py-2 border rounded-md disabled:bg-gray-100'
                />
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default withAuth(UserSettings); 