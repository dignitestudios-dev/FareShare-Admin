import { useState } from "react";

export function ReportTable({ columns, data, loading,currentPage ,setCurrentPage}) {
  

    const itemsPerPage = 10;
  
    const totalPages = Math.ceil(data.length / itemsPerPage);
  
    const currentData = data?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    const goToPage = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
  return (
    <div className="w-full bg-gray-50 border py-4 rounded-[18px] mt-5">
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full border-separate">
          <thead>
            <tr className="text-left text-[11px] text-[#0A150F80]">
              {columns.map((col) => (
                <th key={col} className="py-2 px-4">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="py-2 px-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : currentData?.length ? (
              currentData?.map((row, i) => (
                <tr key={i} className="text-[10px] text-gray-900">
                  {columns.map((col) => (
                    <td key={col} className="py-2 px-4">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className="min-h-52 flex flex-col items-center justify-center">
                    <img src="/no-data.png" className="w-[120px]" />
                    <span className="text-[14px] font-semibold text-gray-600">
                      No Records Found
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
        <nav
        class="flex items-center  justify-end mt-2 -space-x-px"
        aria-label="Pagination"
      >
        <button
          type="button"
          onClick={() =>
            goToPage(currentPage > 1 ? currentPage - 1 : currentPage)
          }
          class="min-h-[38px] min-w-[38px] py-2 bg-gray-50 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
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
          class="min-h-[38px] min-w-[38px] py-2 bg-gray-50 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
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
}
