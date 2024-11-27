import React, { useState, useEffect } from "react";
import VehicleApprovalTable from "../../components/app/vehicle_approval/VehicleApprovalTable";
import axios from "../../axios";
import { ErrorToast } from "../../components/app/global/Toast";

const VehicleApproval = () => {
  const [VehicleData, setVehicleData] = useState([]); // Updated variable name to camelCase
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const getVehicles = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/vehicle/pending");
      console.log("🚀 ~ getVehicles ~ data:", data);
      setVehicleData(data?.data); // Store the actual data from the response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);

      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVehicles();
  }, [update]);

  return (
    <div className="h-auto w-full ">
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
