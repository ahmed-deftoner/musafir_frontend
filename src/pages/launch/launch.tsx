import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LaunchScreen() {
  const router = useRouter();

  useEffect(() => {
    // Check if there are query parameters in the URL
    const queryParams = router.query;
    if (Object.keys(queryParams).length > 0) {
      // Save the query parameters in localStorage
      localStorage.setItem(
        "flagshipId",
        JSON.stringify(queryParams?.flagshipId)
      );
      console.log("Query parameters saved:", queryParams);
    } else {
      // Clear the variable in localStorage if no query parameters exist
      localStorage.removeItem("flagshipId");
      console.log("Query parameters cleared");
    }
  }, [router.query]); // Run this effect whenever the query parameters change

  return (
    <div className="min-h-screen bg-gray-50 md:flex md:items-center md:justify-center p-4">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-sm">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-white">
          {/* Logo */}
          <div className="mb-8">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-16 w-16"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                d="M2 9L12 3L22 9L12 15L2 9Z"
                className="fill-orange-500 stroke-orange-500"
              />
              <path
                d="M22 15L12 21L2 15"
                className="fill-none stroke-orange-500"
              />
            </svg>
          </div>

          {/* Question Text */}
          <h1 className="mb-12 text-center text-3xl font-bold leading-tight md:text-4xl">
            Have you ever registered for a 3 musafir flagship before?
          </h1>

          {/* Buttons */}
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={() => router.push("/login")}
              className="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Yes
            </button>
            <button
              onClick={() => router.push("/signup/create-account")}
              className="w-full rounded-lg border-2 border-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-500/10"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
