"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5500/api/v1/auth/sign-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      // Backend returned an error
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(data.data.user)
      );

      // Save JWT
      localStorage.setItem(
        "token",
        data.data.token
      );

      console.log("Login successful");

      // Go to landing page
      router.push("/");

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error instanceof TypeError) {
        setError(
          "Unable to connect to the server. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">

          <Link
            href="/"
            className="inline-flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              S
            </div>

            <span className="font-bold text-xl">
              SubTrack
            </span>
          </Link>

          <h1 className="text-2xl font-bold mt-8">
            Welcome back
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Sign in to manage your subscriptions.
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          {/* Signup */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}

            <Link
              href="/signup"
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Create an account
            </Link>
          </p>

        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to home
          </Link>
        </div>

      </div>
    </main>
  );
}