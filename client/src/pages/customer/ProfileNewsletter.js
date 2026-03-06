"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { FiMail, FiCheckCircle, FiChevronLeft } from "react-icons/fi";

const ProfileNewsletter = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      api
        .get(`/newsletter/status?email=${encodeURIComponent(user.email)}`)
        .then(({ data }) => setSubscribed(data.isSubscribed))
        .catch(() => {});
    }
  }, [user?.email]);

  const handleToggle = async () => {
    if (!user?.email || loading) return;
    setLoading(true);
    try {
      if (subscribed) {
        await api.post("/newsletter/unsubscribe", { email: user.email });
        setSubscribed(false);
        toast.success("Unsubscribed from newsletter");
      } else {
        await api.post("/newsletter/subscribe", { email: user.email });
        setSubscribed(true);
        toast.success("Subscribed to newsletter!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update preference",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.push("/profile")}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiChevronLeft size={20} />
          </button>
          <h1 className="text-base font-semibold text-gray-800">Newsletter</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Status banner */}
        <div
          className={`rounded-xl p-4 flex items-center gap-3 ${
            subscribed
              ? "bg-green-50 border border-green-200"
              : "bg-gray-100 border border-gray-200"
          }`}
        >
          <FiCheckCircle
            size={18}
            className={subscribed ? "text-green-500" : "text-gray-400"}
          />
          <p
            className={`text-sm font-medium ${subscribed ? "text-green-700" : "text-gray-500"}`}
          >
            {subscribed
              ? "You're currently subscribed."
              : "You are not subscribed."}
          </p>
        </div>

        {/* Toggle row */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                <FiMail className="text-primary-500" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Email Newsletter
                </p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${subscribed ? "text-primary-600" : "text-gray-400"}`}
              >
                {subscribed ? "On" : "Off"}
              </span>
              <button
                onClick={handleToggle}
                disabled={loading}
                aria-label="Toggle newsletter"
                className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 ${
                  subscribed ? "bg-primary-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    subscribed ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 px-1">
          We send weekly fashion tips, new arrivals and exclusive deals. No spam
          — unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default ProfileNewsletter;
