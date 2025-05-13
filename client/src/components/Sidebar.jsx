"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const role = Cookies.get("userRole");
    const email = Cookies.get("userEmail");

    setUserRole(role || "");
    setUserName(email || "");

    // Check if sidebar collapse state is saved in localStorage
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) {
      setIsCollapsed(savedState === "true");
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("jwt");
    Cookies.remove("userRole");
    Cookies.remove("userName");
    Cookies.remove("userId");
    window.location.href = "/";
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!userName) return "U";
    return userName.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen bg-gradient-to-br from-[oklch(47.3%_0.137_46.201)] to-[oklch(37.3%_0.137_46.201)] shadow-lg transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "w-16" : "w-64"}`}
      >
        <div className="flex flex-col h-full relative">
          {/* Collapse toggle button */}
          <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-20 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-full p-1 shadow-md z-50 hidden md:block"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Logo */}
          <div
            className={`flex items-center h-16 border-b border-white/10 px-4 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!isCollapsed && (
              <Link
                to="/"
                className="text-xl font-bold text-[oklch(1_0_0)] truncate"
              >
                Centre Culturel
              </Link>
            )}
            {isCollapsed && (
              <Link to="/" className="text-xl font-bold text-[oklch(1_0_0)]">
                C
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {/* Dashboard */}
              <li>
                <Link
                  to="/dashboard/admin"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-2 text-white rounded-lg transition-all duration-200 hover:bg-white/10 relative ${
                    location.pathname === "/dashboard/admin"
                      ? "bg-white/20 font-medium"
                      : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-200">
                      Tableau de bord
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[oklch(1_0_0)] text-[oklch(47.3%_0.137_46.201)] rounded shadow-lg text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      Tableau de bord
                    </div>
                  )}
                </Link>
              </li>
              {/* Users */}
              <li>
                <Link
                  to="/dashboard/users"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-2 text-white rounded-lg transition-all duration-200 hover:bg-white/10 relative ${
                    isActive("/users") ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-200">
                      Utilisateurs
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[oklch(1_0_0)] text-[oklch(47.3%_0.137_46.201)] rounded shadow-lg text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      Utilisateurs
                    </div>
                  )}
                </Link>
              </li>
              {/* Talents */}
              <li>
                <Link
                  to="/dashboard/talents"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-2 text-white rounded-lg transition-all duration-200 hover:bg-white/10 relative ${
                    isActive("/talents") ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-200">
                      Talents
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[oklch(1_0_0)] text-[oklch(47.3%_0.137_46.201)] rounded shadow-lg text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      Talents
                    </div>
                  )}
                </Link>
              </li>

              {/* Reservations */}
              <li>
                <Link
                  to="/dashboard/reservations"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-2 text-white rounded-lg transition-all duration-200 hover:bg-white/10 relative ${
                    isActive("/reservations") ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-200">
                      Réservations
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[oklch(1_0_0)] text-[oklch(47.3%_0.137_46.201)] rounded shadow-lg text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      Réservations
                    </div>
                  )}
                </Link>
              </li>
              {/* Event Proposals */}
              <li>
                <Link
                  to="/dashboard/event-proposals"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-2 text-white rounded-lg transition-all duration-200 hover:bg-white/10 relative ${
                    isActive("/event-proposals")
                      ? "bg-white/20 font-medium"
                      : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16l-4-4m0 0l4-4m-4 4h16"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-200">
                      Propositions d'événements
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[oklch(1_0_0)] text-[oklch(47.3%_0.137_46.201)] rounded shadow-lg text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      Propositions d'événements
                    </div>
                  )}
                </Link>
              </li>
              {/* Events */}
              <li>
                <Link
                  to="/dashboard/events"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-2 text-white rounded-lg transition-all duration-200 hover:bg-white/10 relative ${
                    isActive("/events") ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-200">
                      Événements
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[oklch(1_0_0)] text-[oklch(47.3%_0.137_46.201)] rounded shadow-lg text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      Événements
                    </div>
                  )}
                </Link>
              </li>

              {/* Spaces */}
              <li>
                <Link
                  to="/dashboard/espaces"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-2 text-white rounded-lg transition-all duration-200 hover:bg-white/10 relative ${
                    isActive("/espaces") ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-200">
                      Espaces
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[oklch(1_0_0)] text-[oklch(47.3%_0.137_46.201)] rounded shadow-lg text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      Espaces
                    </div>
                  )}
                </Link>
              </li>

              {/* Comments */}
              <li>
                <Link
                  to="/dashboard/commentaires"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-2 text-white rounded-lg transition-all duration-200 hover:bg-white/10 relative ${
                    isActive("/commentaires") ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-200">
                      Commentaires
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[oklch(1_0_0)] text-[oklch(47.3%_0.137_46.201)] rounded shadow-lg text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      Commentaires
                    </div>
                  )}
                </Link>
              </li>

              {/* Reports */}
              <li>
                <Link
                  to="/dashboard/reports"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-2 text-white rounded-lg transition-all duration-200 hover:bg-white/10 relative ${
                    isActive("/reports") ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-200">
                      Rapports
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[oklch(1_0_0)] text-[oklch(47.3%_0.137_46.201)] rounded shadow-lg text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      Rapports
                    </div>
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          {/* User profile section */}
          <div
            className={`mt-auto border-t border-white/10 p-4 ${
              isCollapsed ? "text-center" : ""
            }`}
          >
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[oklch(1_0_0)] text-[oklch(47.3%_0.137_46.201)] flex items-center justify-center font-medium text-lg">
                    {getInitials()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-white/60 truncate capitalize">
                    {userRole}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 rounded-full bg-[oklch(1_0_0)] text-[oklch(47.3%_0.137_46.201)] flex items-center justify-center font-medium text-sm">
                  {getInitials()}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  title="Déconnexion"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
