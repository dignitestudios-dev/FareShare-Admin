import React, { useState, useEffect } from "react";
import UsersTable from "../../components/app/users/UsersTable";
import axios from "../../axios";
import { ErrorToast } from "../../components/app/global/Toast";

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const limit = 10;

  const getUsers = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/admin/allUsers?page=${currentPage}&limit=${limit}`
      );

      setUserData(data?.data);
      setTotalUsers(data?.totalUsers);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [currentPage]);

  return (
    <UsersTable
      data={userData}
      loading={loading}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalUsers={totalUsers}
      itemsPerPage={limit}
    />
  );
};

export default Users;