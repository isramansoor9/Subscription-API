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

export default function CancelPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------------------------------------
  // FETCH SUBSCRIPTIONS
  // ---------------------------------------

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
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch subscriptions"
        );
      }

      // Only show active subscriptions
      const activeSubscriptions = (data.data || [])
        .filter(
          (subscription: Subscription) =>
            subscription.status === "active"
        )
        .sort(
          (a: Subscription, b: Subscription) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

      setSubscriptions(activeSubscriptions);

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

  // ---------------------------------------
  // LOAD WHEN PAGE OPENS
  // ---------------------------------------

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be signed in to manage subscriptions.");
      setLoading(false);
      return;
    }

    fetchSubscriptions(token);
  }, []);

  // ---------------------------------------
  // CANCEL SUBSCRIPTION
  // ---------------------------------------

  const handleCancel = async (subscriptionId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this subscription?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be signed in.");
      return;
    }

    try {
      setCancellingId(subscriptionId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `http://localhost:5500/api/v1/subscriptions/${subscriptionId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to cancel subscription"
        );
      }

      setSuccess("Subscription cancelled successfully.");

      // Remove cancelled subscription from this page
      setSubscriptions((currentSubscriptions) =>
        currentSubscriptions.filter(
          (subscription) =>
            subscription._id !== subscriptionId
        )
      );

    } catch (error) {
      console.error("CANCEL SUBSCRIPTION ERROR:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to cancel subscription");
      }
    } finally {
      setCancellingId(null);
    }
  };

  // ---------------------------------------
  // FORMAT DATE
  // ---------------------------------------

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ---------------------------------------
  // FORMAT PRICE
  // ---------------------------------------

  const formatPrice = (
    price: number,
    currency: string
  ) => {
    return `${currency} ${price.toFixed(2)}`;
  };

  // ---------------------------------------
  // PAGE
  // ---------------------------------------

  return (
    <main className="min-h-screen bg-[#f8f9fc] text-[#171923]">

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


          <div className="flex items-center gap-6">

            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-indigo-600"
            >
              Dashboard
            </Link>

            <Link
              href="/subscriptions"
              className="text-sm text-gray-600 hover:text-indigo-600"
            >
              Add Subscription
            </Link>

            <span className="text-sm font-semibold text-red-600">
              Cancel
            </span>

          </div>

        </div>

      </nav>


      {/* Main */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">

          <p className="text-xs font-bold tracking-widest text-red-600">
            MANAGE SUBSCRIPTIONS
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Cancel subscriptions
          </h1>

          <p className="text-gray-500 mt-2">
            View your active subscriptions and cancel any
            subscription you no longer need.
          </p>

        </div>


        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}


        {/* Success */}
        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}


        {/* Loading */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

            <p className="text-gray-500">
              Loading subscriptions...
            </p>

          </div>
        )}


        {/* No active subscriptions */}
        {!loading &&
          subscriptions.length === 0 &&
          !error && (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

              <div className="w-14 h-14 mx-auto rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-xl">
                ✓
              </div>

              <h2 className="font-bold text-xl mt-5">
                No active subscriptions
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                You don't have any active subscriptions to cancel.
              </p>

              <Link
                href="/subscriptions"
                className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Add Subscription
              </Link>

            </div>
          )}


        {/* Subscription list */}
        {!loading && subscriptions.length > 0 && (

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200">

              <h2 className="text-lg font-bold">
                Active subscriptions
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {subscriptions.length} active subscription
                {subscriptions.length !== 1 ? "s" : ""}
              </p>

            </div>


            {/* Rows */}
            <div>

              {subscriptions.map((subscription) => (

                <div
                  key={subscription._id}
                  className="px-6 py-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                    {/* Subscription information */}
                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                        {subscription.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <h3 className="font-bold text-lg">
                          {subscription.name}
                        </h3>

                        <p className="text-sm text-gray-500 capitalize mt-1">
                          {subscription.category}
                        </p>

                      </div>

                    </div>


                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">

                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-gray-400">
                          PRICE
                        </p>

                        <p className="text-sm font-semibold mt-1">
                          {formatPrice(
                            subscription.price,
                            subscription.currency
                          )}
                        </p>
                      </div>


                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-gray-400">
                          FREQUENCY
                        </p>

                        <p className="text-sm font-medium mt-1 capitalize">
                          {subscription.frequency}
                        </p>
                      </div>


                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-gray-400">
                          RENEWAL
                        </p>

                        <p className="text-sm font-semibold mt-1">
                          {formatDate(
                            subscription.renewalDate
                          )}
                        </p>
                      </div>

                    </div>


                    {/* Cancel button */}
                    <button
                      onClick={() =>
                        handleCancel(subscription._id)
                      }
                      disabled={
                        cancellingId === subscription._id
                      }
                      className="shrink-0 px-5 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {cancellingId === subscription._id
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>

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