import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { MdKeyboardBackspace } from "react-icons/md";
import { useFormik } from "formik";
import trainingBulletinSchema from "../../../schema/trainingBulletinSchema";
import { trainingBulletinInitialValues } from "../../../data/initData";
import axios from "../../../axios";
import { ErrorToast, SuccessToast } from "../global/Toast";
const CreateTrainingbulletin = ({ handleback, setCreateTrainingbulletin }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: trainingBulletinInitialValues,
    validationSchema: trainingBulletinSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("bannerLink", values.bannerLink);
        // formData.append("image", values.bannerImage);
        // formData.append("image", null);

        const response = await axios.post(
          "/admin/createTrainingBlog",
          formData
        );

        if (response.status === 201) {
          SuccessToast(response?.data?.message);
          resetForm();
          setCreateTrainingbulletin(false);
          setImagePreview(null);
        }
      } catch (error) {
        console.error("Error creating training bulletin:", error);
        ErrorToast(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      formik.setFieldValue("bannerImage", file);
    }
  };

  return (
    <div className="w-full bg-white rounded-[18px] p-6 mx-auto">
      <div className="flex gap-2 items-center mb-6">
        <div className="cursor-pointer" onClick={handleback}>
          <MdKeyboardBackspace size={20} />
        </div>
        <h2 className="text-[24px] font-bold text-[#c00000]">
          Create Training & Bulletin
        </h2>
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <label className="font-medium text-[15px] text-[#333]">
            Upload Banner Image
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="imageUpload"
              className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer ${
                formik.errors.bannerImage && formik.touched.bannerImage
                  ? "border-red-500"
                  : "border-[#c00000]"
              } bg-[#f9f9f9] hover:bg-[#f1f1f1] transition-all`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#c00000]">
                  <FiUpload size={28} />
                  <p className="text-sm mt-2 text-gray-600">
                    Click to upload or drag and drop
                  </p>
                </div>
              )}
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          {/* {formik.touched.bannerImage && formik.errors.bannerImage && (
            <p className="text-red-500 text-sm">{formik.errors.bannerImage}</p>
          )} */}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-[15px] text-[#333]">Title</label>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter training or bulletin title"
            className={`w-full p-3 rounded-xl bg-[#f8f8f8] text-[#333] outline-none border ${
              formik.errors.title && formik.touched.title
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-[#c00000]"
            } placeholder-gray-400 focus:ring-2`}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-sm">{formik.errors.title}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-[15px] text-[#333]">
            Description
          </label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Write short description..."
            rows={5}
            className={`w-full p-3 rounded-xl bg-[#f8f8f8] text-[#333] outline-none border resize-none ${
              formik.errors.description && formik.touched.description
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-[#c00000]"
            } placeholder-gray-400 focus:ring-2`}
          ></textarea>
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-[15px] text-[#333]">
            Banner Link
          </label>
          <input
            type="url"
            name="bannerLink"
            value={formik.values.bannerLink}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="https://example.com"
            className={`w-full p-3 rounded-xl bg-[#f8f8f8] text-[#333] outline-none border ${
              formik.errors.bannerLink && formik.touched.bannerLink
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-[#c00000]"
            } placeholder-gray-400 focus:ring-2`}
          />
          {formik.touched.bannerLink && formik.errors.bannerLink && (
            <p className="text-red-500 text-sm">{formik.errors.bannerLink}</p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-full text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#c00000] hover:bg-[#a00000]"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrainingbulletin;
