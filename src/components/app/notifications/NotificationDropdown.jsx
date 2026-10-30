import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  IoNotificationsOutline,
  IoCheckmarkDoneOutline,
  IoCheckmark,
} from "react-icons/io5";
import axios from "../../../axios";

function timeAgo(dateVal) {
  if (!dateVal) return "";
  const now = new Date();
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "";
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const limit = 10;

  // 1. Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const { data } = await axios.get("/admin/notifications/unread-count");
      const count =
        data?.unreadCount ??
        data?.count ??
        data?.data?.unreadCount ??
        data?.data?.count ??
        (typeof data?.data === "number" ? data.data : 0) ??
        0;
      setUnreadCount(Number(count) || 0);
    } catch (error) {
      console.log("Error fetching notification unread count:", error);
    }
  }, []);

  // Polling unread count every 15s + immediate fetch on focus and visibilitychange
  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 15000);

    const handleFocusOrVisible = () => {
      if (!document.hidden) {
        fetchUnreadCount();
      }
    };

    window.addEventListener("focus", handleFocusOrVisible);
    document.addEventListener("visibilitychange", handleFocusOrVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocusOrVisible);
      document.removeEventListener("visibilitychange", handleFocusOrVisible);
    };
  }, [fetchUnreadCount]);

  // 2. Fetch notifications list (page 1 or subsequent pages)
  const fetchNotifications = useCallback(
    async (pageToFetch = 1, append = false) => {
      try {
        if (pageToFetch === 1) {
          setInitialLoading(true);
        } else {
          setLoadingMore(true);
        }

        const { data } = await axios.get("/admin/notifications/admin", {
          params: {
            page: pageToFetch,
            limit,
          },
        });

        let list = [];
        if (Array.isArray(data?.data)) {
          list = data.data;
        } else if (Array.isArray(data?.data?.notifications)) {
          list = data.data.notifications;
        } else if (Array.isArray(data?.notifications)) {
          list = data.notifications;
        } else if (Array.isArray(data)) {
          list = data;
        }

        const paginationObj = data?.pagination || data?.data?.pagination || {};
        const totalPages =
          paginationObj?.totalPages ??
          data?.totalPages ??
          data?.data?.totalPages ??
          (list.length < limit ? pageToFetch : pageToFetch + 1);

        const hasNext =
          paginationObj?.hasNextPage ??
          (pageToFetch < totalPages && list.length >= limit);

        setHasMore(hasNext);

        setNotifications((prev) => {
          if (!append) return list;
          const existingIds = new Set(
            prev.map((item) => item?._id || item?.id)
          );
          const newItems = list.filter(
            (item) => !existingIds.has(item?._id || item?.id)
          );
          return [...prev, ...newItems];
        });

        setPage(pageToFetch);
      } catch (error) {
        console.log("Error fetching notifications list:", error);
        if (!append) {
          setNotifications([]);
          setHasMore(false);
        }
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [limit]
  );

  // When opening dropdown: refresh unread count and fetch page 1
  useEffect(() => {
    if (isOpen) {
      fetchUnreadCount();
      fetchNotifications(1, false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen, fetchUnreadCount, fetchNotifications]);

  // 3. Mark as Read helper (tries PATCH, falls back to POST if needed)
  const callMarkAsReadApi = async (payload) => {
    try {
      return await axios.patch("/admin/notifications/read", payload);
    } catch (err) {
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        return await axios.post("/admin/notifications/read", payload);
      }
      throw err;
    }
  };

  // Mark a single notification as read
  const handleMarkAsRead = async (notification, e) => {
    if (e) e.stopPropagation();
    const id = notification?._id || notification?.id;
    if (!id) return;

    const isAlreadyRead =
      notification?.isRead === true ||
      notification?.read === true ||
      notification?.status === "read";

    if (isAlreadyRead) return;

    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((item) => {
        const itemId = item?._id || item?.id;
        if (itemId === id) {
          return { ...item, isRead: true, read: true, status: "read" };
        }
        return item;
      })
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await callMarkAsReadApi({ notificationId: id });
    } catch (error) {
      console.log("Failed to mark notification as read:", error);
      fetchUnreadCount();
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || markingAll) return;
    try {
      setMarkingAll(true);
      // Optimistic update
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true, read: true, status: "read" }))
      );
      setUnreadCount(0);

      await callMarkAsReadApi({ all: true });
    } catch (error) {
      console.log("Failed to mark all notifications as read:", error);
      fetchUnreadCount();
    } finally {
      setMarkingAll(false);
    }
  };

  // Helper to extract driver ID from notification object
  const extractDriverId = (item) => {
    if (!item) return null;
    const d = item.data || item.details || item.metadata || {};

    // 1. Explicit driverId fields
    if (item.driverId && typeof item.driverId === "string") return item.driverId;
    if (d.driverId && typeof d.driverId === "string") return d.driverId;

    // 2. Driver object or string
    if (item.driver) {
      if (typeof item.driver === "object") return item.driver._id || item.driver.id;
      if (typeof item.driver === "string") return item.driver;
    }
    if (d.driver) {
      if (typeof d.driver === "object") return d.driver._id || d.driver.id;
      if (typeof d.driver === "string") return d.driver;
    }

    // 3. Nested in ride
    if (d.ride?.driverId) return d.ride.driverId;
    if (d.ride?.driver?._id) return d.ride.driver._id;
    if (item.ride?.driverId) return item.ride.driverId;
    if (item.ride?.driver?._id) return item.ride.driver._id;

    // 4. Role or target type
    if (
      item.role === "driver" ||
      item.userType === "driver" ||
      item.targetType === "driver" ||
      d.role === "driver" ||
      d.userType === "driver" ||
      d.targetType === "driver"
    ) {
      return item.targetId || d.targetId || item.userId || d.userId;
    }

    // 5. Target ID or User ID (often notifications in admin relate to driver)
    if (item.targetId) return item.targetId;
    if (d.targetId) return d.targetId;
    if (item.userId) return item.userId;
    if (d.userId) return d.userId;

    return null;
  };

  // Click on a notification item: mark as read, call driver details API, and redirect
  const handleNotificationClick = async (item) => {
    if (!item) return;
    const notifId = item?._id || item?.id;

    // 1. Mark as read immediately
    handleMarkAsRead(item);

    // 2. Check for driver ID
    const driverId = extractDriverId(item);

    if (driverId) {
      try {
        setLoadingId(notifId);
        // Call API for driver details
        const { data } = await axios.get(`/admin/driver/${driverId}`);
        const driverData = data?.data?.driver || data?.data;
        if (driverData) {
          Cookies.set("driver", JSON.stringify(driverData));
        }
        setIsOpen(false);
        navigate(`/drivers/${driverId}`, { state: driverData });
      } catch (error) {
        console.log("Error fetching driver details on notification click:", error);
        // Fallback navigation even if API call fails
        setIsOpen(false);
        navigate(`/drivers/${driverId}`);
      } finally {
        setLoadingId(null);
      }
      return;
    }

    // If ride notification without explicit driver ID
    const details = item?.data || item?.details || item?.metadata || {};
    if (details?.rideId || item?.rideId) {
      setIsOpen(false);
      navigate(`/rides/${details.rideId || item.rideId}`);
      return;
    }

    // If user notification
    if (details?.userId || item?.userId) {
      setIsOpen(false);
      navigate(`/users/${details.userId || item.userId}`);
      return;
    }

    // General fallback: navigate to drivers
    setIsOpen(false);
    navigate("/drivers");
  };

  // 4. Scroll Pagination handler
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop - clientHeight < 60 &&
      !loadingMore &&
      !initialLoading &&
      hasMore
    ) {
      fetchNotifications(page + 1, true);
    }
  };

  // 5. Close dropdown on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isItemUnread = (item) => {
    if (item?.isRead !== undefined) return !item.isRead;
    if (item?.read !== undefined) return !item.read;
    if (item?.status !== undefined) return item.status !== "read";
    return false;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        className={`w-[34px] h-[34px] group rounded-lg transition-all duration-300 flex items-center justify-center p-1.5 relative ${
          isOpen
            ? "bg-[#c00000] text-white"
            : "bg-gray-200 hover:bg-[#c00000] text-gray-700 hover:text-white"
        }`}
      >
        <IoNotificationsOutline
          className={`text-base w-full h-full transition ${
            isOpen ? "text-white" : "text-gray-700 group-hover:text-white"
          }`}
        />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-[#c00000] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm pointer-events-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-11 mt-1 w-[360px] sm:w-[420px] bg-white border border-gray-200 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/70">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-gray-900">
                Notifications
              </h3>
              {unreadCount > 0 ? (
                <span className="bg-red-100 text-[#c00000] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="bg-gray-200 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
                  All caught up
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                className="text-xs font-semibold text-[#c00000] hover:text-red-700 hover:underline flex items-center gap-1 transition disabled:opacity-50"
              >
                <IoCheckmarkDoneOutline className="text-sm" />
                <span>{markingAll ? "Marking..." : "Mark all as read"}</span>
              </button>
            )}
          </div>

          {/* Scrollable Notification List (Scroll Pagination) */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="max-h-[380px] overflow-y-auto divide-y divide-gray-100 overscroll-contain"
          >
            {initialLoading ? (
              <div className="p-4 flex flex-col gap-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl animate-pulse"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-300 shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
                      <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length > 0 ? (
              <>
                {notifications.map((item, index) => {
                  const unread = isItemUnread(item);
                  return (
                    <div
                      key={item?._id || item?.id || index}
                      onClick={() => handleNotificationClick(item)}
                      className={`px-4 py-3.5 flex items-start gap-3 transition cursor-pointer group ${
                        unread
                          ? "bg-red-50/40 hover:bg-red-50/70"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Notification Icon */}
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 text-base transition ${
                          unread
                            ? "bg-[#c00000]/10 text-[#c00000]"
                            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                        }`}
                      >
                        {loadingId === (item?._id || item?.id) ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <IoNotificationsOutline />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-xs truncate ${
                              unread
                                ? "font-bold text-gray-900"
                                : "font-medium text-gray-800"
                            }`}
                          >
                            {item?.title || "Notification"}
                          </p>
                          <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                            {timeAgo(item?.createdAt || item?.date)}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-600 line-clamp-2 mt-1 leading-relaxed break-words">
                          {item?.message ||
                            item?.body ||
                            item?.description ||
                            "—"}
                        </p>
                      </div>

                      {/* Unread Indicator & Mark Single Button */}
                      <div className="flex flex-col items-center justify-between shrink-0 self-stretch gap-1">
                        {unread && (
                          <span
                            className="w-2 h-2 rounded-full bg-[#c00000] mt-1"
                            title="Unread"
                          ></span>
                        )}

                        {unread && (
                          <button
                            type="button"
                            onClick={(e) => handleMarkAsRead(item, e)}
                            title="Mark as read"
                            className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-black mt-auto"
                          >
                            <IoCheckmark className="text-xs" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading more spinner (bottom of scroll) */}
                {loadingMore && (
                  <div className="py-3 flex justify-center items-center gap-2 text-xs text-gray-500">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-[#c00000] rounded-full animate-spin"></div>
                    <span>Loading more...</span>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl mb-2">
                  <IoNotificationsOutline />
                </div>
                <p className="font-semibold text-sm text-gray-800">
                  No notifications
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  You are all caught up for now
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50/70 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate("/notifications");
              }}
              className="text-xs font-semibold text-gray-700 hover:text-[#c00000] transition"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

