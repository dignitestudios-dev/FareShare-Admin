import React from "react";
import { FiEye } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const UsersTable = ({ data, loading }) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter users based on the search query
  const filteredUsers = data.filter((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>; // Show a loading message or spinner
  }

  return (
    <div className="w-full h-screen overflow-auto bg-[#F5F7F7] p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[24px] font-bold text-black">
          Users{" "}
          <span className="text-[16px] text-gray-500">({data?.length})</span>
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="border rounded-full pl-4 pr-10 py-3 text-sm text-gray-700 focus:outline-none w-[400px]"
          />
          <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <table className="min-w-full bg-white border-separate rounded-[18px]">
        <thead>
          <tr className="text-left text-[14px] text-gray-500">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">City</th>
            <th className="py-2 px-4">State</th>
            <th className="py-2 px-4">Registration Date</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <React.Fragment key={user?._id}>
              <tr className="bg-white text-[14px] text-gray-900 hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={user?.profilePicture || `https://i.pravatar.cc/40?img=${user?._id}`}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{`${user?.firstName} ${user?.lastName}`}</span>
                </td>
                <td className="py-3 px-4">{user?.email}</td>
                <td className="py-3 px-4">{user?.city}</td>
                <td className="py-3 px-4">{user?.state}</td>
                <td className="py-3 px-4">{new Date(user?.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <Link
                    to={`/user-details/${user?._id}`} // Assuming you want to pass user ID
                    className="text-white bg-red-500 py-1 px-3 rounded-md inline-flex items-center"
                  >
                    <FiEye className="mr-2 mb-1" />
                    View
                  </Link>
                </td>
              </tr>
              <tr>
                <td colSpan="6" className="border-b border-gray-200"></td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
