import React, { useState, useEffect } from "react";
import UsersTable from "../../components/Users/UsersTable";
import axios from "../../axios";

const Users = () => {
  const [UserData, setUserData] = useState([]);

  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/allUsers");
      console.log("🚀 ~ getUsers ~ data:", data);
      setUserData(data?.data); // Use setUserData to set the user data
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return <UsersTable data={UserData} loading={loading} />;
};

export default Users;
