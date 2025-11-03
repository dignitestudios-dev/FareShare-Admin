import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axios";
import { MdDelete, MdEdit, MdKeyboardBackspace } from "react-icons/md";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import { SkeletonLoader } from "../../components/app/global/SkeletonLoader";
import UpdateTrainingbulletin from "../../components/app/trainingbulletin/UpdateTrainingbulletin";
import DeleteConfirmModal from "../../components/app/trainingbulletin/DeleteConfirmModal";

const TrainingBulletinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);
  const [update, setUpdate] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getBlogDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/admin/trainingBlog/${id}`);
      if (response.status === 200 && response.data?.data) {
        setBlog(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      ErrorToast("Failed to load blog details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {

    try {
      setDeleting(true);
      const response = await axios.post(`/admin/trainingBlog/delete/${id}`);
      if (response.status === 200) {
        SuccessToast("Blog deleted successfully");
        navigate("/training-bulletin");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      ErrorToast("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    getBlogDetail();
  }, [id, update]);

  if (loading) return <SkeletonLoader />;

  if (!blog)
    return (
      <div className="text-center text-gray-500 py-10 text-lg">
        Blog not found or deleted.
      </div>
    );

  return (
    <div className="w-full overss bg-white rounded-2xl shadow-lg overflow-scroll border border-gray-100">
      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
      {updateShow ? (
        <UpdateTrainingbulletin
          blog={blog}
          handleback={() => setUpdateShow(false)}
          setUpdate={setUpdate}
        />
      ) : (
        <>
          <div className="flex items-center justify-between px-6 py-4 bg-[#c00000] text-white">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <MdKeyboardBackspace size={22} />
              <span className="font-medium">Back</span>
            </div>
          </div>

          <div className="p-6">
            <div className="w-full h-52 bg-gray-100 rounded-xl overflow-hidden mb-6">
              {blog.imageUrl ? (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No Image Available
                </div>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#c00000] mb-3">
              {blog.title}
            </h1>

            <p className="text-sm text-gray-500 mb-5">
              Published on{" "}
              <span className="font-medium">
                {new Date(blog.createdAt).toLocaleString()}
              </span>
            </p>

            <p className="text-gray-800 text-[15px] leading-relaxed mb-6 whitespace-pre-line">
              {blog.description}
            </p>

            {blog?.bannerLink && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  External Link:
                </p>
                <a
                  href={blog.bannerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c00000] font-semibold hover:underline break-all"
                >
                  {blog.bannerLink}
                </a>
              </div>
            )}

            <div className="flex justify-end mt-8 gap-3 flex-wrap">
              <button
                onClick={() => setUpdateShow(true)}
                className="flex items-center gap-2 bg-[#c00000] text-white px-5 py-2.5 rounded-full font-medium shadow-sm hover:bg-[#a00000] transition-all"
              >
                <MdEdit size={18} /> Update
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-full font-medium shadow-sm hover:bg-red-600 transition-all"
              >
                <MdDelete size={18} /> Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrainingBulletinDetail;
