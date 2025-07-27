"use client";
import { useState, useEffect } from "react";
import Navigation from "../navigation";
import withAuth from "@/hoc/withAuth";
import useUserHandler from "@/hooks/useUserHandler";
import { ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/interfaces/login";

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

function ResetPassword() {
  const [userData, setUserData] = useState<User>({} as User);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    });

  const userHandler = useUserHandler();
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const response = await userHandler.getMe();
      setUserData(response);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data");
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    // Password validation
    setPasswordValidation({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    });
  }, [newPassword]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("New password and confirm password do not match");
      return;
    }

    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await userHandler.resetPassword({
        email: userData?.email || "",
        previousPassword: currentPassword,
        password: newPassword,
        confirmPassword: confirmPassword,
      });
      setSuccess("Password reset successfully!");
      // setTimeout removed from here
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reset password";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        router.push("/userSettings");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [success, router]);

  const handleBack = () => {
    router.push("/userSettings");
  };

  return (
    <div className="min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg h-screen">
        <Navigation />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-white h-full">
            <header className="flex items-center p-4 border-b">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-center flex-1 text-xl font-semibold mr-10">
                Reset Password
              </h1>
            </header>

            <div className="p-6">
              {userLoading ? (
                <div className="flex justify-center items-center h-40 text-lg">
                  Loading...
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={userData.email || ""}
                        disabled
                        className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>

                      {/* Password validation */}
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          {passwordValidation.length ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={
                              passwordValidation.length
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            At least 8 characters
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {passwordValidation.uppercase ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={
                              passwordValidation.uppercase
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            One uppercase letter
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {passwordValidation.lowercase ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={
                              passwordValidation.lowercase
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            One lowercase letter
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {passwordValidation.number ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={
                              passwordValidation.number
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            One number
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {passwordValidation.special ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={
                              passwordValidation.special
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            One special character
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Confirm your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                      {confirmPassword && !passwordsMatch && (
                        <p className="mt-1 text-sm text-red-600">
                          Passwords do not match
                        </p>
                      )}
                      {confirmPassword && passwordsMatch && (
                        <p className="mt-1 text-sm text-green-600">
                          Passwords match
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={
                        !isPasswordValid ||
                        !passwordsMatch ||
                        !currentPassword ||
                        isLoading
                      }
                      className="w-full px-4 py-3 text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed rounded-md transition-colors"
                    >
                      {isLoading ? "Resetting Password..." : "Reset Password"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ResetPassword);
