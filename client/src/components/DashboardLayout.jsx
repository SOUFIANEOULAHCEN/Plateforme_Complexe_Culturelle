"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Cookies from "js-cookie";
import NotificationsPanel from "./NotificationsPanel";
import api from "../api";
export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = Cookies.get("jwt");
    if (!token) {
      navigate("/login");
    } else {
      // Récupérer le nom d'utilisateur
      const name = Cookies.get("userEmail");
      setUserName(name || "Utilisateur");
    }
  }, [navigate]);
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get("/notification/unread-count");
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();

    // Set up polling to check for new notifications
    const interval = setInterval(fetchUnreadCount, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwt");
    Cookies.remove("userRole");
    Cookies.remove("userName");
    Cookies.remove("userId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[oklch(0.97_0_0)]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="bg-white border-b border-[oklch(0.922_0_0)] h-16 flex items-center px-2 sticky top-0 z-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden text-[oklch(0.3_0_0)] hover:text-[oklch(0.145_0_0)] mr-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
      {showNotifications && (
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
}
