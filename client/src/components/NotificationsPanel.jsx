import React, { useState, useEffect } from "react";
import api from "../api";

const NotificationsPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

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
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigation basée sur le type et les métadonnées
    if (notification.type === "event_proposal" && notification.reference_id) {
      const metadata = notification.metadata ? JSON.parse(notification.metadata) : {};
      window.location.href = `/dashboard/event-proposals/${notification.reference_id}`;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "event_proposal":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-blue-500"
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

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col transform transition-all overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="h-7 w-7"
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

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 text-center ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`flex-1 py-3 text-center ${
              activeTab === "unread"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            Non lues
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 py-3 text-center ${
              activeTab === "events"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            Événements
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : notifications.length > 0 ? (
            <ul className="space-y-3">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-4 rounded-lg transition-colors cursor-pointer ${
                    !notification.is_read
                      ? "bg-blue-50 border border-blue-200 hover:bg-blue-100"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          !notification.is_read
                            ? "font-semibold text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString(
                          "fr-FR",
                          {
                            dateStyle: "short",
                            timeStyle: "short",
                          }
                        )}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <svg
                className="h-12 w-12 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-medium">Aucune nouvelle notification</p>
            </div>
          )}
        </div>

        <div className="border-t p-4 bg-gray-50">
          <button
            onClick={markAllAsRead}
            className="w-full py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
