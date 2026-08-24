"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
    }
  }, []);

  const handleStartTracking = () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setUserName("");

  router.push("/");
};

  return (
    <main className="min-h-screen bg-[#f8f9fc] text-[#171923]">

      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-0 h-20 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
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
          </div>

          <div className="flex items-center gap-3">

          {userName ? (
            <>
              {/* User name */}
              <span className="font-semibold text-gray-700">
                {userName}
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Sign in */}
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition"
              >
                Sign In
              </Link>

              {/* Get started */}
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

        </div>
      </nav>


      {/* Hero */}
      <section className="relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">

          <div className="max-w-3xl mx-auto text-center">

            <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Know exactly where
              <br />

              <span className="text-indigo-600">
                your money goes.
              </span>
            </h2>

            <p className="mt-7 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Track your subscriptions, monitor recurring expenses,
              and stay ahead of upcoming renewals all from one
              simple dashboard.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-9">

              <button
                onClick={handleStartTracking}
                className="px-7 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Start Tracking
              </button>

            </div>

          </div>


          {/* Dashboard Preview */}
          <div className="mt-20 max-w-5xl mx-auto">

            <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/70 overflow-hidden">

              {/* Browser header */}
              <div className="h-11 border-b border-gray-200 flex items-center px-4 gap-2 bg-gray-50">

                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />

                <div className="ml-5 h-6 w-64 rounded-md bg-white border border-gray-200 flex items-center px-3">
                  <span className="text-[10px] text-gray-400">
                    subtrack.app/dashboard
                  </span>
                </div>

              </div>


              {/* Dashboard */}
              <div className="p-6 md:p-8">

                <div className="flex justify-between items-center mb-7">

                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-indigo-600">
                      OVERVIEW
                    </p>

                    <h3 className="text-xl font-bold mt-1">
                      Your subscriptions
                    </h3>
                  </div>

                  <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold">
                    + Add subscription
                  </div>

                </div>


                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">

                  <Stat
                    title="Active subscriptions"
                    value="8"
                    subtitle="currently running"
                  />

                  <div className="rounded-xl p-5 bg-indigo-600 text-white">
                    <p className="text-xs text-indigo-200">
                      Renewing soon
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      3
                    </p>

                    <p className="text-[10px] text-indigo-200 mt-1">
                      within the next 7 days
                    </p>
                  </div>

                  <Stat
                    title="Monthly spending"
                    value="$84.97"
                    subtitle="estimated monthly cost"
                  />

                </div>


                {/* Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">

                  <div className="grid grid-cols-4 bg-gray-50 px-5 py-3 text-[10px] font-bold tracking-wider text-gray-400">
                    <span>SUBSCRIPTION</span>
                    <span>PRICE</span>
                    <span>RENEWAL</span>
                    <span>STATUS</span>
                  </div>

                  <SubscriptionRow
                    name="Netflix"
                    category="Entertainment"
                    price="$15.99"
                    renewal="Aug 25"
                  />

                  <SubscriptionRow
                    name="Spotify"
                    category="Entertainment"
                    price="$9.99"
                    renewal="Aug 28"
                  />

                  <SubscriptionRow
                    name="GitHub"
                    category="Productivity"
                    price="$10.00"
                    renewal="Sep 02"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Features */}
      <section className="bg-white border-y border-gray-200">

        <div className="max-w-6xl mx-auto px-6 py-24">

          <div className="max-w-2xl mb-14">

            <p className="text-xs font-bold tracking-widest text-indigo-600">
              EVERYTHING IN ONE PLACE
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">
              Take control of your recurring expenses.
            </h2>

            <p className="text-gray-500 mt-4 leading-relaxed">
              SubTrack gives you the tools to keep your subscriptions
              organized and your spending visible.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-5">

            <Feature
              icon="◷"
              title="Track renewals"
              description="Know when every subscription renews and see which payments are coming up."
            />

            <Feature
              icon="$"
              title="Monitor spending"
              description="See your recurring costs and understand how much you're spending each month."
            />

            <Feature
              icon="✓"
              title="Stay organized"
              description="Keep subscription names, categories, prices, payment methods and statuses together."
            />

            <Feature
              icon="+"
              title="Add subscriptions"
              description="Create a subscription with its price, frequency, category and payment method."
            />

            <Feature
              icon="↻"
              title="Update anytime"
              description="Change subscription details whenever your plans or pricing changes."
            />

            <Feature
              icon="×"
              title="Cancel easily"
              description="Cancel subscriptions you no longer need and keep your dashboard up to date."
            />

          </div>

        </div>

      </section>


      {/* Renewal Section */}
      <section className="max-w-6xl mx-auto px-6 py-24">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div>

            <p className="text-xs font-bold tracking-widest text-indigo-600">
              NEVER MISS A PAYMENT
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">
              See your upcoming renewals before they happen.
            </h2>

            <p className="text-gray-500 mt-5 leading-relaxed">
              Your dashboard highlights subscriptions that are
              renewing soon, helping you avoid unexpected charges
              and giving you time to cancel anything you no longer use.
            </p>

            <Link
              href="/signup"
              className="inline-block mt-7 text-indigo-600 font-semibold text-sm hover:text-indigo-700"
            >
              Start tracking your renewals →
            </Link>

          </div>


          <div className="space-y-3">

            <Renewal
              name="Netflix"
              category="Entertainment"
              date="Aug 25"
              price="$15.99"
              days="5 days left"
            />

            <Renewal
              name="Spotify"
              category="Entertainment"
              date="Aug 28"
              price="$9.99"
              days="8 days left"
            />

            <Renewal
              name="GitHub"
              category="Productivity"
              date="Sep 02"
              price="$10.00"
              days="13 days left"
            />

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="px-6 pb-24">

        <div className="max-w-6xl mx-auto rounded-3xl bg-indigo-600 px-8 py-16 text-center text-white relative overflow-hidden">

          <div className="absolute w-80 h-80 rounded-full bg-white/10 -top-40 -right-20" />
          <div className="absolute w-64 h-64 rounded-full bg-white/10 -bottom-40 -left-20" />

          <div className="relative">

            <p className="text-xs font-bold tracking-widest text-indigo-200">
              GET STARTED
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Ready to take control?
            </h2>

            <p className="text-indigo-100 mt-4 max-w-lg mx-auto">
              Create your account and start managing all your
              subscriptions from one place.
            </p>

            <Link
              href="/signup"
              className="inline-block mt-8 bg-white text-indigo-600 px-7 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Create your account
            </Link>

          </div>

        </div>

      </section>


      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">

        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between gap-3">

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              S
            </div>

            <span className="font-semibold text-sm">
              SubTrack
            </span>
          </div>

          <p className="text-xs text-gray-400">
            Subscription Management System
          </p>

        </div>

      </footer>

    </main>
  );
}


