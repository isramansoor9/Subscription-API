"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionsPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [frequency, setFrequency] = useState("monthly");
  const [category, setCategory] = useState("entertainment");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [startDate, setStartDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddSubscription = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You must be signed in.");
      }

      const response = await fetch(
        "http://localhost:5500/api/v1/subscriptions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name,
            price: Number(price),
            currency,
            frequency,
            category,
            paymentMethod,
            startDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create subscription"
        );
      }

      setSuccess("Subscription added successfully!");

      // Clear form
      setName("");
      setPrice("");
      setCurrency("USD");
      setFrequency("monthly");
      setCategory("entertainment");
      setPaymentMethod("Credit Card");
      setStartDate("");

      // Go back to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);

    } catch (error) {
      console.error("ADD SUBSCRIPTION ERROR:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fc]">

      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">

        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >

            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              S
            </div>

            <div>
              <h1 className="font-bold text-lg">
                SubTrack
              </h1>

              <p className="text-xs text-gray-500">
                Subscription Manager
              </p>
            </div>

          </Link>


          <Link
            href="/dashboard"
            className="text-sm font-semibold text-gray-600 hover:text-indigo-600"
          >
            Dashboard
          </Link>

        </div>

      </nav>


      {/* Main */}
      <div className="max-w-3xl mx-auto px-6 py-14">

        <div className="mb-8">

          <p className="text-xs font-bold tracking-widest text-indigo-600">
            NEW SUBSCRIPTION
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Add a subscription
          </h1>

          <p className="text-gray-500 mt-2">
            Add a subscription to start tracking its recurring payments.
          </p>

        </div>


        {/* Messages */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}


        {/* Form */}

        <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">

          <form
            onSubmit={handleAddSubscription}
            className="space-y-5"
          >

            {/* Name */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscription Name
              </label>

              <input
                type="text"
                placeholder="Netflix"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Price */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="15.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Currency */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >

                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="CAD">CAD</option>

              </select>

            </div>


            {/* Frequency */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>

              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >

                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>

              </select>

            </div>


            {/* Category */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >

                <option value="sports">
                  sports
                </option>

                <option value="news">
                  news
                </option>

                <option value="finance">
                  finance
                </option>

                <option value="entertainment">
                  entertainment
                </option>

                <option value="productivity">
                  productivity
                </option>

                <option value="education">
                  education
                </option>

                <option value="health">
                  health
                </option>

                <option value="other">
                  Other
                </option>

              </select>

            </div>


            {/* Payment Method */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >

                <option value="Credit Card">
                  Credit Card
                </option>

                <option value="Debit Card">
                  Debit Card
                </option>

                <option value="PayPal">
                  PayPal
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* Start Date */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3 rounded-lg font-semibold transition"
            >

              {loading
                ? "Adding subscription..."
                : "Add Subscription"}

            </button>

          </form>

        </div>

      </div>

    </main>
  );
}