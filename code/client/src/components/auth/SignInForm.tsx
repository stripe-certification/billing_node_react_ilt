import React, { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorBanner from "../ui/ErrorBanner";
import { useUserContext } from "@/contexts/UserContext";

const SignInForm = () => {
  const router = useRouter();
  const { user, login, hasActiveSubscription, isLoggedIn } = useUserContext();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("sijsdj90fW@(*8");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn() && hasActiveSubscription()) {
      router.push("/account");
    } else if (isLoggedIn() && !hasActiveSubscription()) {
      router.push("/auth/sign-up");
    }
  }, [isLoggedIn, hasActiveSubscription, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(email);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-color">
            Access your account
          </h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <ErrorBanner message={error} />}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple focus:border-purple sm:text-sm"
                placeholder="jenny@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple focus:border-purple sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500 italic">
                Workshop only. No validation applied.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-purple focus:ring-purple border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Keep me logged in
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="#"
                  className="font-medium text-purple hover:text-purple-hover"
                >
                  Password reset
                </Link>
              </div>
            </div>

            <button
              disabled={!email || email.length === 0}
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-button-color bg-purple hover:bg-purple-hover transition duration-300"
            >
              Log in
            </button>
          </form>
        </div>
        <div className="text-center">
          New user?{" "}
          <Link
            className="font-medium text-purple hover:text-purple-hover"
            href="/auth/sign-up"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