/* ---------------- Components ---------------- */

function Stat({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-5">

      <p className="text-xs text-gray-500">
        {title}
      </p>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

      <p className="text-[10px] text-gray-400 mt-1">
        {subtitle}
      </p>

    </div>
  );
}


function SubscriptionRow({
  name,
  category,
  price,
  renewal,
}: {
  name: string;
  category: string;
  price: string;
  renewal: string;
}) {
  return (
    <div className="grid grid-cols-4 items-center px-5 py-4 border-t border-gray-200">

      <div className="flex items-center gap-3">

        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
          {name.charAt(0)}
        </div>

        <div>
          <p className="text-xs font-semibold">
            {name}
          </p>

          <p className="text-[10px] text-gray-400">
            {category}
          </p>
        </div>

      </div>

      <span className="text-xs font-medium">
        {price}
      </span>

      <span className="text-xs text-gray-500">
        {renewal}
      </span>

      <span className="text-xs font-semibold text-green-600">
        Active
      </span>

    </div>
  );
}


function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group border border-gray-200 rounded-2xl p-6 bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/40 transition">

      <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:bg-indigo-600 group-hover:text-white transition">
        {icon}
      </div>

      <h3 className="font-bold text-lg mt-5">
        {title}
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed mt-2">
        {description}
      </p>

    </div>
  );
}


function Renewal({
  name,
  category,
  date,
  price,
  days,
}: {
  name: string;
  category: string;
  date: string;
  price: string;
  days: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition">

      <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
        {name.charAt(0)}
      </div>

      <div className="flex-1">

        <p className="font-semibold text-sm">
          {name}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {category}
        </p>

      </div>

      <div className="text-right">

        <p className="text-sm font-semibold">
          {price}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {date} · {days}
        </p>

      </div>

    </div>
  );
}