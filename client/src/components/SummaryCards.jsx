export default function SummaryCards({ stats }) {
  // Icons for different card types
  const getIcon = (label) => {
    const lowerLabel = label.toLowerCase()

    if (lowerLabel.includes("réservation") || lowerLabel.includes("reservation")) {
      return (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      )
    } else if (lowerLabel.includes("événement") || lowerLabel.includes("evenement") || lowerLabel.includes("event")) {
      return (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )
    } else if (lowerLabel.includes("talent")) {
      return (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )
    } else if (lowerLabel.includes("accept")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )
    } else if (lowerLabel.includes("rapport") || lowerLabel.includes("report")) {
      return (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      )
    }

    // Default icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  }

  // Colors for the cards
  const colors = [
    {
      bg: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
      border: "border-blue-300/20",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
    },
    {
      bg: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
      border: "border-purple-300/20",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      bg: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
      border: "border-amber-300/20",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    },
    {
      bg: "bg-gradient-to-br from-emerald-500/10 to-green-500/10",
      border: "border-emerald-300/20",
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-500",
    },
    {
      bg: "bg-gradient-to-br from-orange-600/10 to-teal-500/10",
      border: "border-orange-400/20",
      iconBg: "bg-gradient-to-br from-orange-600 to-teal-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`rounded-xl shadow-md p-6 border ${colors[idx % colors.length].bg} ${colors[idx % colors.length].border} bg-white flex items-center gap-4`}
        >
          <div className={`p-3 rounded-xl ${colors[idx % colors.length].iconBg} text-white shadow-lg`}>
            {getIcon(stat.label)}
          </div>
          <div>
            <div className="text-3xl font-bold text-[oklch(0.145_0_0)]">{stat.value}</div>
            <div className="text-sm mt-1 text-[oklch(0.556_0_0)]">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
