"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import Cookies from "js-cookie"

import complex_logo_final_white from "../assets/img/logo/complex_logo_final_white.png"
export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation()
  const [userRole, setUserRole] = useState("")
  const [userName, setUserName] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const role = Cookies.get("userRole")
    const email = Cookies.get("userEmail")

    setUserRole(role || "")
    setUserName(email || "")

    // Check if sidebar collapse state is saved in localStorage
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState) {
      setIsCollapsed(savedState === "true")
    }
  }, [])

  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  const isActive = (path) => {
    return location.pathname.includes(path)
  }

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  const handleLogout = () => {
    Cookies.remove("jwt")
    Cookies.remove("userRole")
    Cookies.remove("userName")
    Cookies.remove("userId")
    window.location.href = "/"
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (!userName) return "U"
    return userName.charAt(0).toUpperCase()
  }

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
        className={`fixed top-0 left-0 z-30 h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 shadow-2xl transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "w-16" : "w-64"}`}
      >
        <div className="flex flex-col h-full relative">
          {/* Collapse toggle button */}
          <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-20 bg-amber-800 hover:bg-amber-700 text-white rounded-full p-1.5 shadow-lg z-50 hidden md:block transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Logo Section - Modernized */}
          <div
            className={`flex items-center justify-center border-b border-white/20 bg-gradient-to-r from-amber-800/50 to-orange-800/50 backdrop-blur-sm ${
              isCollapsed ? "h-20 px-2" : "h-32 px-6"
            } transition-all duration-300`}
          >
            <Link to="/" className="relative group">
              <div className="relative">
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>

                {/* Logo image */}
                <img
                  src={complex_logo_final_white}
                  alt="Centre Culturel Logo"
                  className={`relative z-10 transition-all duration-300 filter brightness-110 drop-shadow-md group-hover:brightness-125 group-hover:drop-shadow-xl ${
                    isCollapsed ? "h-12 w-auto" : "h-20 w-auto"
                  }`}
                />

                {/* Subtle border glow */}
                <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-white/20 transition-all duration-300"></div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-2">
              {/* Dashboard */}
              <li>
                <Link
                  to="/dashboard/admin"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-3 text-white rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-lg relative ${
                    location.pathname === "/dashboard/admin"
                      ? "bg-white/20 shadow-lg font-medium border border-white/20"
                      : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    {/* Home icon - Modern Lucide style */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                      />
                      <polyline points="9,22 9,12 15,12 15,22" />
                    </svg>
                  </span>

                  {!isCollapsed && <span className="ml-3 transition-opacity duration-200">Tableau de bord</span>}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-xl text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
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
                  } px-3 py-3 text-white rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-lg relative ${
                    isActive("/users") ? "bg-white/20 shadow-lg font-medium border border-white/20" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    {/* Users icon - Modern Lucide style */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                      />
                      <circle cx="9" cy="7" r="4" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m22 21-3-3m0 0a2 2 0 0 0-3-3 2 2 0 0 0-3 3 2 2 0 0 0 3 3 2 2 0 0 0 3-3Z"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && <span className="ml-3 transition-opacity duration-200">Utilisateurs</span>}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-xl text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
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
                  } px-3 py-3 text-white rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-lg relative ${
                    isActive("/talents") ? "bg-white/20 shadow-lg font-medium border border-white/20" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    {/* UserCheck icon - Modern Lucide style */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                      />
                      <circle cx="8.5" cy="7" r="4" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="m17 11 2 2 4-4" />
                    </svg>
                  </span>

                  {!isCollapsed && <span className="ml-3 transition-opacity duration-200">Talents</span>}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-xl text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
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
                  } px-3 py-3 text-white rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-lg relative ${
                    isActive("/reservations") ? "bg-white/20 shadow-lg font-medium border border-white/20" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    {/* Calendar icon - Modern Lucide style */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4" />
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 16 2 2 4-4" />
                    </svg>
                  </span>

                  {!isCollapsed && <span className="ml-3 transition-opacity duration-200">Réservations</span>}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-xl text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
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
                  } px-3 py-3 text-white rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-lg relative ${
                    isActive("/event-proposals") ? "bg-white/20 shadow-lg font-medium border border-white/20" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    {/* Lightbulb icon - Modern Lucide style */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && (
                    <span className="ml-3 transition-opacity duration-200">Propositions d'événements</span>
                  )}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-xl text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
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
                  } px-3 py-3 text-white rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-lg relative ${
                    isActive("/events") ? "bg-white/20 shadow-lg font-medium border border-white/20" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    {/* CalendarDays icon - Modern Lucide style */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4" />
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && <span className="ml-3 transition-opacity duration-200">Événements</span>}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-xl text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
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
                  } px-3 py-3 text-white rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-lg relative ${
                    isActive("/espaces") ? "bg-white/20 shadow-lg font-medium border border-white/20" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    {/* Building icon - Modern Lucide style */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 22v-4h6v4" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"
                      />
                    </svg>
                  </span>

                  {!isCollapsed && <span className="ml-3 transition-opacity duration-200">Espaces</span>}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-xl text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
                      Espaces
                    </div>
                  )}
                </Link>
              </li>

              {/* Messages */}
              <li>
                <Link
                  to="/dashboard/messages"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-3 text-white rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-lg relative ${
                    isActive("/messages") ? "bg-white/20 shadow-lg font-medium border border-white/20" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    {/* Mail icon - Modern Lucide style */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="m22 7-10 5L2 7" />
                    </svg>
                  </span>

                  {!isCollapsed && <span className="ml-3 transition-opacity duration-200">Messages</span>}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-xl text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
                      Messages
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
                  } px-3 py-3 text-white rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-lg relative ${
                    isActive("/reports") ? "bg-white/20 shadow-lg font-medium border border-white/20" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    {/* BarChart3 icon - Modern Lucide style */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 17V9l-5 5-4-4-4 4" />
                    </svg>
                  </span>

                  {!isCollapsed && <span className="ml-3 transition-opacity duration-200">Rapports</span>}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-xl text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
                      Rapports
                    </div>
                  )}
                </Link>
              </li>

              {/* Chatbot */}
              <li>
                <Link
                  to="/dashboard/chatbot"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-3 text-white rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-lg relative ${
                    isActive("/chatbot") ? "bg-white/20 shadow-lg font-medium border border-white/20" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    {/* Bot icon - Modern Lucide style */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8V4l3 3-3 3zm0 0v8" />
                      <circle cx="12" cy="12" r="3" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v6m0 6v6" />
                    </svg>
                  </span>

                  {!isCollapsed && <span className="ml-3 transition-opacity duration-200">Chatbot</span>}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-xl text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
                      Chatbot
                    </div>
                  )}
                </Link>
              </li>

              {/* Configuration */}
              <li>
                <Link
                  to="/dashboard/config"
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-3 py-3 text-white rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-lg relative ${
                    isActive("/config") ? "bg-white/20 shadow-lg font-medium border border-white/20" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    {/* Settings icon - Modern Lucide style */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>

                  {!isCollapsed && <span className="ml-3 transition-opacity duration-200">Configuration</span>}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-xl text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
                      Configuration
                    </div>
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          {/* User profile section - Enhanced */}
          <div
            className={`mt-auto border-t border-white/20 bg-gradient-to-r from-amber-800/30 to-orange-800/30 backdrop-blur-sm ${
              isCollapsed ? "p-3" : "p-4"
            }`}
          >
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-semibold text-lg shadow-lg border-2 border-white/20">
                    {getInitials()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{userName}</p>
                  <p className="text-xs text-white/70 truncate capitalize">{userRole}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200 hover:shadow-lg border border-white/10 hover:border-white/20"
                  title="Déconnexion"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-semibold text-sm shadow-lg border-2 border-white/20">
                  {getInitials()}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200 hover:shadow-lg border border-white/10 hover:border-white/20"
                  title="Déconnexion"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
