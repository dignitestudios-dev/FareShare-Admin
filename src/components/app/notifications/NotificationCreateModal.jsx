import { useFormik } from "formik";
import React, { useContext, useRef, useState } from "react";
import axios from "../../../axios";
import Cookies from "js-cookie";
import { notificationCreate } from "../../../schema/notificationCreate";
import { ErrorToast, SuccessToast } from "../global/Toast";
import { notification } from "../../../data/notification";

const NotificationCreateModal = ({ isOpen, setIsOpen, setReload }) => {
  const modalRef = useRef();
  const toggleModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: notification,
      validationSchema: notificationCreate,
      validateOnChange: true,
      validateOnBlur: false,
      //// By disabling validation onChange and onBlur formik will validate on submit.
      onSubmit: async (values, action) => {
        setLoading(true);
        try {
          const response = await axios.post(`/admin/notifications`, {
            title: values?.title,
            message: values?.message,
            target: values?.target,
          });
          if (response?.status === 200) {
            values.title = "";
            values.message = "";
            values.target = "all";
            setReload((prev) => !prev);
            setIsOpen(false);
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          ErrorToast(error?.response?.data?.message || "Something went wrong");
        } finally {
          setLoading(false);
        }
      },
    });
  return (
    <div
      onClick={toggleModal}
      className={`w-screen h-screen   z-50 transition-all duration-200 flex justify-center items-center pr-7  fixed bottom-0  backdrop-blur-sm left-0 ${
        isOpen ? "scale-100" : "scale-0"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        ref={modalRef}
        className="bg-gray-50 w-96 h-auto p-6 flex flex-col gap-2 justify-start items-start rounded-3xl shadow border"
      >
        <div className="w-auto flex flex-col justify-start items-start mb-2">
          <span className="text-xl font-bold text-gray-900">
            Send Notification
          </span>
          <span className="text-sm font-medium text-gray-600">
            Select your target audience and send marketing notifications.
          </span>
        </div>

        <div className="w-full flex flex-col justify-start items-start">
          <label
            htmlFor="title"
            className="block ml-1 text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. New Feature Update"
            className={`mt-1 px-3 h-12 placeholder:text-sm w-full border rounded-md bg-gray-100 focus:border-gray-200 focus:outline-none  focus:ring-offset-2 focus:ring-gray-300 transition-colors duration ${
              errors.title && touched.title ? "border-red-600 shake" : null
            }`}
          />
          {errors.title && touched.title ? (
            <p className="text-red-700 text-sm font-medium">{errors.title}</p>
          ) : null}
        </div>
        <div className="w-full flex flex-col justify-start items-start">
          <label
            htmlFor="message"
            className="block ml-1 text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            type="text"
            id="message"
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Our app is getting a new feature"
            className={`mt-1 p-3 h-32 resize-none bg-gray-100 w-full placeholder:text-sm border rounded-md focus:border-gray-200 focus:outline-none  focus:ring-offset-2 focus:ring-gray-300 transition-colors duration ${
              errors.message && touched.message ? "border-red-600 shake" : null
            }`}
          ></textarea>
          {errors.message && touched.message ? (
            <p className="text-red-700 text-sm font-medium">{errors.message}</p>
          ) : null}
        </div>

        <div className="w-full flex flex-col my-1 justify-start items-start">
          <div className="w-full grid grid-cols-2 gap-2">
            <label className="text-xs flex items-center justify-start ">
              <input
                type="radio"
                name="target"
                id="target"
                className="accent-[#c00000] mr-1"
                value="all"
                checked={values.target === "all"}
                onChange={handleChange}
              />
              All
            </label>
            <label className="text-xs flex items-center justify-start ">
              <input
                type="radio"
                name="target"
                id="target"
                className="accent-[#c00000] mr-1"
                value="driver"
                checked={values.target === "driver"}
                onChange={handleChange}
              />
              Driver
            </label>
            <label className="text-xs flex items-center justify-start ">
              <input
                type="radio"
                name="target"
                id="target"
                className="accent-[#c00000] mr-1"
                value="user"
                checked={values.target === "user"}
                onChange={handleChange}
              />
              User
            </label>
            <label className="text-xs flex items-center justify-start ">
              <input
                type="radio"
                name="target"
                id="target"
                className="accent-[#c00000] mr-1"
                value="broker"
                checked={values.target === "broker"}
                onChange={handleChange}
              />
              Broker
            </label>
          </div>
          {errors.target && touched.target ? (
            <p className="text-red-700 text-sm font-medium">{errors.target}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full h-10 rounded-full flex items-center justify-center text-md font-medium text-white bg"
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default NotificationCreateModal;
