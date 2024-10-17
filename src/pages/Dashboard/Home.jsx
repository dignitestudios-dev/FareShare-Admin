import React, { useEffect, useState } from "react";
import DashboardStats from "../../components/Dashboard/DashboardStats";
import DashboardDriverTable from "../../components/Dashboard/DashboardDriverTable";
import DashboardUsersTable from "../../components/Dashboard/DashboardUsersTable";
import DashboardRidesTable from "../../components/Dashboard/DashboardRidesTable";
import axios from "../../axios";

const Home = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/admin/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <div className="h-screen overflow-y-auto w-full p-2 lg:p-6 flex flex-col gap-6 justify-start items-start bg-[#f8f8f8]">
        {/* Top stats section */}
        <div className="w-full flex flex-col lg:flex-row gap-6">
          <DashboardStats stats={stats} loading={loading} />
        </div>

        {/* Users table */}
        <div className="w-full bg-white p-6 rounded-[18px] ">
          <DashboardUsersTable />
        </div>

        {/* Bottom tables (Rides and Driver) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rides Table */}
          <div className="w-full bg-white rounded-[18px]  flex">
            <DashboardRidesTable />
          </div>

          {/* Driver Table */}
          <div className="w-full bg-white rounded-[18px]  flex">
            <DashboardDriverTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
