import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { ErrorToast } from "../../components/app/global/Toast";
import axios from "../../axios";

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [selectedDriver, setSelectedDriver] = useState(null);

    const formatDate = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "-";
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    const getSubscriptions = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/admin/subscriptions", {
                params: {
                    page: currentPage,
                    limit,
                    search: debouncedSearchQuery || undefined,
                    ...(statusFilter ? { status: statusFilter } : {}),
                },
            });

            if (data?.success) {
                setSubscriptions(Array.isArray(data.data) ? data.data : []);
                setTotalCount(data.total ?? data.results ?? (Array.isArray(data.data) ? data.data.length : 0));
            } else {
                setSubscriptions([]);
                setTotalCount(0);
            }
        } catch (error) {
            ErrorToast(error?.response?.data?.message || "Failed to load subscriptions.");
            setSubscriptions([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const getStats = async () => {
        try {
            setStatsLoading(true);
            const { data } = await axios.get("/admin/subscriptions/stats");
            if (data?.success) {
                setStats(data.data || {});
            }
        } catch (error) {
            ErrorToast(error?.response?.data?.message || "Failed to load subscription stats.");
        } finally {
            setStatsLoading(false);
        }
    };

    const getSubscriptionDetail = async (driverId) => {
        if (!driverId) return;
        try {
            setDetailLoading(true);
            const { data } = await axios.get(`/admin/subscriptions/${driverId}`);
            if (data?.success) {
                setSelectedDriver(data.data || null);
            } else {
                setSelectedDriver(null);
            }
        } catch (error) {
            ErrorToast(error?.response?.data?.message || "Failed to load subscription detail.");
            setSelectedDriver(null);
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        getSubscriptions();
        getStats();
    }, [currentPage, limit, statusFilter, debouncedSearchQuery]);

    const filteredSubscriptions = subscriptions.filter((item) => {
        if (!debouncedSearchQuery) return true;
        const query = debouncedSearchQuery.toLowerCase();
        return [
            item?.driverName,
            item?.email,
            item?.phoneNo,
            item?.status,
            item?.subscriptionId,
            item?.priceId,
        ]
            .filter(Boolean)
            .some((value) => value.toString().toLowerCase().includes(query));
    });

    const pages = Math.max(1, Math.ceil(totalCount / limit));

    return (
        <div className="min-h-screen w-full flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col lg:flex-row justify-between gap-4 items-start">
                    <div>
                        <h1 className="text-[28px] font-bold text-black">Subscriptions</h1>

                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <div className="relative w-full sm:w-[320px]">
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by driver, email, phone, status"
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-10 text-sm text-gray-700 outline-none focus:border-[#c00000]"
                            />
                            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="rounded-2xl border border-gray-200 bg-white py-3 px-4 text-sm text-gray-700"
                        >
                            <option value="">All statuses</option>
                            <option value="active">Active</option>

                        </select>

                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="rounded-2xl border border-gray-200 bg-white py-3 px-4 text-sm text-gray-700"
                        >
                            {[10, 20, 50].map((value) => (
                                <option key={value} value={value}>
                                    Show {value}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[
                        { title: "Total Subscriptions", value: stats?.totalSubscriptions },
                        { title: "Active Subscriptions", value: stats?.activeSubscriptions },
                    ].map((card, index) => (
                        <div key={index} className="rounded-[24px] bg-gray-50 border p-5 shadow-sm">
                            <span className="block text-sm text-gray-500">{card.title}</span>
                            <h2 className="mt-3 text-[28px] font-bold text-black">
                                {statsLoading ? "..." : card.value ?? 0}
                            </h2>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full bg-gray-50 border rounded-[24px] p-6">
                <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:justify-between sm:items-center">
                    <h2 className="text-xl font-bold text-black">Driver Subscriptions</h2>

                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate">
                        <thead>
                            <tr className="text-left text-[11px] font-medium uppercase tracking-wider text-[#0A150F80]">
                                <th className="py-3 pr-4">Name</th>
                                <th className="py-3 pr-4">Email</th>
                                <th className="py-3 pr-4">Phone</th>
                                <th className="py-3 pr-4">Status</th>
                                <th className="py-3 pr-4">Amount</th>
                                <th className="py-3 pr-4">Subscribed At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(limit)].map((_, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        {Array.from({ length: 10 }).map((__, cellIndex) => (
                                            <td key={cellIndex} className="py-4 pr-4">
                                                <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filteredSubscriptions.length > 0 ? (
                                filteredSubscriptions.map((subscription) => {
                                    const {
                                        _id,
                                        driverId,
                                        driverName,
                                        email,
                                        phoneNo,
                                        status,
                                        amount,
                                        subscriptionId,
                                        priceId,
                                        subscribedAt,
                                        isAdminGranted,
                                    } = subscription;
                                    return (
                                        <tr key={_id || driverId} className="border-b border-gray-200">
                                            <td className="py-4 pr-4">{driverName || "-"}</td>
                                            <td className="py-4 pr-4">{email || "-"}</td>
                                            <td className="py-4 pr-4">{phoneNo || "-"}</td>
                                            <td className="py-4 pr-4 capitalize">{status || "-"}</td>
                                            <td className="py-4 pr-4">{amount != null ? `$${amount}` : "-"}</td>
                                            <td className="py-4 pr-4">{formatDate(subscribedAt)}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="10" className="py-16 text-center text-gray-500">
                                        No subscription records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-gray-500">
                        Page {currentPage} of {pages}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            disabled={currentPage >= pages}
                            onClick={() => setCurrentPage((prev) => Math.min(pages, prev + 1))}
                            className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {selectedDriver && (
                <div className="w-full bg-gray-50 border rounded-[24px] p-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-bold text-black">Subscription Detail</h2>
                        <button
                            onClick={() => setSelectedDriver(null)}
                            className="text-sm text-[#c00000] underline"
                        >
                            Close
                        </button>
                    </div>

                    {detailLoading ? (
                        <div className="mt-6 text-sm text-gray-600">Loading details...</div>
                    ) : (
                        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {[
                                { label: "Name", value: selectedDriver?.driverName },
                                { label: "Email", value: selectedDriver?.email },
                                { label: "Phone", value: selectedDriver?.phoneNo },
                                { label: "Status", value: selectedDriver?.status },
                                { label: "Amount", value: selectedDriver?.amount != null ? `$${selectedDriver.amount}` : "-" },
                                { label: "Subscription ID", value: selectedDriver?.subscriptionId || "-" },
                                { label: "Price ID", value: selectedDriver?.priceId || "-" },
                                { label: "Subscribed At", value: formatDate(selectedDriver?.subscribedAt) },
                                { label: "Admin Granted", value: selectedDriver?.isAdminGranted ? "Yes" : "No" },
                            ].map((item) => (
                                <div key={item.label} className="rounded-3xl bg-white border p-4">
                                    <div className="text-xs uppercase tracking-[0.12em] text-gray-500">
                                        {item.label}
                                    </div>
                                    <div className="mt-2 text-sm text-black">{item.value ?? "-"}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Subscriptions;
