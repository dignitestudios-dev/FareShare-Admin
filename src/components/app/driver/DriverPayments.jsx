import React, { useState, useEffect } from "react";
import { FiEye, FiSearch, FiArrowUpRight, FiArrowDownLeft, FiX } from "react-icons/fi";
import { FaMoneyBillWave, FaWallet, FaCar, FaUniversity } from "react-icons/fa";
import axios from "../../../axios";
import { ErrorToast } from "../global/Toast";

// Debounce hook
function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (!value) {
      setDebouncedValue("");
      return;
    }
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const DriverPayments = ({ driverId }) => {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    totalRecords: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(""); // "" = All, "earning" = Earnings, "withdraw" = Withdrawals
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 400);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedPayment, setSelectedPayment] = useState(null);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tab, debouncedSearch, startDate, endDate]);

  const getPayments = async () => {
    if (!driverId) return;
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (debouncedSearch?.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (tab) {
        params.transactionType = tab;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      const { data } = await axios.get(`/admin/driver/payments/${driverId}`, {
        params,
      });

      if (data?.success || Array.isArray(data?.data)) {
        const list = Array.isArray(data?.data) ? data.data : [];
        setPayments(list);

        if (data?.pagination) {
          setPagination(data.pagination);
        } else {
          setPagination({
            currentPage,
            totalPages: Math.ceil(list.length / itemsPerPage) || 1,
            limit: itemsPerPage,
            totalRecords: data?.results || list.length,
            hasNextPage: false,
            hasPrevPage: false,
          });
        }
      }
    } catch (error) {
      console.log("Error fetching driver payments:", error);
      ErrorToast(error?.response?.data?.message || "Failed to load driver payments.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayments();
  }, [driverId, currentPage, tab, debouncedSearch, startDate, endDate]);

  function formatDateTime(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatEpochDate(epochVal) {
    if (!epochVal) return "N/A";
    const num = Number(epochVal);
    if (isNaN(num)) return String(epochVal);
    // If epoch in seconds vs ms
    const d = new Date(num > 1e11 ? num : num * 1000);
    return formatDateTime(d);
  }

  // Client-side fallback filter
  const filteredPayments = payments.filter((item) => {
    if (tab) {
      const type = item?.transactionType?.toLowerCase();
      if (type !== tab.toLowerCase()) return false;
    }

    if (debouncedSearch?.trim()) {
      const query = debouncedSearch.trim().toLowerCase();
      const title = (item?.title || "").toLowerCase();
      const subtitle = (item?.subTitle || "").toLowerCase();
      const passenger = (item?.details?.passenger?.name || "").toLowerCase();
      const status = (item?.status || "").toLowerCase();

      const match =
        title.includes(query) ||
        subtitle.includes(query) ||
        passenger.includes(query) ||
        status.includes(query);

      if (!match) return false;
    }

    if (startDate || endDate) {
      const rawDate = item?.date || item?.createdAt;
      if (rawDate) {
        const itemDate = new Date(rawDate).toISOString().split("T")[0];
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
      }
    }

    return true;
  });

  const isServerPaginated = (pagination?.totalPages || 1) > 1 || (pagination?.totalRecords || 0) > payments.length;
  const currentData = isServerPaginated
    ? filteredPayments
    : filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = pagination?.totalPages || Math.ceil((filteredPayments.length || 1) / itemsPerPage) || 1;
  const totalCount = pagination?.totalRecords || filteredPayments.length;

  const downloadCSV = () => {
    const listToExport = filteredPayments.length > 0 ? filteredPayments : payments;
    if (!listToExport.length) {
      ErrorToast("No payment records available to download.");
      return;
    }

    const rows = listToExport.map((item) => ({
      title: item?.title || "N/A",
      subTitle: item?.subTitle || "N/A",
      type: item?.transactionType || "N/A",
      amount: item?.amount != null ? Number(item.amount).toFixed(2) : "0.00",
      fee: item?.fee != null ? Number(item.fee).toFixed(2) : "0.00",
      netAmount: item?.netAmount != null ? Number(item.netAmount).toFixed(2) : "0.00",
      status: item?.status || "N/A",
      date: formatDateTime(item?.date),
    }));

    const csv = [
      ["Title", "Subtitle", "Type", "Gross Amount", "Fee", "Net Amount", "Status", "Date"],
      ...rows.map((r) => [
        `"${r.title.replace(/"/g, '""')}"`,
        `"${r.subTitle.replace(/"/g, '""')}"`,
        `"${r.type}"`,
        `"$${r.amount}"`,
        `"$${r.fee}"`,
        `"$${r.netAmount}"`,
        `"${r.status}"`,
        `"${r.date}"`,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `driver-payments-${driverId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-auto bg-gray-50 border rounded-3xl p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-[24px] font-bold text-black flex items-center gap-2">
          <span>Driver Payments</span>
          <span className="text-[16px] text-gray-500 font-normal">
            ({totalCount})
          </span>
        </h3>

        <button
          onClick={downloadCSV}
          className="bg-[#c00000] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition"
        >
          Download / Print
        </button>
      </div>

      {/* Filter Row: Search, Tabs, Date Range */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by title, location, passenger..."
            className="w-full border rounded-2xl bg-gray-100 pl-4 pr-10 py-3 text-sm text-gray-700 focus:outline-none"
          />
          <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
          {searchText && (
            <button
              onClick={() => {
                setSearchText("");
                setCurrentPage(1);
              }}
              className="absolute top-1/2 right-9 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Transaction Type Tabs */}
        <div className="w-full sm:w-80 h-11 bg-gray-100 grid grid-cols-3 gap-1 items-center justify-start border p-1 rounded-2xl">
          <button
            onClick={() => setTab("")}
            className={`w-full transition-all duration-300 ${
              tab === ""
                ? "bg-[#c00000] text-white"
                : "bg-transparent text-gray-600 hover:bg-gray-200"
            } h-full rounded-xl flex items-center justify-center text-xs font-medium`}
          >
            All
          </button>
          <button
            onClick={() => setTab("earning")}
            className={`w-full transition-all duration-300 ${
              tab === "earning"
                ? "bg-[#c00000] text-white"
                : "bg-transparent text-gray-600 hover:bg-gray-200"
            } h-full rounded-xl flex items-center justify-center text-xs font-medium`}
          >
            Earnings
          </button>
          <button
            onClick={() => setTab("withdraw")}
            className={`w-full transition-all duration-300 ${
              tab === "withdraw"
                ? "bg-[#c00000] text-white"
                : "bg-transparent text-gray-600 hover:bg-gray-200"
            } h-full rounded-xl flex items-center justify-center text-xs font-medium`}
          >
            Withdrawals
          </button>
        </div>

        {/* Date Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-100 border rounded-2xl px-3 py-2">
            <span className="text-xs text-gray-500 font-medium">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs text-gray-700 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 border rounded-2xl px-3 py-2">
            <span className="text-xs text-gray-500 font-medium">To:</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs text-gray-700 focus:outline-none"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="text-xs text-red-600 hover:underline px-1 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full bg-gray-100 border rounded-[18px] p-4 overflow-x-auto">
        <table className="min-w-full border-separate">
          <thead>
            <tr className="text-left text-[12px] font-bold text-black border-b">
              <th className="py-2.5 px-3">Transaction</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Gross Amount</th>
              <th className="py-2.5 px-3">Fee</th>
              <th className="py-2.5 px-3">Net Amount</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3 px-3">
                    <div className="h-4 bg-gray-300 rounded w-44 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                  </td>
                  <td className="py-3 px-3"><div className="h-4 bg-gray-300 rounded w-16"></div></td>
                  <td className="py-3 px-3"><div className="h-4 bg-gray-300 rounded w-14"></div></td>
                  <td className="py-3 px-3"><div className="h-4 bg-gray-300 rounded w-12"></div></td>
                  <td className="py-3 px-3"><div className="h-4 bg-gray-300 rounded w-14"></div></td>
                  <td className="py-3 px-3"><div className="h-5 bg-gray-300 rounded-full w-20"></div></td>
                  <td className="py-3 px-3"><div className="h-4 bg-gray-300 rounded w-28"></div></td>
                  <td className="py-3 px-3 text-center"><div className="h-7 bg-gray-300 rounded-full w-14 mx-auto"></div></td>
                </tr>
              ))
            ) : currentData?.length > 0 ? (
              currentData.map((item, index) => {
                const isEarning = item?.transactionType?.toLowerCase() === "earning";
                const isWithdraw = item?.transactionType?.toLowerCase() === "withdraw";

                const grossAmount = item?.amount != null && !isNaN(Number(item.amount))
                  ? Number(item.amount).toFixed(2)
                  : "0.00";
                const feeAmount = item?.fee != null && !isNaN(Number(item.fee))
                  ? Number(item.fee).toFixed(2)
                  : "0.00";
                const netAmount = item?.netAmount != null && !isNaN(Number(item.netAmount))
                  ? Number(item.netAmount).toFixed(2)
                  : "0.00";

                const statusLower = (item?.status || "").toLowerCase();

                return (
                  <tr
                    key={item?.id || item?._id || index}
                    className="text-[12px] text-gray-800 hover:bg-gray-200/50 transition border-b border-gray-200"
                  >
                    {/* Title & Subtitle */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base ${
                            isEarning
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isEarning ? <FiArrowUpRight /> : <FiArrowDownLeft />}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-black truncate max-w-xs">
                            {item?.title || "Payment"}
                          </span>
                          <span className="text-[11px] text-gray-500 truncate max-w-xs">
                            {item?.subTitle || "—"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Transaction Type */}
                    <td className="py-3 px-3 capitalize">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          isEarning
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : isWithdraw
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-gray-50 text-gray-700 border"
                        }`}
                      >
                        {item?.transactionType || "N/A"}
                      </span>
                    </td>

                    {/* Gross Amount */}
                    <td className="py-3 px-3 font-semibold text-gray-900">
                      ${grossAmount}
                    </td>

                    {/* Fee */}
                    <td className="py-3 px-3 text-gray-500">
                      ${feeAmount}
                    </td>

                    {/* Net Amount */}
                    <td className="py-3 px-3 font-bold">
                      <span
                        className={
                          isEarning
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {isEarning ? `+$${netAmount}` : `-$${netAmount}`}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${
                          statusLower === "completed" || statusLower === "approved"
                            ? "bg-green-100 text-green-700"
                            : statusLower === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item?.status || "completed"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-[11px] text-gray-500 whitespace-nowrap">
                      {formatDateTime(item?.date)}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setSelectedPayment(item)}
                        className="rounded-full justify-center bg-[#c00000] hover:bg-red-700 text-white flex items-center h-[26px] gap-1 px-3 text-[11px] font-medium mx-auto transition"
                      >
                        <FiEye className="text-xs" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8">
                  <div className="w-full min-h-52 flex flex-col items-center justify-center py-6">
                    <img src="/no-data.png" alt="No data" className="w-[120px]" />
                    <span className="font-semibold text-center text-[#0e0e10] text-[18px] mt-2">
                      No Payments Found
                    </span>
                    {(tab || debouncedSearch || startDate || endDate) && (
                      <button
                        onClick={() => {
                          setTab("");
                          setSearchText("");
                          setStartDate("");
                          setEndDate("");
                        }}
                        className="mt-2 text-xs text-red-600 hover:underline font-medium"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <nav
          className="flex items-center justify-end mt-2 -space-x-px"
          aria-label="Pagination"
        >
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="min-h-[38px] min-w-[38px] py-2 bg-gray-100 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border text-gray-800 hover:bg-gray-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Previous"
          >
            <svg
              className="shrink-0 size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            <span className="hidden sm:block">Previous</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`min-h-[38px] min-w-[38px] flex justify-center items-center text-sm border ${
                currentPage === i + 1
                  ? "bg-[#c00000] text-white hover:bg-[#c00000]"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              } py-2 px-3 first:rounded-s-lg last:rounded-e-lg focus:outline-none`}
            >
              {i + 1}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="min-h-[38px] min-w-[38px] py-2 bg-gray-100 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border text-gray-800 hover:bg-gray-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Next"
          >
            <span className="hidden sm:block">Next</span>
            <svg
              className="shrink-0 size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </nav>
      )}

      {/* Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${
                    selectedPayment?.transactionType === "earning"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {selectedPayment?.transactionType === "earning" ? (
                    <FaMoneyBillWave />
                  ) : (
                    <FaUniversity />
                  )}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-black">
                    {selectedPayment?.title || "Payment Details"}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {selectedPayment?.subTitle || "—"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
              >
                <FiX className="text-base" />
              </button>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50 border rounded-2xl p-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Gross Amount</span>
                <span className="text-base font-bold text-gray-900">
                  ${selectedPayment?.amount != null ? Number(selectedPayment.amount).toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Platform Fee</span>
                <span className="text-base font-bold text-gray-500">
                  ${selectedPayment?.fee != null ? Number(selectedPayment.fee).toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Net Amount</span>
                <span
                  className={`text-base font-bold ${
                    selectedPayment?.transactionType === "earning"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ${selectedPayment?.netAmount != null ? Number(selectedPayment.netAmount).toFixed(2) : "0.00"}
                </span>
              </div>
            </div>

            {/* Meta details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 border p-3 rounded-xl flex flex-col">
                <span className="text-gray-400">Transaction ID</span>
                <span className="font-semibold text-gray-800 break-all mt-0.5">
                  {selectedPayment?.id || selectedPayment?._id || "N/A"}
                </span>
              </div>

              <div className="bg-gray-50 border p-3 rounded-xl flex flex-col">
                <span className="text-gray-400">Status</span>
                <span className="font-semibold text-gray-800 capitalize mt-0.5">
                  {selectedPayment?.status || "completed"}
                </span>
              </div>

              <div className="bg-gray-50 border p-3 rounded-xl flex flex-col col-span-2">
                <span className="text-gray-400">Date</span>
                <span className="font-semibold text-gray-800 mt-0.5">
                  {formatDateTime(selectedPayment?.date)}
                </span>
              </div>
            </div>

            {/* If Ride Earnings Details */}
            {selectedPayment?.details?.rideId && (
              <div className="flex flex-col gap-3 bg-gray-50 border rounded-2xl p-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Ride Information
                </h5>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Ride Type:</span>
                    <p className="font-semibold text-gray-800">
                      {selectedPayment?.details?.rideType || "Standard"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Ride ID:</span>
                    <p className="font-semibold text-gray-800 break-all">
                      {selectedPayment?.details?.rideId}
                    </p>
                  </div>
                </div>

                <div className="text-xs flex flex-col gap-1 border-t pt-2">
                  <div>
                    <span className="text-gray-400 font-medium">Pickup: </span>
                    <span className="text-gray-800">
                      {selectedPayment?.details?.originAddress || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Destination: </span>
                    <span className="text-gray-800">
                      {selectedPayment?.details?.destinationAddress || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Passenger Info */}
                {selectedPayment?.details?.passenger && (
                  <div className="mt-2 border-t pt-3 flex items-center gap-3">
                    <img
                      src={
                        selectedPayment?.details?.passenger?.profilePicture
                          ? selectedPayment.details.passenger.profilePicture.startsWith("http")
                            ? selectedPayment.details.passenger.profilePicture
                            : `/${selectedPayment.details.passenger.profilePicture}`
                          : "/person.png"
                      }
                      alt="Passenger"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/person.png";
                      }}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-gray-900">
                        {selectedPayment?.details?.passenger?.name || "Passenger"}
                      </span>
                      <span className="text-gray-500">
                        {selectedPayment?.details?.passenger?.email || selectedPayment?.details?.passenger?.phoneNo || ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* If Withdrawal Details */}
            {selectedPayment?.details?.withdrawId && (
              <div className="flex flex-col gap-3 bg-gray-50 border rounded-2xl p-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Withdrawal Information
                </h5>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Withdraw ID:</span>
                    <p className="font-semibold text-gray-800 break-all">
                      {selectedPayment?.details?.withdrawId}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Bank / Account:</span>
                    <p className="font-semibold text-gray-800 break-all">
                      {selectedPayment?.details?.bankId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Date Requested:</span>
                    <p className="font-semibold text-gray-800">
                      {formatEpochDate(selectedPayment?.details?.dateRequested)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Completed Date:</span>
                    <p className="font-semibold text-gray-800">
                      {formatDateTime(selectedPayment?.details?.withdrawCompletionDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedPayment(null)}
              className="w-full bg-[#1c1c1c] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-black transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverPayments;

