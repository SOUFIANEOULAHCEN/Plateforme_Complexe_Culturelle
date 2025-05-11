"use client";

import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setVisible(true), 10);

    // Add a small bounce effect after appearing
    setTimeout(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 300);
    }, 400);

    // Set timer for auto-close
    const timer = setTimeout(() => {
      handleClose();
    }, 5000); // Extended time to 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      if (typeof onClose === "function") {
        onClose();
      }
    }, 300); // Extended for smoother exit animation
  };

  // Pulse animation when hovering over the toast
  const handleMouseEnter = () => {
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
  };

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
  }[type];

  const iconAnimation = bounce ? "animate-pulse" : "";

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center transition-all duration-500 ease-in-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-20px]"
      } ${exiting ? "opacity-0 translate-y-[-20px] rotate-1" : ""} ${
        bounce ? "scale-105" : "scale-100"
      } hover:shadow-xl`}
      onMouseEnter={handleMouseEnter}
    >
      {/* Icon based on type with animation */}
      <span className={`mr-2 transition-transform ${iconAnimation}`}>
        {type === "success" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {type === "error" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {type === "warning" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {type === "info" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>

      {/* Message with fade-in effect */}
      <span
        className={`transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {message}
      </span>

      {/* Progress bar at the bottom */}
      <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 w-full rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-white bg-opacity-60 rounded-bl-lg"
          style={{
            width: "100%",
            animation: visible ? "progress 5s linear forwards" : "none",
          }}
        />
      </div>

      {/* Close button with hover effect */}
      <button
        onClick={handleClose}
        className="ml-auto text-white hover:text-gray-200 focus:outline-none transition-transform duration-200 hover:rotate-90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <style>{`
  @keyframes progress {
    0% { width: 100%; }
    100% { width: 0%; }
  }
`}</style>
    </div>
  );
}
