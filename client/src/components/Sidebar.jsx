"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = Cookies.get("userRole");
    const name = Cookies.get("userEmail");

    setUserRole(role || "");
  }, []);

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
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
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-[oklch(0.922_0_0)] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-[oklch(0.922_0_0)]">
            <Link
              to="/"
              className="text-xl font-bold text-[oklch(47.3%_0.137_46.201)]"
            >
              Centre Culturel
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard/admin"
                  className={`flex items-center px-4 py-2 text-[oklch(0.3_0_0)] rounded-lg hover:bg-[oklch(0.95_0_0)] ${
                    location.pathname === "/dashboard/admin"
                      ? "bg-[oklch(0.95_0_0)] font-medium"
                      : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  <span>Tableau de bord</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard/reservations"
                  className={`flex items-center px-4 py-2 text-[oklch(0.3_0_0)] rounded-lg hover:bg-[oklch(0.95_0_0)] ${
                    isActive("/reservations")
                      ? "bg-[oklch(0.95_0_0)] font-medium"
                      : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  <span>Réservations</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard/events"
                  className={`flex items-center px-4 py-2 text-[oklch(0.3_0_0)] rounded-lg hover:bg-[oklch(0.95_0_0)] ${
                    isActive("/events")
                      ? "bg-[oklch(0.95_0_0)] font-medium"
                      : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  <span>Événements</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard/talents"
                  className={`flex items-center px-4 py-2 text-[oklch(0.3_0_0)] rounded-lg hover:bg-[oklch(0.95_0_0)] ${
                    isActive("/talents")
                      ? "bg-[oklch(0.95_0_0)] font-medium"
                      : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  <span>Talents</span>
                </Link>
              </li>

              {/* New items for Users Management */}
              <li>
                <Link
                  to="/dashboard/users"
                  className={`flex items-center px-4 py-2 text-[oklch(0.3_0_0)] rounded-lg hover:bg-[oklch(0.95_0_0)] ${
                    isActive("/users") ? "bg-[oklch(0.95_0_0)] font-medium" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  <span>Utilisateurs</span>
                </Link>
              </li>

              {/* New items for Spaces Management */}
              <li>
                <Link
                  to="/dashboard/espaces"
                  className={`flex items-center px-4 py-2 text-[oklch(0.3_0_0)] rounded-lg hover:bg-[oklch(0.95_0_0)] ${
                    isActive("/espaces")
                      ? "bg-[oklch(0.95_0_0)] font-medium"
                      : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  <span>Espaces</span>
                </Link>
              </li>

              {/* New items for Comments Management */}
              <li>
                <Link
                  to="/dashboard/commentaires"
                  className={`flex items-center px-4 py-2 text-[oklch(0.3_0_0)] rounded-lg hover:bg-[oklch(0.95_0_0)] ${
                    isActive("/commentaires")
                      ? "bg-[oklch(0.95_0_0)] font-medium"
                      : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  <span>Commentaires</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard/reports"
                  className={`flex items-center px-4 py-2 text-[oklch(0.3_0_0)] rounded-lg hover:bg-[oklch(0.95_0_0)] ${
                    isActive("/reports")
                      ? "bg-[oklch(0.95_0_0)] font-medium"
                      : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  <span>Rapports</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard/event-proposals"
                  className={`flex items-center px-4 py-2 text-[oklch(0.3_0_0)] rounded-lg hover:bg-[oklch(0.95_0_0)] ${
                    isActive("/event-proposals")
                      ? "bg-[oklch(0.95_0_0)] font-medium"
                      : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  <span>Propositions d'événements</span>
                </Link>
              </li>

              {userRole === "superadmin" && (
                <li>
                  <Link
                    to="/dashboard/config"
                    className={`flex items-center px-4 py-2 text-[oklch(0.3_0_0)] rounded-lg hover:bg-[oklch(0.95_0_0)] ${
                      isActive("/config")
                        ? "bg-[oklch(0.95_0_0)] font-medium"
                        : ""
                    }`}
                    onClick={closeSidebar}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Configuration</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-[oklch(0.922_0_0)]">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-[oklch(47.3%_0.137_46.201)] flex items-center justify-center text-white font-medium">
                {Cookies.get("userName")?.charAt(0) || "U"}
              </div>
              <div className="flex flex-col flex-1 space-y-1">
                <p className="text-sm font-medium text-[oklch(0.3_0_0)] break-all">
                  {Cookies.get("userEmail") || "Utilisateur"}
                </p>
                <p className="text-xs text-[oklch(0.556_0_0)]">
                  {userRole || "Rôle non défini"}
                </p>
                <button
                  className="mt-2 w-full flex items-center justify-start px-3 py-1 bg-gray-200 text-[oklch(0.3_0_0)] rounded hover:bg-gray-300 transition-colors text-xs font-medium"
                  onClick={() => {
                    Cookies.remove("jwt");
                    Cookies.remove("userRole");
                    Cookies.remove("userName");
                    Cookies.remove("userEmail");
                    Cookies.remove("userId");
                    window.location.href = "/";  // Redirection vers la page d'accueil
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
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
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
