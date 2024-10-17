import React, { useState, useEffect } from "react";
import VehicleApprovalTable from "../../components/VehicleApproval/VehicleApprovalTable";
import axios from "../../axios";

const VehicleApproval = () => {
  const [VehicleData, setVehicleData] = useState([]); // Updated variable name to camelCase
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const getVehicles = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/vehicle/all");
      console.log("🚀 ~ getVehicles ~ data:", data);
      setVehicleData(data?.data); // Store the actual data from the response
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVehicles();
  }, [update]);

  return (
    <div className="overflow-auto h-screen w-full bg-[#f8f8f8]">
      {" "}
      {/* Make the container scrollable */}
      <VehicleApprovalTable
        data={VehicleData}
        loading={loading}
        setUpdate={setUpdate}
      />
    </div>
  );
};

export default VehicleApproval;
