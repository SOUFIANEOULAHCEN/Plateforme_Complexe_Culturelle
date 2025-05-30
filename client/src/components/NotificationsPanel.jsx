import React, { useState, useEffect } from "react";
import api from "../api";

const POLLING_INTERVAL = 10000; // 10 secondes

const NotificationsPanel = ({ onClose, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchNotifications();
    updateUnreadCount();

    const pollingInterval = setInterval(() => {
      fetchNotifications();
      updateUnreadCount();
    }, POLLING_INTERVAL);

    return () => clearInterval(pollingInterval);
  }, [activeTab]);

  const updateUnreadCount = async () => {
    try {
      const response = await api.get("/notification/unread-count");
      if (onUnreadCountChange) {
        onUnreadCountChange(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab === "unread") {
        params.append('unread_only', 'true');
      } else if (activeTab === "events") {
        params.append('type', 'event_proposal');
      }

      const response = await api.get("/notification", { params });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notification/${id}/read`);
      setNotifications(
        notifications.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
      updateUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notification/mark-all-read");
      setNotifications(
        notifications.map((notif) => ({ ...notif, is_read: true }))
      );
      updateUnreadCount();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    if (notification.type === "event_proposal" && notification.reference_id) {
      const metadata = notification.metadata ? JSON.parse(notification.metadata) : {};
      onClose();
      window.location.href = `/dashboard/event-proposals/${notification.reference_id}`;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "event_proposal":
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "contact_message":
        return (
          <svg className="w-5 h-5 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10.5a8.38 8.38 0 01-7.5 8.44A8.38 8.38 0 013 10.5V5.75A2.75 2.75 0 015.75 3h12.5A2.75 2.75 0 0121 5.75z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        );
      case "warning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case "success":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div
        className="fixed inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-1/3 max-h-[90vh] flex flex-col transform transition-all overflow-hidden border border-[#8B4513] mx-4">
        <div className="flex items-center justify-between p-4 bg-[#8B4513]">
          <h2 className="text-xl font-bold text-white">Notifications</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="text-xs text-white hover:text-[#d2b48c] transition-colors px-2 py-1 rounded border border-white"
              title="Tout marquer comme lu"
            >
              Tout lire
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-[#d2b48c] transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex border-b border-[#d2b48c] bg-[#f5f5f5]">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 px-1 text-sm text-center ${
              activeTab === "all"
                ? "text-[#8B4513] font-semibold border-b-2 border-[#8B4513]"
                : "text-gray-600 hover:text-[#8B4513]"
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`flex-1 py-2 px-1 text-sm text-center ${
              activeTab === "unread"
                ? "text-[#8B4513] font-semibold border-b-2 border-[#8B4513]"
                : "text-gray-600 hover:text-[#8B4513]"
            }`}
          >
            Non lues
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 py-2 px-1 text-sm text-center ${
              activeTab === "events"
                ? "text-[#8B4513] font-semibold border-b-2 border-[#8B4513]"
                : "text-gray-600 hover:text-[#8B4513]"
            }`}
          >
            Événements
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-2">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8B4513]"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-2 text-sm">Aucune notification</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#f0e6d2]">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-3 hover:bg-[#f9f5f0] cursor-pointer transition-colors ${
                    notification.is_read ? "bg-white" : "bg-[#fff8ee]"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${
                        notification.is_read ? "text-gray-700" : "text-[#8B4513]"
                      }`}>
                        {notification.message}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                        <span className="capitalize">
                          {notification.type === "contact_message" 
                            ? "Message" 
                            : notification.type === "event_proposal" 
                              ? "Événement" 
                              : notification.type}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(notification.createdAt || notification.created_at).toLocaleString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    {!notification.is_read && (
                      <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-[#8B4513]"></span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-3 border-t border-[#d2b48c] bg-[#f9f9f9] text-center text-xs text-gray-500">
          {notifications.length > 0 && (
            <p>{notifications.length} notification{notifications.length > 1 ? 's' : ''}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;