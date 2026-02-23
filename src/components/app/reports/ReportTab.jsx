const reportTabs = [
  "Drivers",
  "Rides",
  "Earnings",
  "Compliance",
  "System",
];

export default function ReportTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2 bg-gray-100 p-2 rounded-full w-fit">
      {reportTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 text-[12px] rounded-full font-medium
            ${
              activeTab === tab
                ? "bg-[#c00000] text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
