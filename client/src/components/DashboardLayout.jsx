import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import NotificationsPanel from "../components/NotificationsPanel"
import api from "../api"

const POLLING_INTERVAL = 10000; // 10 secondes

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Fonction pour mettre à jour le nombre de notifications non lues
  const handleUnreadCount = (count) => setUnreadCount(count)

  // Fonction pour récupérer le nombre de notifications non lues
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/notification/unread-count");
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();

    // Set up polling
    const pollingInterval = setInterval(fetchUnreadCount, POLLING_INTERVAL);

    // Clean up interval on unmount
    return () => clearInterval(pollingInterval);
  }, []);

  useEffect(() => {
    // Check if sidebar collapse state is saved in localStorage
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState) {
      setIsCollapsed(savedState === "true")
    }

    // Add event listener for window resize
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Initial check
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Listen for changes to localStorage
  useEffect(() => {
    // Add event listener to listen for sidebar collapse state changes
    const handleStorageChange = () => {
      const savedState = localStorage.getItem("sidebarCollapsed")
      if (savedState !== null) {
        setIsCollapsed(savedState === "true")
      }
    }

    // Initial check
    handleStorageChange()

    // Set up event listener for storage changes
    window.addEventListener("storage", handleStorageChange)
    
    // Also check for direct changes to localStorage from the same window
    const originalSetItem = localStorage.setItem
    localStorage.setItem = function(key, value) {
      const event = new Event('itemInserted')
      event.key = key
      event.value = value
      document.dispatchEvent(event)
      originalSetItem.apply(this, arguments)
    }
    
    const localStorageListener = (e) => {
      if (e.key === "sidebarCollapsed") {
        setIsCollapsed(e.value === "true")
      }
    }
    
    document.addEventListener("itemInserted", localStorageListener)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      document.removeEventListener("itemInserted", localStorageListener)
      localStorage.setItem = originalSetItem
    }
  }, [])

  // Calculer la marge à gauche du bouton selon l'état de la sidebar
  const notifBtnMargin = isSidebarOpen ? (isCollapsed ? 'ml-16' : 'ml-64') : 'ml-0';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onCollapse={setIsCollapsed} />
      {/* Bouton notifications en haut à droite avec badge */}
      <button
        className={`fixed top-4 right-8 z-50 bg-[#8B4513] text-white p-3 rounded-full shadow-lg hover:bg-[#6e3d20] transition ${notifBtnMargin}`}
        onClick={() => setShowNotifications(true)}
        title="Voir les notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>
      {showNotifications && (
        <NotificationsPanel 
          onClose={() => setShowNotifications(false)} 
          onUnreadCountChange={handleUnreadCount}
        />
      )}
      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 ${isSidebarOpen ? (isCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'} transition-all duration-300`}>
        {/* Toggle sidebar button for mobile */}
        <button
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-[oklch(47.3%_0.137_46.201)] text-white md:hidden shadow-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle sidebar"
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
        <div className="p-6 pl-4 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  )
}
