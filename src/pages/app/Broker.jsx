import React, { useState, useEffect } from "react";
import BrokerTable from "../../components/app/broker/BrokerTable";
import axios from "../../axios";
import { ErrorToast } from "../../components/app/global/Toast";

const Broker = () => {
  const [brokerData, setBrokerData] = useState([]); // Updated variable name to camelCase
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const getBrokers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/broker");
      console.log("🚀 ~ getBrokers ~ data:", data);
      setBrokerData(data?.data); // Store the actual data from the response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrokers();
  }, [update]);

  return (
    <div className="h-auto w-full ">
      {" "}
      {/* Make the container scrollable */}
      <BrokerTable data={brokerData} loading={loading} setUpdate={setUpdate} />
    </div>
  );
};

export default Broker;
