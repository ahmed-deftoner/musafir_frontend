import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { User } from '@/interfaces/login';
import useLoginHook from '@/hooks/useLoginHandler';
import { ROLES, ROUTES_CONSTANTS } from '@/config/constants';

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const actionLogin = useLoginHook();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const verifyUser = async () => {
    try {
      const userData: User = await actionLogin.verifyToken(); // Call API
      // if (userData?.roles?.includes(ROLES.ADMIN)) {
      //   router.push(ROUTES_CONSTANTS.ADMIN_DASHBOARD);
      // } else if (userData.roles?.includes(ROLES.MUSAFIR)) {
      //   if (!userData.verification?.status && !userData.verification?.VerificationRequestDate) {
      //     router.push(ROUTES_CONSTANTS.VERIFICATION_REQUEST);
      //   } else {
      //     router.push(ROUTES_CONSTANTS.HOME);
      //   }
      // }

      router.push(ROUTES_CONSTANTS.HOME);

    } catch (error) {
      console.error('Token verification failed', error);
      router.push('/login'); // Redirect to login if token invalid
    }
  };

  useEffect(() => {
    if (session) {
      // router.push('/home'); // Redirect logged-in users to home
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    console.log(result, 'results');

    if (result?.status === 200) {
      setTimeout(() => {
        verifyUser();
      }, 1000);
    }

    if (result?.error) {
      console.log('error', error);

      setError('Invalid email or password');
    }
  };

  const handleGoogleSignIn = async () => {
    // Initiate Google sign-in with a redirect state
    await signIn('google', {
      callbackUrl: '/home', // Redirect after login
    });
  };

  return (
    <div className='min-h-screen w-full bg-gray-50 md:flex md:items-center md:justify-center p-0'>
      <div className='bg-white w-full max-w-md mx-auto rounded-lg shadow-sm h-screen p-3 w-full'>
        {/* Header */}
        <header className='flex items-center p-4 border-b'>
          <Link href='/' className='p-2 hover:bg-gray-100 rounded-full'>
            <ArrowLeft className='h-5 w-5' />
          </Link>
          <h1 className='text-center flex-1 text-xl font-semibold mr-7'>Login</h1>
        </header>

        {/* Main Content */}
        <main className='p-4 max-w-md mx-auto'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold mb-2'>Login to your Musafir Account</h2>
          </div>

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <label htmlFor='email' className='block text-sm font-medium'>
                Email
              </label>
              <input
                type='email'
                id='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400'
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='password' className='block text-sm font-medium'>
                Password
              </label>
              <input
                type='password'
                id='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400'
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <button
              type='submit'
              className='w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-md text-sm font-medium transition-colors'
            >
              Sign In
            </button>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>OR</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              type='button'
              className='w-full border border-gray-300 hover:bg-gray-50 py-4 rounded-md text-sm font-medium transition-colors'
            >
              Sign In with Google
            </button>
            <div>
              {/* {session ? (
              <>
                <p>Welcome, {session.user?.name}!</p>
                <button onClick={() => signOut()}>Sign Out</button>
              </>
            ) : (
              <button onClick={() => signIn("google")}>Sign in with Google</button>
            )} */}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
