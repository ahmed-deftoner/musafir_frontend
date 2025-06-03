// "use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Eye, EyeOff } from "lucide-react"
import useCustomHook from '@/hooks/useSignUp';
import {
  signIn,
  useSession
} from "next-auth/react";

export default function EmailVerification() {
  const router = useRouter();
  const action = useCustomHook();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSkipVerification = async (e: any) => {
    e.preventDefault();
    const savedData = JSON.parse(localStorage.getItem('formData') || '{}');
    const formData = {
      ...savedData, password
    }
    console.log(savedData);
    localStorage.setItem('formData', JSON.stringify(formData));
    router.push('/signup/accountCreated')
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const savedData = JSON.parse(localStorage.getItem('formData') || '{}');
    const formData = {
      ...savedData, password
    }
    const response = await action.verifyEmail(password, savedData.verificationId);
    console.log("response from the verify Email: ")
    if (response.accessToken) {
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      //this first routes to the home page and then to  the verification page need to figure it out
      router.push("/verification");
    } else {
      //throw error over here that request failed, 
    }

  };

  return (
    <div className="min-h-screen bg-gray-50 md:flex md:items-center md:justify-center p-0">
      <div className="min-h-screen bg-white w-full max-w-md mx-auto rounded-lg shadow-sm p-6">

        {/* header */}
        <div className="flex items-center justify-center mb-8 mt-3">
          <h1 className="text-2xl font-semibold text-center flex-1">Onboarding</h1>
        </div>

        <div className="p-1">
          {/* details */}
          <div className="space-y-3">
            <h1 className="text-xl font-bold">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent you a passowrd to login to your account. If you can&apos;t find it, check the spam folder.
            </p>
          </div>
          {/* form content */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* password */}
            <div className="space-y-2">
              <label htmlFor="social" className="block text-sm font-medium mt-5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="social"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-3'>
              {/* musafir Verification */}
              <div className="space-y-2">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-black py-4 rounded-md text-sm font-medium transition-colors"
                >
                  Musafir Verification
                </button>
              </div>
              {/* skip Verification for now */}
              <div>
                <button
                  onClick={handleSkipVerification}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-black py-4 rounded-md text-sm font-medium transition-colors"
                >
                  Skip Verification for now
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

