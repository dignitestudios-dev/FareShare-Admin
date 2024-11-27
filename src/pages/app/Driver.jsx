import React, { useEffect, useState } from "react";
import DriverTable from "../../components/app/driver/DriverTable";
import axios from "../../axios";
import { ErrorToast } from "../../components/app/global/Toast";

const Driver = () => {
  const [driverData, setDriverData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const getDrivers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/driver");
      setDriverData(data?.data); // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);

      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDrivers();
  }, [update]);

  return (
    <div className="h-auto w-full ">
      {" "}
      {/* Make the container scrollable */}
      <DriverTable data={driverData} loading={loading} setUpdate={setUpdate} />
    </div>
  );
};

export default Driver;
