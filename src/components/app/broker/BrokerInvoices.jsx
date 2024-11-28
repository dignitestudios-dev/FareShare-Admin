import React, { useState } from "react";
import BrokerInvoiceInternalCard from "./BrokerInvoiceInternalCard";

const BrokerInvoices = ({ broker }) => {
  //   // pagination normal  data:

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(broker?.invoices?.length / itemsPerPage);

  const currentData = broker?.invoices?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="w-full flex flex-col gap-4 bg-gray-50 rounded-3xl border p-4 justify-start items-start">
      <h3 className="text-[24px] font-bold text-black">
        Broker Invoices{" "}
        <span className="text-[16px] text-gray-500">
          ({broker?.invoices?.length})
        </span>
      </h3>
      <div className="w-full grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-2">
        {broker?.invoices?.length > 0 ? (
          currentData?.map((invoice, key) => {
            return <BrokerInvoiceInternalCard invoice={invoice} key={key} />;
          })
        ) : (
          <div className="w-full min-h-52 col-span-3 flex flex-col items-center justify-center">
            <img src="/no-data.png" alt="" className="w-[230px]" />
            <span className="font-semibold text-center text-[#0e0e10] text-[24px] ">
              You don’t have added any <br /> Listing Here
            </span>
          </div>
        )}
      </div>

      {broker?.invoices?.length > 0 && (
        <nav
          class="flex  w-full items-center  justify-end mt-2 -space-x-px"
          aria-label="Pagination"
        >
          <button
            type="button"
            onClick={() =>
              goToPage(currentPage > 1 ? currentPage - 1 : currentPage)
            }
            class="min-h-[38px] min-w-[38px] py-2 bg-gray-100 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border  text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
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
                  : "border bg-gray-100"
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
            class="min-h-[38px] min-w-[38px] py-2 bg-gray-100 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border  text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
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
