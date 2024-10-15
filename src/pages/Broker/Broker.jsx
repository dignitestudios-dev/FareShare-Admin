import React, { useState, useEffect } from 'react';
import BrokerTable from "../../components/Broker/BrokerTable";
import axios from "../../axios";

const Broker = () => {
  const [brokerData, setBrokerData] = useState([]); // Updated variable name to camelCase
  const [loading, setLoading] = useState(false);

  const getBrokers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/broker");
      console.log("🚀 ~ getBrokers ~ data:", data);
      setBrokerData(data?.data); // Store the actual data from the response
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrokers();
  }, []);

  return (
    <div className="overflow-auto h-screen w-full bg-[#f8f8f8]"> {/* Make the container scrollable */}

    <BrokerTable data={brokerData} loading={loading} />
    </div>

  );
}

export default Broker;
