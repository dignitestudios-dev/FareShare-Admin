import React, { useEffect, useState } from "react";
import { FiExternalLink, FiEye } from "react-icons/fi";
import { MdCheck, MdClose, MdOutlineCalendarMonth } from "react-icons/md";
import axios from "../../../axios";
import { Link } from "react-router-dom";
const TrainingBulletinTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [loadingblogs, setLoadingBlogs] = useState(false);
  const trainingBulletins = [
    {
      id: 1,
      name: "Leadership Workshop",
      make: "Corporate",
      model: "2025",
      plateNumber: "TRN-001",
      wheelchairAccessible: "Yes",
    },
    {
      id: 2,
      name: "First Aid Training",
      make: "Health Dept.",
      model: "2024",
      plateNumber: "TRN-002",
      wheelchairAccessible: "No",
    },
    {
      id: 3,
      name: "Cyber Security Seminar",
      make: "Tech Team",
      model: "2025",
      plateNumber: "TRN-003",
      wheelchairAccessible: "Yes",
    },
  ];
  const getBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const response = await axios.get("/admin/trainingBlogs");
      if (response.status === 200) {
        setBlogs(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching training bulletins:", error);
    } finally {
      setLoadingBlogs(false);
    }
  };
  useEffect(() => {
    getBlogs();
  }, []);
  return (
    <div className="w-full bg-gray-50 border px-5 py-4 rounded-[18px]">
      <div className="">
        {loadingblogs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md p-4 flex flex-col"
              >
                <div className="w-full h-40 bg-gray-200 rounded-xl mb-3" />
                <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded-md w-full mb-1" />
                <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-3" />
                <div className="flex items-center justify-between mt-auto">
                  <div className="h-3 w-20 bg-gray-200 rounded-md" />
                  <div className="h-3 w-16 bg-gray-200 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No training bulletins found.
          </div>
        ) : (
          <div className="grid cursor-pointer grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs?.map((blog) => (
              <div
                key={blog._id}
                className="bg-white shadow-md rounded-2xl p-4 flex flex-col hover:shadow-lg transition-all"
              >
                <div className="w-full h-40 bg-gray-100 rounded-xl mb-3 overflow-hidden">
                  {blog.imageUrl ? (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-[#c00000] mb-1 line-clamp-1">
                  {blog.title}
                </h3>
                <p className="text-gray-700 text-sm mb-2 line-clamp-3">
                  {blog.description}
                </p>

                <div className="flex items-center justify-between mt-auto text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    <MdOutlineCalendarMonth className="text-[#c00000]" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>

                  <Link
                    to={`/training/${blog._id}`}
                    className="flex items-center text-[#c00000] font-medium hover:underline gap-1"
                  >
                    Visit <FiExternalLink />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingBulletinTable;
