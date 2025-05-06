import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onCollapse={setIsCollapsed} />
      
      {/* Main content */}
      <main 
        className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
          isSidebarOpen 
            ? (isCollapsed ? "ml-16" : "ml-64") 
            : "ml-0"
        }`}
      >
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
        
        <div className="p-6 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
