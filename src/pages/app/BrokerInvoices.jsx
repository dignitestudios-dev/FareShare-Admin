import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoIosPin } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import BrokerInvoiceCard from "../../components/app/invoices/broker/BrokerInvoiceCard";
import BrokerInvoiceRow from "../../components/app/invoices/broker/BrokerInvoiceRow";

const BrokerInvoices = () => {
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

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/finance/rideInvoices`, {
        rideType: "PreArranged", // "PreArranged", "Nemt" or null,
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
    if (invoice?.userId) {
      return (
        invoice?.userId?.firstName?.toLowerCase().includes(lowerCaseSearch) ||
        invoice?.userId?.email?.toLowerCase().includes(lowerCaseSearch)
      );
    } else {
      return (
        invoice?.brokerId?.accountHandlerName
          ?.toLowerCase()
          .includes(lowerCaseSearch) ||
        invoice?.brokerId?.companyName
          ?.toLowerCase()
          .includes(lowerCaseSearch) ||
        invoice?.brokerId?.email?.toLowerCase().includes(lowerCaseSearch)
      );
    }
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
    console.log(new Date().getMonth());
  };

  return (
    <div className="h-auto w-full  flex flex-col gap-2 justify-start items-start ">
      <div className="w-full flex justify-between items-center mb-2">
        <h3 className="text-[24px] font-bold text-black">
          Broker Invoices{" "}
          <span className="text-[16px] text-gray-500">
            ({filteredData?.length})
          </span>
        </h3>
        {/* Filters and Search Bar */}
        <div className="flex gap-2">
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
        </div>
      </div>

      <div className="w-full h-auto p-4 text-left text-xs text-[#c00000] rounded-3xl font-normal bg-[#c00000]/[0.1] ">
        Note: Late Payment and Fees: Any outstanding balance not paid within
        three (3) days of the payment due date will incur a late fee of 10% of
        the total outstanding balance for each day the payment remains overdue.
        If the balance remains unpaid beyond three (3) days from the payment due
        date, the account associated with the outstanding balance will be
        temporarily suspended or deactivated until the full payment is received.
      </div>

      {/* Table Section */}
      <div className="w-full bg-gray-50 border px-5 py-4 rounded-3xl ">
        <table className="min-w-full  border-separate rounded-[18px]">
          {filteredData?.length > 0 && (
            <thead>
              <tr className=" text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
                <th className="py-2 ">Broker Info</th>
                <th className="py-2 px-4">Generated On</th>
                <th className="py-2 px-4">Due Date</th>
                <th className="py-2 px-4">Cleared On</th>
                <th className="py-2 px-6">Status</th>
                <th className="py-2 px-6">Amount</th>

                <th className="py-2 px-4 flex justify-center">Action</th>
              </tr>
            </thead>
          )}

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
                      <div className="w-20 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td className="py-1 px-4">
                      <div className="bg-gray-300 w-[75px] h-[26px] rounded-[8px] flex items-center justify-center"></div>
                    </td>
                  </tr>
                  {/* Line under each row */}
                  <tr>
                    <td colSpan="6" className="border-b border-gray-200"></td>
                  </tr>
                </React.Fragment>
              ))
            ) : filteredData?.length > 0 ? (
              currentData?.map((invoice, key) => (
                <BrokerInvoiceRow
                  invoice={invoice}
                  key={key}
                  setUpdate={setUpdate}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
                    <img src="/no-data.png" alt="" className="w-[230px]" />
                    <span className="font-semibold text-center text-[#0e0e10] text-[24px] ">
                      You don’t have added any <br /> Listing Here
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredData?.length > 0 && (
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
      )}
    </div>
  );
};

export default BrokerInvoices;
