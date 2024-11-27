import React, { useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BrokerInvoiceDetails = () => {
  const dummyArr = [1, 2];
  const toggleModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  const location = useLocation();

  const data = location.state;
  console.log(data);

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };

  function getMonthNameFromISOString(isoString) {
    // Create a Date object from the ISO 8601 string
    const date = new Date(isoString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }

    // Array of month names
    const monthNames = [
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

    // Get the month name
    return monthNames[date.getMonth()];
  }

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
              `${data?.brokerId?.companyName}'s Invoice`
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
              {data?.brokerId?.companyName}'s Invoice
            </span>
          </div>
          <div className="w-full h-auto flex flex-col gap-4 justify-start items-start">
            <div className=" w-full flex items-center gap-2 justify-start">
              <span className="text-lg font-semibold">Billed To:</span>
              <span className="text-2xl text-[#c00000] font-bold capitalize">
                {data?.brokerId?.companyName}
              </span>
            </div>
            <div className="w-full flex justify-start items-start h-auto">
              <div className="w-1/2 h-auto  flex flex-col justify-start items-start gap-1">
                <span className="text-sm text-left  font-medium text-gray-600">
                  Invoice No. {data?.invoiceNo}
                </span>
                <span className="text-sm text-left  font-medium text-gray-600">
                  Generated on: {convertToMMDDYYYY(data?.creationDate)}
                </span>
                {/* <span className="text-sm text-left  font-medium text-gray-600">
                Due on: {formatDate(invoice?.dueOn)}
              </span> */}
                <span className="text-sm text-left  font-medium text-gray-600">
                  Payable By: {convertToMMDDYYYY(data?.dueDate)}
                </span>
              </div>
            </div>

            <div className="relative mt-2  w-full h-auto">
              <div className="w-full grid grid-cols-11  items-center text-sm text-left rtl:text-right border-y border-x border-gray-300 bg-[#eeeeee]  rounded-t-xl text-gray-900">
                <span className="px-6 w-full my-2 col-span-2 place-content-center text-center self-center place-items-center  flex justify-start items-center ">
                  Client
                </span>
                <span className="px-6 w-full col-span-2 my-2 place-content-center  self-center place-items-center  flex justify-start items-center ">
                  Ride Date
                </span>
                <span className="px-6 w-full my-2 col-span-3 place-content-center self-center place-items-center  flex justify-start items-center ">
                  Origin
                </span>
                <span className="px-6 w-full my-2 col-span-3 place-content-center self-center place-items-center  flex justify-start items-center ">
                  Destination
                </span>
                <span className="px-6 w-full my-2 place-content-center text-center self-center place-items-center  flex justify-start items-center ">
                  Price
                </span>
              </div>
              <div className="w-full flex flex-col border-b border-x border-gray-200 rounded-b-xl justify-start items-start">
                {data?.rides?.length > 0 ? (
                  data.rides.map((item, index) => (
                    <div
                      key={index} // Added key prop
                      className={`w-full grid grid-cols-11  items-center text-sm  bg-gray-50 text-left rtl:text-right ${
                        data?.rides?.length == index + 1
                          ? "rounded-b-xl"
                          : " border-b border-gray-300"
                      } text-gray-500`}
                    >
                      <span className="px-6 my-2 col-span-2 flex justify-start items-center place-content-center  self-center place-items-center  font-medium text-gray-900 whitespace-nowrap">
                        {data?.userId
                          ? `${data?.userId?.firstName} ${data?.userId?.lastName}`
                          : data?.brokerId?.accountHandlerName}
                      </span>
                      <span className="px-6 my-2 flex col-span-2 justify-start items-center place-content-center  self-center place-items-center ">
                        {formatDate(item?.rideDate)}
                      </span>
                      <span className="px-6 my-2 col-span-3 flex justify-start items-center place-content-center  self-center place-items-center ">
                        {item?.originAddress?.slice(0, 60)}...
                      </span>
                      <span className="px-6 my-2 col-span-3 flex justify-start items-center place-content-center  self-center place-items-center ">
                        {item?.destinationAddress?.slice(0, 60)}...
                      </span>
                      <span className="px-6 my-2 flex justify-start items-center place-content-center  self-center place-items-center ">
                        ${item?.estimatedFare}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3">
                    <span>No Transactions</span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex items-center gap-3 justify-end">
              <span className="text-xl lg:text-3xl text-black   font-semibold">
                Total:
              </span>

              <span className="text-xl lg:text-3xl text-[#c00000] font-semibold">
                ${data?.amount ? Number(data?.amount.toFixed(2)) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerInvoiceDetails;
