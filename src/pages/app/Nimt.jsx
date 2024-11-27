import React, { useState, useEffect } from "react";
import NimtTable from "../../components/app/nimt/NimtTable";
import axios from "../../axios";
import { ErrorToast } from "../../components/app/global/Toast";

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
      ErrorToast(error?.response?.data?.message);

      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNimt();
  }, [update]);

  return (
    <div className="h-auto w-full ">
      {" "}
      {/* Make the container scrollable */}
      <NimtTable data={nimtData} loading={loading} setUpdate={setUpdate} />
    </div>
  );
};

export default Nimt;
