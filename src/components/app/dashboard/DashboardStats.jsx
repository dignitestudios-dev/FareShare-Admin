import React from "react";
import { FaRegUser, FaUserClock } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { PiUsersThreeBold } from "react-icons/pi";
import { FaCar } from "react-icons/fa6";
import { MdCommute, MdBlock } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const DashboardStats = ({ stats, loading }) => {
  const navigate = useNavigate();

  const statCards = [
    {
      title: "Total Users",
      value: stats?.userCount ?? 0,
      icon: <FaRegUser />,
      iconBg: "bg-[#E9FAFF]",
      iconColor: "text-[#35CFFF]",
      route: "/users",
      routeTitle: "Users",
    },
    {
      title: "Total Drivers",
      value: stats?.driverCount ?? 0,
      icon: <FiUser />,
      iconBg: "bg-[#E9FAFF]",
      iconColor: "text-[#1FBA46]",
      route: "/drivers",
      routeTitle: "Drivers",
    },
    {
      title: "Total Brokers",
      value: stats?.brokerCount ?? 0,
      icon: <PiUsersThreeBold />,
      iconBg: "bg-[#FFF5E1]",
      iconColor: "text-[#FFBB39]",
      route: "/brokers",
      routeTitle: "Brokers",
    },
    {
      title: "NEMT Requests",
      value: stats?.nemtCount ?? 0,
      icon: <PiUsersThreeBold />,
      iconBg: "bg-[#C0000033]",
      iconColor: "text-[#C00000]",
      route: "/nemt",
      routeTitle: "NEMT Approval",
    },
    {
      title: "Vehicle Requests",
      value: stats?.vehicleCount ?? 0,
      icon: <FaCar />,
      iconBg: "bg-[#0074B633]",
      iconColor: "text-[#0041A4]",
      route: "/vehicle-approval",
      routeTitle: "Vehicle Approval",
    },
    {
      title: "Active Rides",
      value: stats?.activeRidesCount ?? 0,
      icon: <MdCommute />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      route: "/rides",
      state: { inProgressSelected: "InProgress" },
      routeTitle: "Rides Inprogress",
    },
    {
      title: "Blocked Users",
      value: stats?.blockedUsersCount ?? stats?.blockedUserCount ?? 0,
      icon: <MdBlock />,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      route: "/users",
      state: { tab: "blocked" },
      routeTitle: "Users",
    },
    {
      title: "Blocked Drivers",
      value: stats?.blockedDriversCount ?? stats?.blockedDriverCount ?? 0,
      icon: <MdBlock />,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      route: "/drivers",
      routeTitle: "Drivers",
    },
    {
      title: "Inactive Drivers",
      value:
        stats?.inactiveDriversCount ??
        stats?.inactiveDriverCount ??
        stats?.blockedOrInactiveDriversCount ??
        0,
      icon: <FaUserClock />,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      route: "/drivers",
      routeTitle: "Drivers",
    },
  ];

  if (loading) {
    return (
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            className="w-full h-[88px] rounded-[24px] bg-gray-50 border animate-pulse p-[12px] flex gap-3 items-center justify-start"
          >
            <span className="w-[64px] h-[64px] min-w-[64px] rounded-[18px] bg-gray-200 flex items-center justify-center"></span>
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <span className="w-12 h-5 bg-gray-200 rounded"></span>
              <span className="w-20 h-4 bg-gray-200 rounded"></span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
      {statCards.map((card, index) => (
        <button
          key={index}
          onClick={() => {
            if (card.routeTitle) {
              localStorage.setItem("title", card.routeTitle);
            }
            if (card.state) {
              navigate(card.route, { state: card.state });
            } else {
              navigate(card.route);
            }
          }}
          className="w-full h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-3 items-center justify-start hover:shadow-md hover:border-gray-300 transition cursor-pointer text-left group"
        >
          <span
            className={`w-[64px] h-[64px] min-w-[64px] rounded-[18px] ${card.iconBg} ${card.iconColor} text-2xl lg:text-3xl flex items-center justify-center transition-transform group-hover:scale-105`}
          >
            {card.icon}
          </span>
          <div className="w-auto flex flex-col justify-start items-start min-w-0">
            <span className="text-[18px] font-bold text-black truncate w-full">
              {card.value}
            </span>
            <span className="text-black text-[13px] sm:text-[14px] font-normal truncate w-full">
              {card.title}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default DashboardStats;
