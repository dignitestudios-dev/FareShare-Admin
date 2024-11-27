import React from "react";
import BrokerInvoiceInternalCard from "./BrokerInvoiceInternalCard";

const BrokerInvoices = ({ broker }) => {
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
          broker?.invoices?.map((invoice, key) => {
            return <BrokerInvoiceInternalCard invoice={invoice} key={key} />;
          })
        ) : (
          <div className="w-full h-[30vh]  bg-gray-50 rounded-3xl  col-span-3 flex items-center justify-center text-md font-medium text-gray-600">
            No Data available to show.
          </div>
        )}
      </div>
    </div>
  );
};

export default BrokerInvoices;
