import React, { useEffect, useState } from "react";
import DriverTable from "../../components/Driver/DriverTable";
import axios from "../../axios";

const Driver = () => {
  const [driverData, setDriverData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDrivers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/driver");
      setDriverData(data?.data); // Use the data from the API response
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDrivers();
  }, []);

  return (
    <div className="overflow-auto h-screen w-full bg-[#f8f8f8]">
      {" "}
      {/* Make the container scrollable */}
      <DriverTable data={driverData} loading={loading} />
    </div>
  );
};

export default Driver;
