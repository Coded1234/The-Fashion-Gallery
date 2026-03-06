"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiCreditCard,
  FiMail,
  FiPhone,
  FiBell,
  FiChevronLeft,
} from "react-icons/fi";

const ProfileNotifications = () => {
  const router = useRouter();

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    smsAlerts: true,
  });

  const handleToggle = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    try {
      await api.put("/auth/notifications", updated);
      toast.success("Preferences updated!");
    } catch {
      setNotifications(notifications);
    }
  };

  const items = [
    {
      key: "orderUpdates",
      icon: FiPackage,
      title: "Order Updates",
      desc: "Status changes for your orders",
    },
    {
      key: "promotions",
      icon: FiCreditCard,
      title: "Promotions & Offers",
      desc: "Sales, discounts and special offers",
    },
    {
      key: "newsletter",
      icon: FiMail,
      title: "Newsletter",
      desc: "Weekly fashion tips and new arrivals",
    },
    {
      key: "smsAlerts",
      icon: FiPhone,
      title: "SMS Alerts",
      desc: "Order updates via text message",
    },
  ];

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
          <h1 className="text-base font-semibold text-gray-800">
            Notifications
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-3 flex items-center gap-2 px-1">
          <FiBell className="text-gray-400" size={15} />
          <p className="text-xs text-gray-500">
            Choose what updates you want to receive
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {items.map((item, index) => (
            <div
              key={item.key}
              className={`flex items-center justify-between px-4 py-4 ${
                index !== 0 ? "border-t border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-gray-500" size={15} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(item.key)}
                aria-label={`Toggle ${item.title}`}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                  notifications[item.key] ? "bg-primary-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    notifications[item.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileNotifications;
