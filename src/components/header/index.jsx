import { Bell, Menu } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

export default function Header({ notificationCount, setSidebarOpen }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className='h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6'>
      {/* Mobile menu button */}
      <button className='p-2 rounded-md lg:hidden' onClick={() => setSidebarOpen(true)}>
        <Menu className='w-6 h-6' />
      </button>

      <div className='flex items-center lg:ml-auto'>
        {/* Notification Bell */}
        <div className='relative mr-6'>
          <Bell className='w-6 h-6 text-gray-500' />
          {notificationCount > 0 && (
            <span className='absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>
              {notificationCount}
            </span>
          )}
        </div>

        {/* User Profile */}
        <div className='flex items-center'>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className='flex items-center focus:outline-none'
          >
            <span className='text-sm font-medium mr-2'>M.Usama</span>
            <div className='w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm'>
              M
            </div>
          </button>
          {showDropdown && (
            <div
              ref={dropdownRef}
              className='absolute right-0 mt-16 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10'
            >
              <button
                onClick={() => signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/login` || '/login' })}
                className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
