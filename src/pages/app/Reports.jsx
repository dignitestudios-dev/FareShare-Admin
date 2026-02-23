import { useEffect, useState } from "react";
import ReportTabs from "../../components/app/reports/ReportTab";
import { ReportTable } from "../../components/app/reports/ReportTable";
import { TimeTabs } from "../../components/app/reports/TimeTabs";
import axios from '../../axios'
import jsPDF from "jspdf";

export default function Reports() {
    const [activeTab, setActiveTab] = useState("Drivers");
    const [activeTime, setActiveTime] = useState("Daily");
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    function formatDate(dateString) {
        if (dateString == null) return "Invalid Date";
        const date = new Date(dateString);


        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();

        return `${month}-${day}-${year}`;
    }

    const formatType = (type) => {
        if (!type) return "N/A";
        return type.replaceAll("_", " ").toUpperCase();
    };

    const getReports = async (timeFilter = activeTime) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/admin/reports`, {
                params: {
                    filter: timeFilter.toLowerCase(),
                },
            });
            setReports(data?.data);
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getReports(activeTime);
    }, [activeTime]);

    const reportConfig = {
        /* ================= DRIVERS ================= */
        Drivers: {
            columns: [
                "Driver Name",
                "Driver Email",
                "City",
                "Status",
                "Online Hours",
                "Limit Status",
                "Acceptance Rate",
            ],
            data:
                reports?.drivers?.map((driver) => ({
                    "Driver Name": driver?.driverName || "N/A",
                    "Driver Email": driver?.email || "N/A",
                    City: driver?.city || "N/A",
                    Status: driver?.isActive ? "Active" : "Inactive",
                    "Online Hours": driver?.onlineHours
                        ? `${driver.onlineHours}h`
                        : "0h",
                    "Limit Status": driver?.exceedsLimit ? "Exceeded" : "OK",
                    "Acceptance Rate": driver?.acceptanceRate
                        ? `${driver.acceptanceRate}%`
                        : "0%",
                })) || [],
        },

        /* ================= RIDES ================= */
        Rides: {
            columns: [
                "Ride Type",
                "Active Requests",
                "Driver Cancellations",
                "Passenger Cancellations",
                "Completed",
                "Total Cancellations",
            ],
            data:
                reports?.rides?.map((rides) => ({
                    "Ride Type": rides?.rideType || "N/A",
                    "Active Requests": rides?.totalActive || 0,
                    "Driver Cancellations": rides?.riderCancels || 0,
                    "Passenger Cancellations": rides?.passengerCancels || 0,
                    "Completed": rides?.totalCompleted || 0,
                    "Total Cancellations": rides?.totalCancellations || 0,
                })) || [],
        },

        /* ================= EARNINGS ================= */
        Earnings: {
            columns: [
                "Driver Name",
                "Driver Earnings",
                "Admin Fees",
                "Referral Bonuses",
                "Ride Credits",
                "Alternate Payments",
                "Net Revenue",
            ],
            data:
                reports?.earnings?.map((earnings) => ({
                    "Driver Name": earnings?.driverName || "N/A",
                    "Driver Earnings": earnings?.driverEarnings || 0,
                    "Admin Fees": earnings?.platformRevenue || 0,
                    "Referral Bonuses": earnings?.referralBonus || 0,
                    "Ride Credits": earnings?.cashback || 0,
                    "Alternate Payments": earnings?.walletRevenue || 0,
                    "Net Revenue": earnings?.totalRevenue || 0,

                })) || [],
        },

        /* ================= COMPLIANCE ================= */
        Compliance: {
            columns: [
                "Driver",
                "Document Type",
                "Reported On",
                "Expiry Date",
                "Status",
            ],
            data:
                reports?.compliance?.map((compliance) => ({
                    "Driver": `${compliance?.driverId?.firstName} ${compliance?.driverId?.lastName}` || "N/A",
                    "Reported On": formatDate(compliance?.documentUploadDate) || "N/A",
                    "Expiry Date": formatDate(compliance?.documentExpiryDate) || "N/A",
                    "Document Type": formatType(compliance?.documentType) || "N/A",
                    "Status": compliance?.documentStatus || 'N/A',


                })) || [],
        },

        /* ================= SYSTEM ================= */
        System: {
            columns: [
                "State",
                "City",
                "Active Users",
                "Completed Rides",
                "Blocked Accounts",
                "Revenue",
            ],
            data:
                reports?.systems?.map((systems) => ({
                    "State": systems?.state || "N/A",
                    "City": systems?.city || "N/A",
                    "Active Users": systems?.activeUser || 0,
                    "Completed Rides": systems?.completeRidesCount || 0,
                    "Blocked Accounts": systems?.blockUser || 0,
                    "Revenue": systems?.revenue || 'N/A',


                })) || [],
        },
    };

    const { columns, data } = reportConfig[activeTab];

    const handleDownload = (type) => {
        if (type === "csv") {
            const rows = [
                columns.join(","),
                ...data.map((row) =>
                    columns.map((col) => `"${row[col] ?? ""}"`).join(",")
                ),
            ].join("\n");

            const blob = new Blob([rows], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${activeTab}-${activeTime}-report.csv`;
            a.click();

            window.URL.revokeObjectURL(url);
        }

        if (type === "pdf") {
            const doc = new jsPDF();
            doc.setFontSize(12);

            // add header
            doc.text(`${activeTab} - ${activeTime} Report`, 10, 10);

            // add table content
            let startY = 20;
            doc.setFontSize(10);

            // add columns
            doc.text(columns.join(" | "), 10, startY);
            startY += 8;

            // add rows
            data.forEach((row) => {
                const rowText = columns.map((col) => row[col] ?? "").join(" | ");
                doc.text(rowText, 10, startY);
                startY += 8;
            });

            doc.save(`${activeTab}-${activeTime}-report.pdf`);
        }
    };

    return (
        <div className="w-full ">
            <h1 className="text-[18px] font-semibold text-gray-800">
                Reports & Analytics
            </h1>
            <div className="flex items-center justify-between mt-4">
                <TimeTabs activeTime={activeTime} setActiveTime={setActiveTime} />

                <div className="flex gap-2">
                    <button
                        onClick={() => handleDownload("csv")}
                        className="px-4 py-2 text-[11px] rounded-full bg-gray-100 border hover:bg-gray-200"
                    >
                        Download CSV
                    </button>

                    <button
                        onClick={() => handleDownload("pdf")}
                        className="px-4 py-2 text-[11px] rounded-full bg-[#c00000] text-white hover:opacity-90"
                    >
                        Download PDF
                    </button>
                </div>
            </div>


            <div className="mt-4">
                <ReportTabs activeTab={activeTab} setActiveTab={handleTabChange} />
            </div>
            <ReportTable
                columns={columns}
                data={data}
                loading={loading}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
