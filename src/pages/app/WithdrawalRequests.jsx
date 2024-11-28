import React, { useState, useEffect } from "react";
import UsersTable from "../../components/app/users/UsersTable";
import axios from "../../axios";
import { ErrorToast } from "../../components/app/global/Toast";
import WithdrawRequestTable from "../../components/app/withdrawal_requests/WithdrawRequestTable";

const WithdrawalRequests = () => {
  const [UserData, setUserData] = useState([]);
  const [update, setUpdate] = useState(false);

  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/withdraw");
      console.log("🚀 ~ getUsers ~ data:", data);
      setUserData(data?.data); // Use setUserData to set the user data
    } catch (error) {
      ErrorToast(error?.response?.data?.message);

      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [update]);

  return (
    <WithdrawRequestTable
      data={UserData}
      loading={loading}
      setUpdate={setUpdate}
    />
  );
};

export default WithdrawalRequests;
