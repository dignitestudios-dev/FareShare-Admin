import React from "react";
import { MdCheck } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const NemtInvoiceDetails = () => {
  const navigate = useNavigate();

  const handleView = (ride) => {
    navigate(`/rides/${ride?._id}`, { state: ride }); // Pass the entire driver object as state
  };
  const location = useLocation();
  const invoice = location.state;
  console.log(invoice);

  // Extra function below
  const groupRidesByUser = (rides) => {
    return Object.values(
      rides.reduce((acc, ride) => {
        const userId = ride?.user?.id; // Ensure ride?.user._id exists

        // Log to verify the userId and ride data

        if (!userId) {
          // Handle cases where userId is not found in the ride data
          console.error("Missing user ID in ride data");
          return acc;
        }

        // Initialize if the user doesn't exist in the accumulator
        if (!acc[userId]) {
          acc[userId] = {
            user: ride?.user,
            rides: [],
          };
        }

        // Push ride details to the user's rides array
        acc[userId].rides.push(ride);

        return acc;
      }, {})
    );
  };

  console.log(groupRidesByUser(invoice?.rides));

  function convertToMMDDYYYY(dateString) {
    const date = new Date(dateString);

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  const handleDownload = async (e, elementId, filename) => {
    e.preventDefault();
    const element = document.getElementById(elementId);
    if (!element) {
      console.error("Element not found");
      return;
    }

    const paddingY = 3; // Padding at the top of each page in pixels
    const paddingX = 6;
    element.style.backgroundColor = "#fff";

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight() - paddingY * 2; // Adjusted height to account for padding

    let imgProps = pdf.getImageProperties(imgData);
    let imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = paddingY;

    // Add the first page with top padding
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add extra pages with consistent padding at the top
    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);

    element.style.backgroundColor = "";
    element.style.paddingBottom = "";
    element.style.paddingTop = "";
    element.style.paddingLeft = ``;
    element.style.paddingRight = ``;
  };
  return (
    <div className="h-auto w-full  flex flex-col gap-6 justify-start items-start ">
      <div className="w-full  h-auto relative rounded-3xl    flex flex-col gap-8">
        <button
          onClick={(e) =>
            handleDownload(
              e,
              "download-invoice",
              `Invoice ${invoice?.invoiceNo}`
            )
          }
          className="w-40  h-auto py-2 absolute top-4 right-4 rounded-xl font-semibold bg-[#c00000]/[0.1] flex  justify-center items-center gap-1"
        >
          <img src="/pdf.png" alt="" className="w-[22.3px]" />
          <span className="text-sm font-medium text-[#c00000]">
            Download PDF
          </span>
        </button>
        <div
          id="download-invoice"
          className="w-full  h-auto px-6 py-8   bg-g flex flex-col gap-8"
        >
          <div className="w-full h-[5%] flex items-center justify-between">
            <span className="text-3xl font-extrabold capitalize text-black">
              Invoice #{invoice?.invoiceNo}
            </span>
          </div>
          <div className="w-full h-auto flex flex-col gap-4 justify-start items-start">
            <div className=" w-full flex items-center gap-2 justify-start">
              <span className="text-lg font-semibold">Inusrance Carrier:</span>
              <span className="text-2xl text-[#c00000] font-bold capitalize">
                {invoice?.insurance?.name}
              </span>
            </div>
            <div className="w-full flex justify-start items-start h-auto">
              <div className="w-1/2 h-auto  flex flex-col justify-start items-start gap-1">
                <span className="text-sm text-left  font-medium text-gray-600">
                  Invoice No. {invoice?.invoiceNo}
                </span>
                <span className="text-sm text-left  font-medium text-gray-600">
                  Generated on: {convertToMMDDYYYY(invoice?.createdAt)}
                </span>
              </div>
            </div>

            <div className="relative mt-2  w-full h-auto">
              <div className="w-full flex flex-col   justify-start items-start">
                <div className="overflow-x-auto  w-full   ">
                  {invoice ? (
                    groupRidesByUser(invoice?.rides)?.map(
                      (group, groupIndex) => (
                        <React.Fragment key={groupIndex}>
                          {/* User Details */}
                          <div className="w-full bg-[#c00000]/[0.2] border border-[#c00000]/[0.4] p-4 my-4 rounded-2xl text-[10px] text-gray-800 flex flex-col justify-start items-start">
                            <div className="text-[12px] mb-2 font-bold text-black">
                              User Info
                            </div>
                            <div className="w-full text-[10px] flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                {/* <img
                                  src={
                                    group?.user?.profilePicture
                                      ? group?.user?.profilePicture
                                      : "https://placehold.co/400"
                                  }
                                  alt={group?.user?.name}
                                  className="w-10 h-10 rounded-full"
                                /> */}
                                <div className="flex flex-col">
                                  <span className="font-semibold">
                                    {group?.user?.name
                                      ? group?.user?.name
                                      : "N/A"}
                                  </span>
                                  <span className="text-gray-700">
                                    {group?.user?.email
                                      ? group?.user?.email
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Rides Info */}
                          <div className="w-full bg-gray-100 border p-4 my-4 rounded-2xl text-[10px] text-gray-800 flex flex-col justify-start items-start">
                            <div className="text-[12px] mb-2 font-bold text-black">
                              Rides Info
                            </div>
                            <div className="w-full grid grid-cols-8  text-left text-[11px] font-semibold leading-[17.42px] text-[#0A150F80]">
                              <span className="col-span-2">User</span>
                              <span className="col-span-2">Driver</span>
                              <span>Ride Type</span>
                              <span>Registration Date</span>
                              <span>Fare</span>
                              <span className="w-full flex justify-center items-center">
                                Action
                              </span>
                            </div>

                            {group?.rides?.map((ride, rideIndex) => (
                              <div
                                key={rideIndex}
                                className="grid grid-cols-8 py-2  border-b border-gray-200 gap-4 items-center text-[10px] text-gray-900 w-full"
                              >
                                {/* Rider Info */}
                                <div className="flex col-span-2 items-start gap-2">
                                  {/* <img
                                    src={
                                      ride?.user?.profilePicture
                                        ? ride?.user?.profilePicture
                                        : "https://placehold.co/400"
                                    }
                                    alt={ride?.user?.name}
                                    className="w-8 h-8 rounded-lg"
                                  /> */}
                                  <div className="flex flex-col">
                                    <span>{ride?.user?.name || "N/A"}</span>
                                    <span>{ride?.user?.email || "N/A"}</span>
                                  </div>
                                </div>

                                {/* Driver Info */}
                                <div className="flex col-span-2 items-start gap-2">
                                  {/* <img
                                    src={
                                      ride?.driver?.profilePicture
                                        ? ride?.driver?.profilePicture
                                        : "https://placehold.co/400"
                                    }
                                    alt={ride?.driver?.name}
                                    className="w-8 h-8 rounded-lg"
                                  /> */}
                                  <div className="flex flex-col">
                                    <span>{ride?.driver?.name || "N/A"}</span>
                                    <span>{ride?.driver?.email || "N/A"}</span>
                                  </div>
                                </div>

                                {/* Ride Type */}
                                <div>{ride?.ride?.rideType}</div>

                                {/* Registration Date */}
                                <div>
                                  {convertToMMDDYYYY(
                                    ride?.ride?.registrationDate
                                  )}
                                </div>

                                {/* Status */}
                                <div className="capitalize">
                                  ${ride?.ride?.fare}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-center items-center gap-2">
                                  <button
                                    onClick={() => handleView(ride)}
                                    className="     justify-center  flex  h-auto gap-1 w-[75px]  items-center"
                                  >
                                    {/* <img
                                      src={`/eye-icon.png`}
                                      alt={ride?.ride?.status}
                                    /> */}
                                    <span className=" text-black font-medium text-[10px] leading-[17.42px]">
                                      View Details
                                    </span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </React.Fragment>
                      )
                    )
                  ) : (
                    <div className="w-full h-[70vh] flex items-center justify-center">
                      <p>Invoice Data not available. </p>
                    </div>
                  )}
                </div>{" "}
              </div>
            </div>

            <div className="w-full flex items-center gap-3 justify-end">
              <span className="text-xl lg:text-3xl text-black   font-semibold">
                Total:
              </span>

              <span className="text-xl lg:text-3xl text-[#c00000] font-semibold">
                ${invoice?.amount ? Number(invoice?.amount.toFixed(2)) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NemtInvoiceDetails;
