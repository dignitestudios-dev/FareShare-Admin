const timeTabs = ["Daily", "Weekly", "Monthly", "Yearly"];

export function TimeTabs({ activeTime, setActiveTime }) {
  return (
    <div className="flex gap-2 mt-4">
      {timeTabs.map((t) => (
        <button
          key={t}
          onClick={() => setActiveTime(t)}
          className={`px-3 py-1 text-[11px] rounded-full border
            ${activeTime === t
              ? "bg-[#c00000] text-white border-[#c00000]"
              : "bg-white text-gray-500"
            }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
