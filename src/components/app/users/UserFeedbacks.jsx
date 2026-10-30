import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import axios from "../../../axios";

// Custom hook to debounce search input
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Immediately clear if value is empty string
    if (!value) {
      setDebouncedValue("");
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const UserFeedbacks = ({ userId }) => {
  const { id } = useParams();
  const targetId = userId || id;

  const [feedbacks, setFeedbacks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page whenever search or date filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, startDate, endDate]);

  const getFeedbacks = async () => {
    if (!targetId) return;
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (debouncedSearch?.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      const { data } = await axios.get(`/admin/userFeedbacks/${targetId}`, {
        params,
      });

      let list = [];
      if (Array.isArray(data?.data)) {
        list = data.data;
      } else if (Array.isArray(data?.data?.feedbacks)) {
        list = data.data.feedbacks;
      } else if (Array.isArray(data?.data?.userFeedbacks)) {
        list = data.data.userFeedbacks;
      } else if (Array.isArray(data?.feedbacks)) {
        list = data.feedbacks;
      } else if (Array.isArray(data?.userFeedbacks)) {
        list = data.userFeedbacks;
      } else if (Array.isArray(data)) {
        list = data;
      }

      setFeedbacks(list);

      const total =
        data?.totalCount ??
        data?.totalFeedbacks ??
        data?.total ??
        data?.count ??
        data?.data?.totalCount ??
        data?.data?.total ??
        data?.pagination?.total ??
        (Array.isArray(list) ? list.length : 0);

      setTotalCount(total);
    } catch (error) {
      console.log("Error fetching user feedbacks:", error);
      setFeedbacks([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedbacks();
  }, [targetId, debouncedSearch, startDate, endDate, currentPage]);

  function convertToMMDDYYYY(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  const getReviewer = (item) => {
    return (
      item?.driverId ||
      item?.driver ||
      item?.reviewedBy ||
      item?.reviewer ||
      item?.userId ||
      item?.user ||
      {}
    );
  };

  const getReviewerName = (item) => {
    const reviewer = getReviewer(item);
    if (typeof reviewer === "object" && reviewer !== null) {
      if (reviewer.firstName || reviewer.lastName) {
        return `${reviewer.firstName || ""} ${reviewer.lastName || ""}`.trim();
      }
      if (reviewer.name) return reviewer.name;
      if (reviewer.email) return reviewer.email;
    }
    if (item?.driverName) return item.driverName;
    if (item?.userName) return item.userName;
    return "Driver";
  };

  const getReviewerEmail = (item) => {
    const reviewer = getReviewer(item);
    if (typeof reviewer === "object" && reviewer !== null) {
      return reviewer.email || reviewer.phoneNo || reviewer.phone || "";
    }
    return item?.driverEmail || item?.email || "";
  };

  const getReviewerImage = (item) => {
    const reviewer = getReviewer(item);
    if (
      typeof reviewer === "object" &&
      reviewer !== null &&
      reviewer.profilePicture
    ) {
      return reviewer.profilePicture;
    }
    return item?.profilePicture || "/person.png";
  };

  const getFeedbackText = (item) => {
    return (
      item?.feedback ||
      item?.review ||
      item?.comment ||
      item?.message ||
      item?.driverReview?.review ||
      item?.userReview?.review ||
      "N/A"
    );
  };

  const getRating = (item) => {
    const rating = item?.rating ?? item?.driverReview?.rating ?? item?.stars;
    return typeof rating === "number" ? rating : null;
  };

  const getPreferability = (item) => {
    if (item?.preferredAgain !== undefined) return item.preferredAgain;
    if (item?.driverReview?.preferredAgain !== undefined)
      return item.driverReview.preferredAgain;
    if (item?.userReview?.preferredAgain !== undefined)
      return item.userReview.preferredAgain;
    return null;
  };

  // Filter feedbacks (handles API search as well as client-side fallback)
  const filteredFeedbacks = feedbacks.filter((item) => {
    if (debouncedSearch?.trim()) {
      const query = debouncedSearch.trim().toLowerCase();
      const reviewerName = getReviewerName(item).toLowerCase();
      const reviewerEmail = getReviewerEmail(item).toLowerCase();
      const feedbackText = getFeedbackText(item).toLowerCase();

      const matchesSearch =
        reviewerName.includes(query) ||
        reviewerEmail.includes(query) ||
        feedbackText.includes(query);

      if (!matchesSearch) return false;
    }

    const rawDate = item?.createdAt || item?.date || item?.updatedAt;
    if (rawDate) {
      const itemDate = new Date(rawDate).toISOString().split("T")[0];
      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;
    }

    return true;
  });

  const isServerPaginated = totalCount > feedbacks.length;
  const currentData = isServerPaginated
    ? filteredFeedbacks
    : filteredFeedbacks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const displayTotal = isServerPaginated
    ? totalCount
    : filteredFeedbacks.length;
  const totalPages = Math.ceil(displayTotal / itemsPerPage);

  const isDebouncing = searchText !== debouncedSearch;

  return (
    <div className="bg-gray-50 rounded-3xl w-full border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[24px] font-semibold text-black flex items-center gap-2">
          <span>Driver Feedback</span>
          <span className="text-[16px] text-gray-500 font-normal">
            ({displayTotal})
          </span>
        </h3>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6 w-full">
        {/* Search input with Debounce */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by driver name, email or feedback..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border rounded-2xl bg-gray-100 pl-4 pr-10 py-3 text-sm text-gray-700 focus:outline-none w-full"
          />
          {loading || isDebouncing ? (
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
          )}
          {searchText && !loading && !isDebouncing && (
            <button
              onClick={() => {
                setSearchText("");
                setCurrentPage(1);
              }}
              className="absolute top-1/2 right-9 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Date Filter Range: startDate and endDate */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-100 border rounded-2xl px-3 py-2">
            <span className="text-xs text-gray-500 font-medium">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-100 border rounded-2xl px-3 py-2">
            <span className="text-xs text-gray-500 font-medium">To:</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
            />
          </div>

          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-2 whitespace-nowrap"
            >
              Clear Dates
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="mb-2 bg-gray-100 border p-4 rounded-xl animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-[50px] h-[50px] rounded-full bg-gray-300"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                  <div className="w-1/4 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="mt-3 w-3/4 h-3 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : currentData.length > 0 ? (
        <div className="flex flex-col gap-3">
          {currentData.map((item, index) => {
            const reviewerName = getReviewerName(item);
            const reviewerEmail = getReviewerEmail(item);
            const reviewerImage = getReviewerImage(item);
            const feedbackText = getFeedbackText(item);
            const rating = getRating(item);
            const preferred = getPreferability(item);
            const dateStr = convertToMMDDYYYY(
              item?.createdAt || item?.date || item?.updatedAt
            );

            return (
              <div
                key={item?._id || index}
                className="bg-gray-100 border p-4 rounded-2xl transition hover:shadow-sm"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={reviewerImage}
                      alt={reviewerName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/person.png";
                      }}
                      className="w-[50px] h-[50px] rounded-full object-cover border"
                    />
                    <div>
                      <p className="text-[16px] font-semibold text-black">
                        {reviewerName}
                      </p>
                      {reviewerEmail && (
                        <p className="text-xs text-gray-500">{reviewerEmail}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-400">{dateStr}</span>
                    {rating !== null && (
                      <div className="flex items-center gap-0.5 text-amber-500 text-xs">
                        {[1, 2, 3, 4, 5].map((star) =>
                          star <= rating ? (
                            <FaStar key={star} />
                          ) : (
                            <FaRegStar key={star} className="text-gray-300" />
                          )
                        )}
                        <span className="ml-1 text-gray-600 font-medium">
                          {rating}
                        </span>
                      </div>
                    )}
                    {preferred !== null && (
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          preferred
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {preferred ? (
                          <>
                            <FaThumbsUp className="text-[10px]" /> Preferred
                          </>
                        ) : (
                          <>
                            <FaThumbsDown className="text-[10px]" /> Not Preferred
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-800 text-[14px] mt-3 pl-1 leading-relaxed break-words">
                  {feedbackText}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full min-h-52 flex flex-col items-center justify-center py-8">
          <img src="/no-data.png" alt="No data" className="w-[150px]" />
          <span className="font-semibold text-center text-[#0e0e10] text-[20px] mt-2">
            {debouncedSearch || startDate || endDate
              ? "No Feedback Matching Your Filters"
              : "No Feedback Available Yet!"}
          </span>
          {(debouncedSearch || startDate || endDate) && (
            <button
              onClick={() => {
                setSearchText("");
                setStartDate("");
                setEndDate("");
                setCurrentPage(1);
              }}
              className="mt-3 text-xs text-red-600 hover:underline font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <nav
          className="flex items-center justify-end mt-4 -space-x-px"
          aria-label="Pagination"
        >
          <button
            type="button"
            disabled={currentPage === 1}
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
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
    </div>
  );
};

export default UserFeedbacks;
