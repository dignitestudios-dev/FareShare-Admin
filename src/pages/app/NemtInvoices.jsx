import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { IoIosPin } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import BrokerInvoiceCard from "../../components/app/invoices/broker/BrokerInvoiceCard";
import BrokerInvoiceRow from "../../components/app/invoices/broker/BrokerInvoiceRow";
import NemtInvoiceRow from "../../components/app/invoices/nemt/NemtInvoiceRow";

const NemtInvoices = () => {
  const [date, setDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [rideType, setRideType] = useState("User");
  const [category, setCategory] = useState("On Demand");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setTimeout(() => {
      setSearch(searchQuery);
    }, 1000);
  }, [searchQuery]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function generateYearsArray(startYear = 2023) {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = startYear + 1; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  }

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const [selectedInsurances, setSelectedInsurances] = useState([]);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/admin/invoices/admin`, {
        insuranceIds: selectedInsurances, //Change later if req
        status:
          status.toLowerCase() == "all"
            ? null
            : status.toLowerCase() == "pending"
            ? "unpaid"
            : status?.toLowerCase(), // "unpaid", "paid", or null,
        year: year,
        month: parseInt(month),
      });
      setData(data?.data || []); // Ensure we set an empty array if no data
    } catch (error) {
      ErrorToast(error?.response?.data?.message);

      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [update, status, rideType, month, year]);

  const filteredData = data?.filter((invoice, key) => {
    const lowerCaseSearch = searchQuery.toLowerCase();

    return (
      invoice?.insurance?.name?.toLowerCase().includes(lowerCaseSearch) ||
      invoice?.insurance?._id?.toLowerCase().includes(lowerCaseSearch) ||
      invoice?._id.toLowerCase().includes(lowerCaseSearch)
    );
  });

  // pagination related data:

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const currentData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="h-auto w-full  flex flex-col gap-2 justify-start items-start ">
      <div className="w-full flex justify-between items-center mb-2">
        <h3 className="text-[24px] font-bold text-black">
          Nemt Invoices{" "}
          <span className="text-[16px] text-gray-500">
            ({filteredData?.length})
          </span>
        </h3>
        {/* Filters and Search Bar */}
        <div className="flex gap-2 items-center">
          {/* Date Filter */}
          {/* <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-2xl px-4 py-4 text-sm text-gray-700 focus:outline-none w-[184px] h-[50px]"
              placeholder="date"
            />
          </div> */}

          {/* Status Filter */}
          <div class="relative w-[150px] h-[50px]  text-gray-800 ">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              class="peer p-3 pe-9 block w-[150px] h-[50px] bg-gray-50 border rounded-2xl  outline-none disabled:opacity-50 disabled:pointer-events-none text-xs
  focus:pt-6
  focus:pb-2
  [&:not(:placeholder-shown)]:pt-6
  [&:not(:placeholder-shown)]:pb-2
  autofill:pt-6
  autofill:pb-2"
            >
              <option value={"All"}>All</option>

              <option value={"Pending"}>Uncleared</option>
              <option value={"paid"}>Cleared</option>
            </select>
            <label
              class="absolute -top-1 start-0 p-4 h-full truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  peer-disabled:opacity-50 peer-disabled:pointer-events-none
    peer-focus:text-xs
    peer-focus:-translate-y-1.5
    peer-focus:text-gray-500 
    peer-[:not(:placeholder-shown)]:text-xs
    peer-[:not(:placeholder-shown)]:-translate-y-1.5
    peer-[:not(:placeholder-shown)]:text-gray-500 "
            >
              Select Status
            </label>
          </div>

          <div class="relative w-[150px] h-[50px]  text-gray-800 ">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              class="peer p-3 pe-9 bg-gray-50 block w-[150px] h-[50px] border rounded-2xl outline-none disabled:opacity-50 disabled:pointer-events-none text-xs
  focus:pt-6
  focus:pb-2
  [&:not(:placeholder-shown)]:pt-6
  [&:not(:placeholder-shown)]:pb-2
  autofill:pt-6
  autofill:pb-2"
            >
              {months?.map((item, key) => {
                return (
                  <option key={key} selected={month == key + 1} value={key + 1}>
                    {item}
                  </option>
                );
              })}
            </select>
            <label
              class="absolute -top-1 start-0 p-4 h-full truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  peer-disabled:opacity-50 peer-disabled:pointer-events-none
    peer-focus:text-xs
    peer-focus:-translate-y-1.5
    peer-focus:text-gray-500 
    peer-[:not(:placeholder-shown)]:text-xs
    peer-[:not(:placeholder-shown)]:-translate-y-1.5
    peer-[:not(:placeholder-shown)]:text-gray-500 "
            >
              Select Month
            </label>
          </div>
          <div class="relative w-[120px] h-[50px]  text-gray-800 ">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              class="peer p-3 pe-9 block bg-gray-50 w-[120px] h-[50px] border rounded-2xl outline-none disabled:opacity-50 disabled:pointer-events-none text-xs
  focus:pt-6
  focus:pb-2
  [&:not(:placeholder-shown)]:pt-6
  [&:not(:placeholder-shown)]:pb-2
  autofill:pt-6
  autofill:pb-2"
            >
              {generateYearsArray()?.map((item) => {
                return (
                  <option key={item} selected={year == item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            <label
              class="absolute -top-1 start-0 p-4 h-full truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  peer-disabled:opacity-50 peer-disabled:pointer-events-none
    peer-focus:text-xs
    peer-focus:-translate-y-1.5
    peer-focus:text-gray-500 
    peer-[:not(:placeholder-shown)]:text-xs
    peer-[:not(:placeholder-shown)]:-translate-y-1.5
    peer-[:not(:placeholder-shown)]:text-gray-500 "
            >
              Select Year
            </label>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Search"
              className="border rounded-2xl bg-gray-50 pl-4 pr-10 py-4 text-sm text-gray-700 focus:outline-none w-[208px] h-[50px]" // Increased size
            />
            <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={() => navigate("/invoices/nemt/create")}
            className={`active:scale-95  flex justify-center items-center w-10 h-10 rounded-full bg shadow-md border border-red-500 text-white  font-medium text-xl  outline-none   hover:opacity-90 transition-all duration-500 `}
          >
            <span className="leading-3">
              <FiPlus />
            </span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full bg-gray-50 border px-5 py-4 rounded-[18px] ">
        <table className="min-w-full  border-separate rounded-[18px]">
          <thead>
            <tr className=" text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
              <th className="py-2 ">Invoice No.</th>
              <th className="py-2 px-4">Insurance Carrier</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-6">Status</th>
              <th className="py-2 px-6">Created On</th>
              <th className="py-2 px-4 flex justify-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(10)].map((_, index) => (
                <React.Fragment key={index}>
                  <tr className="text-[10px] text-gray-900">
                    <td className="py-1">
                      <div className="w-32 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td className="py-1 px-4">
                      <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td className="py-1 px-4">
                      <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td className="py-1 px-4">
                      <div className="w-20 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td className="py-1 px-4">
                      <div className="w-20 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td className="py-1 px-4">
                      <div className="bg-gray-300 w-[75px] h-[26px] rounded-[8px] flex items-center justify-center"></div>
                    </td>
                  </tr>
                  {/* Line under each row */}
                  <tr>
                    <td colSpan="5" className="border-b border-gray-200"></td>
                  </tr>
                </React.Fragment>
              ))
            ) : filteredData?.length > 0 ? (
              currentData?.map((invoice, key) => (
                <NemtInvoiceRow
                  invoice={invoice}
                  key={key}
                  setUpdate={setUpdate}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center h-[70vh] py-4">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* // <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      //   {filteredData?.length > 0 ? (
      //     currentData?.map((invoice, key) => {
      //       return (
      //         <BrokerInvoiceCard
      //           invoice={invoice}
      //           key={key}
      //           setUpdate={setUpdate}
      //         />
      //       );
      //     })
      //   ) : (
      //     <div className="w-full h-[70vh] rounded-3xl bg-white col-span-3 flex items-center justify-center text-md font-medium text-gray-600">
      //       No Data available to show.
      //     </div>
      //   )}
      // </div> */}

      <nav
        class="flex items-center w-full  justify-end mt-2 -space-x-px"
        aria-label="Pagination"
      >
        <button
          type="button"
          onClick={() =>
            goToPage(currentPage > 1 ? currentPage - 1 : currentPage)
          }
          class="min-h-[38px] min-w-[38px] py-2 bg-gray-50 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border  text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
          aria-label="Previous"
        >
          <svg
            class="shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          <span class="hidden sm:block">Previous</span>
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => goToPage(i + 1)}
            class={`min-h-[38px] min-w-[38px]  flex hover:bg-gray-100 justify-center items-center  text-gray-800 ${
              currentPage === i + 1
                ? " border bg-[#c00000] text-white hover:bg-[#c00000] "
                : "border bg-gray-50"
            }    py-2 px-3 text-sm first:rounded-s-lg last:rounded-e-lg focus:outline-none  disabled:opacity-50 disabled:pointer-events-none `}
            aria-current="page"
          >
            {i + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() =>
            goToPage(currentPage < totalPages ? currentPage + 1 : currentPage)
          }
          class="min-h-[38px] min-w-[38px] py-2 bg-gray-50 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border  text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
          aria-label="Next"
        >
          <span class="hidden sm:block">Next</span>
          <svg
            class="shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default NemtInvoices;