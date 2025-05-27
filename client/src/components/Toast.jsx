"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    // Trigger entrance animation immediately
    setVisible(true);

    // Add a small bounce effect after appearing
    const bounceTimer = setTimeout(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 300);
    }, 100);

    // Set timer for auto-close
    const closeTimer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(bounceTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      if (typeof onClose === "function") {
        onClose();
      }
    }, 300);
  };

  // Pulse animation when hovering over the toast
  const handleMouseEnter = () => {
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
  };

  const toastStyles = {
    success: {
      bg: "bg-emerald-500",
      border: "border-emerald-400",
      icon: CheckCircle
    },
    error: {
      bg: "bg-rose-500", 
      border: "border-rose-400",
      icon: XCircle
    },
    warning: {
      bg: "bg-amber-500",
      border: "border-amber-400", 
      icon: AlertTriangle
    },
    info: {
      bg: "bg-sky-500",
      border: "border-sky-400",
      icon: Info
    },
  };

  const currentStyle = toastStyles[type];
  const IconComponent = currentStyle.icon;
  const iconAnimation = bounce ? "animate-pulse" : "";

  if (!visible && !exiting) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] ${currentStyle.bg} border ${currentStyle.border} text-white px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm flex items-center transition-all duration-300 ease-in-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-20px]"
      } ${exiting ? "opacity-0 translate-y-[-20px]" : ""} ${
        bounce ? "scale-105" : "scale-100"
      } hover:shadow-xl hover:shadow-black/10`}
      onMouseEnter={handleMouseEnter}
    >
      {/* Icon based on type with animation */}
      <span className={`mr-3 transition-transform ${iconAnimation}`}>
        <IconComponent className="h-5 w-5" />
      </span>

      {/* Message with fade-in effect */}
      <span
        className={`font-medium transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {message}
      </span>

      {/* Progress bar at the bottom */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full rounded-b-xl overflow-hidden">
        <div
          className="h-full bg-white/40 rounded-bl-xl"
          style={{
            width: "100%",
            animation: visible ? "progress 5s linear forwards" : "none",
          }}
        />
      </div>

      {/* Close button with hover effect */}
      <button
        onClick={handleClose}
        className="ml-4 text-white/80 hover:text-white focus:outline-none transition-all duration-200 hover:rotate-90 hover:bg-white/10 rounded-lg p-1"
      >
        <X className="h-4 w-4" />
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