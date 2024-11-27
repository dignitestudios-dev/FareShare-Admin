import { useFormik } from "formik";
import React, { useContext, useRef, useState } from "react";
import axios from "../../../axios";
import Cookies from "js-cookie";
import {
  insuranceCreate,
  notificationCreate,
} from "../../../schema/notificationCreate";
import { ErrorToast, SuccessToast } from "../global/Toast";
import { insurance, notification } from "../../../data/notification";

const InsuranceCarrierCrate = ({ isOpen, setIsOpen, setReload }) => {
  const modalRef = useRef();
  const toggleModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: insurance,
      validationSchema: insuranceCreate,
      validateOnChange: true,
      validateOnBlur: false,
      //// By disabling validation onChange and onBlur formik will validate on submit.
      onSubmit: async (values, action) => {
        setLoading(true);
        try {
          const response = await axios.post(`/admin/insurances`, {
            name: values?.name,
          });
          if (response?.status === 200) {
            values.name = "";
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
            Create Insurance Carrier
          </span>
          <span className="text-sm font-medium text-gray-600">
            Add name of the carrier that you want to list on the application.
          </span>
        </div>

        <div className="w-full flex flex-col mb-2 justify-start items-start">
          <label
            htmlFor="name"
            className="block ml-1 text-sm font-medium text-gray-700"
          >
            Insurace Carrier Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 px-3 h-12 placeholder:text-sm w-full border rounded-md bg-gray-100 focus:border-gray-200 focus:outline-none  focus:ring-offset-2 focus:ring-gray-300 transition-colors duration ${
              errors.name && touched.name ? "border-red-600 shake" : null
            }`}
          />
          {errors.name && touched.name ? (
            <p className="text-red-700 text-sm font-medium">{errors.name}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full h-10 rounded-full flex items-center justify-center text-md font-medium text-white bg"
        >
          {loading ? "Loading..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default InsuranceCarrierCrate;
