"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Subscription {
  _id: string;
  name: string;
  price: number;
  currency: string;
  frequency: string;
  category: string;
  paymentMethod: string;
  status: string;
  startDate: string;
  renewalDate: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name);
      } catch (error) {
        console.error("Failed to read user:", error);
      }
    }

    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    fetchSubscriptions(token);
  }, []);

  const fetchSubscriptions = async (token: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5500/api/v1/subscriptions",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch subscriptions"
        );
      }

      /*
       * Newest subscriptions first.
       * This assumes MongoDB gives us createdAt timestamps.
       */
      const sortedSubscriptions = [...(data.data || [])].sort(
        (a: Subscription, b: Subscription) => {
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        }
      );

      setSubscriptions(sortedSubscriptions);
    } catch (error) {
      console.error("FETCH SUBSCRIPTIONS ERROR:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to fetch subscriptions");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toFixed(2)}`;
  };

  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "active"
  );

  const monthlySpending = activeSubscriptions.reduce(
    (total, subscription) => {
      if (subscription.frequency === "monthly") {
        return total + subscription.price;
      }

      if (subscription.frequency === "yearly") {
        return total + subscription.price / 12;
      }

      if (subscription.frequency === "weekly") {
        return total + subscription.price * 4.33;
      }

      return total;
    },
    0
  );

  return (
    <main className="min-h-screen bg-[#f8f9fc] text-[#171923]">

      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
              S
            </div>

            <div>
              <h1 className="font-bold text-lg leading-none">
                SubTrack
              </h1>

              <p className="text-xs text-gray-500 mt-1">
                Subscription Manager
              </p>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">
              {userName || "User"}
            </span>

          </div>

        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

          <div>
            <p className="text-xs font-bold tracking-widest text-indigo-600">
              DASHBOARD
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Welcome back{userName ? `, ${userName}` : ""}.
            </h2>

            <p className="text-gray-500 mt-2">
              Here's an overview of your subscriptions.
            </p>
          </div>

    <div className="flex items-center justify-center gap-6">

        <Link
            href="/cancel"
            className="px-5 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
        >
            Cancel Subscription
        </Link>

        <Link
            href="/subscriptions"
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
        >
            + Add Subscription
        </Link>
    </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          {/* Total */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500">
              Total subscriptions
            </p>

            <p className="text-3xl font-bold mt-2">
              {loading ? "..." : subscriptions.length}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              All your subscriptions
            </p>
          </div>

          {/* Active */}
          <div className="bg-indigo-600 text-white rounded-2xl p-6">
            <p className="text-sm text-indigo-200">
              Active subscriptions
            </p>

            <p className="text-3xl font-bold mt-2">
              {loading ? "..." : activeSubscriptions.length}
            </p>

            <p className="text-xs text-indigo-200 mt-2">
              Currently running
            </p>
          </div>

          {/* Spending */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500">
              Monthly spending
            </p>

            <p className="text-3xl font-bold mt-2">
              {loading
                ? "..."
                : `$${monthlySpending.toFixed(2)}`}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Estimated monthly cost
            </p>
          </div>

        </div>

        {/* Subscriptions */}


          {/* Loading */}
          {loading && (
            <div className="px-6 py-16 text-center text-gray-500">
              Loading subscriptions...
            </div>
          )}

          {/* No subscriptions */}
          {!loading &&
            !error &&
            subscriptions.length === 0 && (
              <div className="px-6 py-16 text-center">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
                  +
                </div>

                <h3 className="font-bold text-lg mt-4">
                  No subscriptions yet
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Add your first subscription to start tracking
                  your recurring expenses.
                </p>

                <Link
                  href="/subscriptions"
                  className="inline-block mt-5 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Add Subscription
                </Link>

              </div>
            )}

          {/* Subscription list */}
          {!loading && subscriptions.length > 0 && (
            <div className="mt-6">

              {/* Table container */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

                {/* Table header */}
                <div className="hidden md:grid grid-cols-[2fr_1.2fr_1.3fr_1.5fr_1.5fr_1fr] gap-6 px-8 py-5 bg-gray-50 border-b border-gray-200">

                  <span className="text-xs font-semibold tracking-wide text-gray-400">
                    SUBSCRIPTION
                  </span>

                  <span className="text-xs font-semibold tracking-wide text-gray-400">
                    PRICE
                  </span>

                  <span className="text-xs font-semibold tracking-wide text-gray-400">
                    FREQUENCY
                  </span>

                  <span className="text-xs font-semibold tracking-wide text-gray-400">
                    START DATE
                  </span>

                  <span className="text-xs font-semibold tracking-wide text-gray-400">
                    RENEWAL
                  </span>

                  <span className="text-xs font-semibold tracking-wide text-gray-400">
                    STATUS
                  </span>

                </div>

                {/* Rows */}
                {subscriptions.map((subscription) => (
                  <div
                    key={subscription._id}
                    className="
                      grid grid-cols-1
                      md:grid-cols-[2fr_1.2fr_1.3fr_1.5fr_1.5fr_1fr]
                      gap-5 md:gap-6
                      md:items-center
                      px-8 py-7
                      border-b border-gray-100
                      last:border-b-0
                      hover:bg-gray-50/70
                      transition
                    "
                  >

                    {/* Name */}
                    <div className="flex items-center gap-4 min-w-0">

                      <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                        {subscription.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {subscription.name}
                        </p>

                        <p className="text-sm text-gray-400 mt-1 capitalize">
                          {subscription.category}
                        </p>
                      </div>

                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-xs text-gray-400 md:hidden mb-1">
                        PRICE
                      </p>

                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(
                          subscription.price,
                          subscription.currency
                        )}
                      </p>
                    </div>

                    {/* Frequency */}
                    <div>
                      <p className="text-xs text-gray-400 md:hidden mb-1">
                        FREQUENCY
                      </p>

                      <p className="text-sm text-gray-600 capitalize">
                        {subscription.frequency}
                      </p>
                    </div>

                    {/* Start date */}
                    <div>
                      <p className="text-xs text-gray-400 md:hidden mb-1">
                        START DATE
                      </p>

                      <p className="text-sm text-gray-600">
                        {formatDate(subscription.startDate)}
                      </p>
                    </div>

                    {/* Renewal date */}
                    <div>
                      <p className="text-xs text-gray-400 md:hidden mb-1">
                        RENEWAL
                      </p>

                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(subscription.renewalDate)}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-xs text-gray-400 md:hidden mb-1">
                        STATUS
                      </p>

                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                          subscription.status === "active"
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {subscription.status}
                      </span>
                    </div>

                  </div>
                ))}

              </div>

            </div>
          )}

        </div>

    </main>
  );
}