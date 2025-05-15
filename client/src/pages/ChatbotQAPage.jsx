"use client";

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ChatbotQATable from "../components/ChatbotQATable";

export default function ChatbotQAPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">
              Gestion du Chatbot
            </h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">
              Gérez les questions et réponses du chatbot
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] mb-8 p-6">
          <ChatbotQATable key={refreshKey} />
        </div>
      </div>
    </DashboardLayout>
  );
}
