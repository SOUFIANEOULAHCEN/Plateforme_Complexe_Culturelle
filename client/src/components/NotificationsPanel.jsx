import React, { useState, useEffect } from "react";
import api from "../api";

const NotificationsPanel = ({ onClose, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchNotifications();
    // Mettre à jour le compteur au chargement
    updateUnreadCount();
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
      // Mettre à jour le compteur après avoir marqué comme lu
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
      // Mettre à jour le compteur après avoir tout marqué comme lu
      updateUnreadCount();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Navigation basée sur le type et les métadonnées
    if (notification.type === "event_proposal" && notification.reference_id) {
      const metadata = notification.metadata ? JSON.parse(notification.metadata) : {};
      // Fermer le panneau avant la redirection
      onClose();
      // Rediriger vers la page des propositions d'événements
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

      <div className="relative bg-white rounded-2xl shadow-2xl w-[60vw] max-w-4xl max-h-[80vh] flex flex-col transform transition-all overflow-hidden border-2 border-[#8B4513]">
        <div className="flex items-center justify-between p-6 border-b border-[#8B4513] bg-[#8B4513]">
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#d2b48c] transition-colors"
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

        <div className="flex border-b border-[#8B4513] bg-[#f7f3ef]">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 text-center ${
              activeTab === "all"
                ? "border-b-4 border-[#8B4513] text-[#8B4513] font-semibold bg-[#fbeee0]"
                : "text-gray-500"
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`flex-1 py-3 text-center ${
              activeTab === "unread"
                ? "border-b-4 border-[#8B4513] text-[#8B4513] font-semibold bg-[#fbeee0]"
                : "text-gray-500"
            }`}
          >
            Non lues
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 py-3 text-center ${
              activeTab === "events"
                ? "border-b-4 border-[#8B4513] text-[#8B4513] font-semibold bg-[#fbeee0]"
                : "text-gray-500"
            }`}
          >
            Événements
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f7f3ef] p-4">
          {loading ? (
            <div className="text-center text-[#8B4513]">Chargement...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-400">Aucune notification</div>
          ) : (
            <ul className="space-y-3">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex items-start gap-3 p-4 rounded-xl shadow-sm cursor-pointer transition ${notification.is_read ? "bg-white" : "bg-[#fbeee0] border-l-4 border-[#8B4513]"} hover:bg-[#fbeee0]`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium text-[#8B4513]">{notification.message}</div>
                    <div className="text-xs text-gray-500 mt-1 flex gap-2 items-center">
                      <span>{notification.type === "contact_message" ? "Message de contact" : notification.type === "event_proposal" ? "Proposition d'événement" : notification.type}</span>
                      <span>•</span>
                      <span>{new Date(notification.createdAt || notification.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  {!notification.is_read && (
                    <span className="ml-2 w-2 h-2 rounded-full bg-[#8B4513] inline-block mt-2" title="Non lu"></span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-[#8B4513] bg-[#f7f3ef] flex justify-end">
          <button
            onClick={markAllAsRead}
            className="bg-[#8B4513] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#6e3d20] transition"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
