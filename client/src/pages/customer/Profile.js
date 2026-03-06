"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import api from "../../utils/api";
import toast from "react-hot-toast";
import {
  FiUser,
  FiShield,
  FiMail,
  FiPackage,
  FiHeart,
  FiLogOut,
  FiTrash2,
  FiChevronRight,
} from "react-icons/fi";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await api.delete("/auth/account", {
        data: { password: deletePassword },
      });
      toast.success("Account deleted successfully");
      dispatch(logout());
      router.push("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleteLoading(false);
    }
  };

  const menuItems = [
    {
      href: "/profile/info",
      icon: FiUser,
      label: "Personal Information",
      desc: "Name, email, phone",
    },
    {
      href: "/profile/security",
      icon: FiShield,
      label: "Security",
      desc: "Password & account safety",
    },
    {
      href: "/profile/newsletter",
      icon: FiMail,
      label: "Newsletter",
      desc: "Subscribe / unsubscribe",
    },
    {
      href: "/orders",
      icon: FiPackage,
      label: "My Orders",
      desc: "Track and view orders",
    },
    {
      href: "/wishlist",
      icon: FiHeart,
      label: "Wishlist",
      desc: "Saved items",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-lg mx-auto px-4">
        {/* User info card */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">
              {user?.firstName?.[0]?.toUpperCase() || <FiUser size={20} />}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Menu list */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                index !== 0 ? "border-t border-gray-100" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                <item.icon className="text-primary-500" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <FiChevronRight className="text-gray-300 flex-shrink-0" size={16} />
            </Link>
          ))}
        </div>

        {/* Danger actions */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <FiTrash2 className="text-red-400" size={16} />
            </div>
            <span className="text-sm font-medium">Delete Account</span>
          </button>
          <div className="border-t border-gray-100" />
          <button
            onClick={() => {
              dispatch(logout());
              router.push("/");
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-red-600 hover:bg-red-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <FiLogOut className="text-red-500" size={16} />
            </div>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <FiTrash2 className="text-red-600" size={18} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Delete Account
              </h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              This action is <strong>permanent and cannot be undone</strong>.
              All your personal data will be removed.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm your password
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-900"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                }}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || !deletePassword}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>Delete My Account</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
