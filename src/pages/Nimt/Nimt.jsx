import React, { useState, useEffect } from "react";
import NimtTable from "../../components/Nimt/NimtTable";
import axios from "../../axios";

const Nimt = () => {
  const [nimtData, setNimtData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const getNimt = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/nemtRequests");
      setNimtData(data?.data || []); // Ensure we set an empty array if no data
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNimt();
  }, [update]);

  return (
    <div className="overflow-auto h-screen w-full bg-[#f8f8f8]">
      {" "}
      {/* Make the container scrollable */}
      <NimtTable data={nimtData} loading={loading} setUpdate={setUpdate} />
    </div>
  );
};

export default Nimt;
