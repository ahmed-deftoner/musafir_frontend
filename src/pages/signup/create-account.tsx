import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  signIn, 
  // useSession 
} from "next-auth/react";


export default function CreateAccount() {
  // const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const savedData = JSON.parse(localStorage.getItem('formData') || '{}');

    const formData = {
      ...savedData, email
    }
    localStorage.setItem('formData', JSON.stringify(formData));
    router.push('/signup/registrationform');
  };

  const handleGoogleSignIn = async () => {
    // Initiate Google sign-in with a redirect state
    // const savedData = JSON.parse(localStorage.getItem("formData") || "{}");
    await signIn("google", {
      callbackUrl: "/login", // Redirect after login
      // cnic: savedData?.cnic || '',
      // fullName: savedData?.fullName || '',
      // gender: savedData?.gender || '',
      // phone: savedData?.phone || '',
      // socialLink: savedData?.socialLink || '',
      // university: savedData?.university || ''
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 md:flex md:items-center md:justify-center p-0">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-sm h-screen p-3 w-full">
        {/* Header */}
        <header className="flex items-center p-4 border-b">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-center flex-1 text-xl font-semibold mr-7">Onboarding</h1>
        </header>

        {/* Main Content */}
        <main className="p-4 max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Let's create your account</h2>
            <p className="text-gray-600">Never fill long forms again + get discounts on future flagships</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter Email'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-md text-sm font-medium transition-colors"
            >
              Sign Up
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full border border-gray-300 hover:bg-gray-50 py-4 rounded-md text-sm font-medium transition-colors"
            >
              Sign Up with Google
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
  )
}

