import React, { useEffect, useState } from "react";
import DashboardStats from "../../components/app/dashboard/DashboardStats";
import DashboardDriverTable from "../../components/app/dashboard/DashboardDriverTable";
import DashboardUsersTable from "../../components/app/dashboard/DashboardUsersTable";
import DashboardRidesTable from "../../components/app/dashboard/DashboardRidesTable";
import axios from "../../axios";
import DashboardRidesGraph from "../../components/app/dashboard/DashboardRidesGraph";
import { ErrorToast } from "../../components/app/global/Toast";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/admin/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message);

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
      <div className="min-h-screen h-auto  w-full  flex flex-col gap-6 justify-start items-start ">
        {/* Top stats section */}
        <div className="w-full flex flex-col lg:flex-row gap-6">
          <DashboardStats stats={stats} loading={loading} />
        </div>

        {/* <div className="w-full grid grid-cols-2 gap-4 justify-start items-start">
          <div className="w-full bg-gray-50 p-6 rounded-[24px] ">
            <DashboardRidesGraph />
          </div>
          <div className="w-full bg-gray-50 p-6 rounded-[24px] ">
            <DashboardRidesGraph />
          </div>
        </div> */}

        {/* Users table */}
        <div className="w-full bg-gray-50 border p-6 rounded-[24px] ">
          <DashboardUsersTable />
        </div>

        {/* Bottom tables (Rides and Driver) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rides Table */}
          <div className="w-full bg-gray-50 border rounded-[24px]  flex">
            <DashboardRidesTable />
          </div>

          {/* Driver Table */}
          <div className="w-full bg-gray-50 border rounded-[24px]  flex">
            <DashboardDriverTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
