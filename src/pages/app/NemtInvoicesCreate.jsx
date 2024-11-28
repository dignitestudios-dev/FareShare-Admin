import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import { TbCaretDownFilled } from "react-icons/tb";
import BrokerInvoiceRow from "../../components/app/invoices/broker/BrokerInvoiceRow";
import { useNavigate } from "react-router-dom";
import { MdCheck } from "react-icons/md";
import InvoiceModal from "../../components/app/global/InvoiceModal";
import {
  FaSortNumericDown,
  FaSortNumericDownAlt,
  FaSortNumericUp,
  FaSortNumericUpAlt,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const NemtInvoicesCreate = () => {
  const [insurance, setInsurance] = useState(null);
  const [openInsurance, setOpenInsurance] = useState(false);

  const [insuranceData, setInsuranceData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const getInsuranceCarriers = async () => {
    try {
      setDataLoading(true);
      const { data } = await axios.get("/admin/insurances");
      setInsuranceData(data?.data || []); // Ensure we set an empty array if no data
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    getInsuranceCarriers();
  }, [update]);

  const [UserData, setUserData] = useState([]);
  const [users, setUsers] = useState([]);
  const [openUsers, setOpenUsers] = useState(false);

  const [userLoading, setUserLoading] = useState(false);

  const getUsers = async () => {
    try {
      setUserLoading(true);
      const { data } = await axios.get(
        `/admin/user/insurance/${insurance?._id}`
      );
      setUserData(data?.data); // Use setUserData to set the user data
      setUsers([]);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);

      console.log("Error:", error);
    } finally {
      setUserLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    setUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== userId);
      } else {
        // Otherwise, add the user ID
        return [...prevSelected, userId];
      }
    });
  };

  useEffect(() => {
    insurance && getUsers();
  }, [insurance]);

  const [userSearch, setUserSearch] = useState("");

  const filteredUsers = UserData.filter((user) => {
    const fullName = `${user?.firstName || ""} ${
      user?.lastName || ""
    }`.toLowerCase();
    const searchMatch = fullName.includes(userSearch.toLowerCase());

    return searchMatch; // Both conditions must match
  });

  const [insuranceSearch, setInsuranceSearch] = useState("");
  const filteredInsurance = insuranceData.filter((carrier) => {
    const name = `${carrier?.name || ""}`.toLowerCase();
    const searchMatch = name.includes(insuranceSearch.toLowerCase());

    return searchMatch; // Both conditions must match
  });

  const [date, setDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const [rideType, setRideType] = useState("User");
  const [category, setCategory] = useState("On Demand");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setTimeout(() => {
      setSearch(searchQuery);
    }, 1000);
  }, [searchQuery]);

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

  // get invoice data:
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState([]);

  const [selectedRidesByUser, setSelectedRidesByUser] = useState({}); // Tracks selected rides for each user

  const handleInvoiceSelect = (invoiceId, userId) => {
    setSelectedInvoice((prevSelected) => {
      if (prevSelected.includes(invoiceId)) {
        // Remove ride ID from selectedInvoice
        return prevSelected.filter((id) => id !== invoiceId);
      } else {
        // Add ride ID to selectedInvoice
        return [...prevSelected, invoiceId];
      }
    });

    setSelectedRidesByUser((prev) => {
      const userRides = prev[userId] || [];
      if (userRides.includes(invoiceId)) {
        // Deselect ride for the user
        return {
          ...prev,
          [userId]: userRides.filter((id) => id !== invoiceId),
        };
      } else {
        // Select ride for the user
        return { ...prev, [userId]: [...userRides, invoiceId] };
      }
    });
  };

  const handleSelectAll = (rides, userId) => {
    const rideIds = rides.map((ride) => ride.id);

    const allSelected = rideIds.every((id) => selectedInvoice.includes(id));
    setSelectedInvoice((prevSelected) => {
      if (allSelected) {
        // Deselect all rides for the user
        return prevSelected.filter((id) => !rideIds.includes(id));
      } else {
        // Select all rides for the user
        return [...new Set([...prevSelected, ...rideIds])];
      }
    });

    setSelectedRidesByUser((prev) => {
      if (allSelected) {
        // Deselect all for the user
        return { ...prev, [userId]: [] };
      } else {
        // Select all for the user
        return { ...prev, [userId]: rideIds };
      }
    });
  };

  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const getInvoice = async () => {
    try {
      setInvoiceLoading(true);
      const { data } = await axios.post(`/admin/invoices/insured/`, {
        insuranceId: insurance?._id,
        userIds: users,
      });
      setInvoices(data?.data); // Use setUserData to set the user data
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const [sort, setSort] = useState(true);

  const filteredData = invoices
    .filter((ride) => {
      const search = searchQuery?.trim()?.toLowerCase();
      const userName = ride?.user?.name?.toLowerCase() || "";
      const userEmail = ride?.user?.email?.toLowerCase() || "";
      const driverName = ride?.driver?.name?.toLowerCase() || "";
      const driverEmail = ride?.driver?.email?.toLowerCase() || "";

      return (
        userName.includes(search) ||
        userEmail.includes(search) ||
        driverName.includes(search) ||
        driverEmail.includes(search)
      );
    })
    .sort((a, b) => {
      const fareA = a?.ride?.fare || 0;
      const fareB = b?.ride?.fare || 0;

      // Sort in descending order if `sort` is true, otherwise ascending
      return sort ? fareB - fareA : fareA - fareB;
    });
  useEffect(() => {
    insurance && getInvoice();
  }, [insurance, users]);

  function convertToMMDDYYYY(dateString) {
    if (dateString == null) return "Invalid Date";
    const date = new Date(dateString);

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  const [open, setOpen] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generatedInvoiceData, setGeneratedInvoiceData] = useState(null);
  const generateInvoice = async () => {
    if (insurance == null) {
      ErrorToast("Please try selecting a insurance carrier first.");
    } else if (selectedInvoice?.length == 0) {
      ErrorToast("You must select a ride to continue.");
    } else {
      try {
        setGenerateLoading(true);
        const response = await axios.post(`/admin/invoices/admin/create`, {
          insuranceId: insurance?._id,
          rideIds: selectedInvoice,
        });
        if (response?.status == 200) {
          SuccessToast("Invoice Created Successfully.");
          setGeneratedInvoiceData(response?.data?.data);
        }
      } catch (error) {
        ErrorToast(error?.response?.data?.message);
      } finally {
        setGenerateLoading(false);
      }
    }
  };

  const toggleOpen = () => {
    if (insurance == null) {
      ErrorToast("Please try selecting a insurance carrier first.");
    } else if (selectedInvoice?.length == 0) {
      ErrorToast("You must select a ride to continue.");
    } else {
      setOpen(true);
    }
  };

  const toggleSort = () => {
    if (invoices?.length > 0) {
      setSort((prev) => !prev);
    } else {
      ErrorToast("There is no data available to sort.");
    }
  };

  return (
    <div className="w-full min-h-screen ">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[24px] font-bold text-black">Create Invoice</h3>
        {/* Filters and Search Bar */}
        <div className="flex gap-2">
          <div class=" w-44 relative inline-flex">
            <button
              onClick={() => setOpenInsurance((prev) => !prev)}
              type="button"
              class={`hs-dropdown-toggle h-11 w-full ${
                openInsurance ? "rounded-2xl border" : "rounded-2xl border"
              } px-2 text-xs font-medium  bg-gray-50 text-gray-600 inline-flex justify-center items-center gap-x-2`}
              aria-expanded="false"
              aria-label="Menu"
            >
              <span>
                {insurance == null ? "Insurrance Carrier" : insurance?.name}
              </span>
              <TbCaretDownFilled />
            </button>

            <div
              class={`group w-full transition-all rounded-2xl p-2 duration    ${
                openInsurance
                  ? "flex flex-col justify-start items-start  opacity-100"
                  : "hidden opacity-0"
              } z-10 mt-2  bg-gray-50 divide-y group-last::rounded-b-2xl border shadow absolute top-10 left-0`}
            >
              <div className="w-full max-h-56 p-1  overflow-y-auto grid grid-cols-1 gap-1 justify-start items-start">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={insuranceSearch}
                    onChange={(e) => {
                      setInsuranceSearch(e.target.value);
                    }}
                    placeholder="Search"
                    className="border rounded-lg pl-2 pr-10 py-2 text-sm bg-gray-100 text-gray-700 focus:outline-none w-full h-8" // Increased size
                  />
                  <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
                </div>
                {filteredInsurance?.length > 0 ? (
                  filteredInsurance?.map((carrier, key) => (
                    <button
                      onClick={() => {
                        setInsurance(carrier);
                        setOpenInsurance(false);
                      }}
                      class={`w-full h-7  hover:bg-gray-200 ${
                        insurance?.name == carrier?.name && "bg-gray-200"
                      }  flex items-center justify-start px-2 text-xs rounded-md font-medium text-gray-600`}
                    >
                      {carrier?.name}
                    </button>
                  ))
                ) : (
                  <div className="w-full h-full flex flex-col  items-center justify-center">
                    <img src="/no-data.png" alt="" className="h-20" />
                    <span className="font-normal text-center text-[#0e0e10] text-xs ">
                      You don’t have added any Listing Here
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div class=" w-44 relative inline-flex">
            <button
              onClick={() => setOpenUsers((prev) => !prev)}
              type="button"
              class={`hs-dropdown-toggle h-11 w-full ${
                openUsers ? "rounded-2xl border" : "rounded-2xl border"
              } px-2 text-xs font-medium  bg-gray-50 text-gray-600 inline-flex justify-center items-center gap-x-2`}
              aria-expanded="false"
              aria-label="Menu"
            >
              <span>Select Users</span>
              <TbCaretDownFilled />
            </button>

            <div
              class={`group w-72 max-h-60 p-2  transition-all rounded-2xl duration    ${
                openUsers
                  ? "flex  justify-start items-start  opacity-100"
                  : "hidden opacity-0"
              } z-10 mt-2  bg-gray-50 divide-y group-last::rounded-b-2xl border shadow absolute top-10 -right-14`}
            >
              <div className="w-full max-h-72 px-2 overflow-y-auto grid grid-cols-1 justify-start items-start">
                <div className="w-full flex items-center justify-start gap-1">
                  <div className="relative w-[90%]">
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                      }}
                      placeholder="Search"
                      className="border rounded-lg pl-2 pr-10 py-2 text-sm bg-gray-100 text-gray-700 focus:outline-none w-full h-8" // Increased size
                    />
                    <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
                  </div>

                  <button
                    onClick={() => setOpenUsers(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-md bg-[#c00000] text-white"
                  >
                    <IoMdClose />
                  </button>
                </div>

                {filteredUsers?.length > 0 ? (
                  filteredUsers?.map((user, key) => {
                    const fullName = user?.firstName + " " + user?.lastName;
                    return (
                      <div className="w-full flex  justify-start items-center border-b h-12 gap-3">
                        <input
                          type="checkbox"
                          checked={users.includes(user?._id)}
                          onChange={() => handleUserSelect(user?._id)}
                          className="w-3 h-3 rounded-md accent-[#c00000]"
                        />

                        <div className="w-auto flex justify-start gap-2 items-center h-full">
                          <img
                            src={user?.profilePicture}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />

                          <div className="w-auto flex flex-col justify-center items-start">
                            <span className="text-xs font-medium text-black/90">
                              {fullName}
                            </span>
                            <span className="text-[10px] font-medium text-black/70">
                              {user?.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      // <button
                      //   onClick={() => {
                      //     setUsers(fullName);
                      //     setOpenUsers(false);
                      //   }}
                      //   class={`w-full h-7  hover:bg-gray-200 ${
                      //     users == fullName && "bg-gray-200"
                      //   }  flex items-center justify-start px-2 text-xs font-medium text-gray-600`}
                      // >
                      //   {fullName}
                      // </button>
                    );
                  })
                ) : (
                  <div className="w-full h-auto my-2 flex flex-col  items-center justify-center">
                    <img src="/no-data.png" alt="" className="h-20" />
                    <span className="font-normal text-center text-[#0e0e10] text-xs ">
                      {insurance == null
                        ? "Please select an insurance carrier to show users."
                        : "No users available for selected insurance."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Search"
              className="border rounded-2xl pl-4 pr-10 py-4 text-sm bg-gray-50 text-gray-700 focus:outline-none w-[338px] h-11" // Increased size
            />
            <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            className="w-11 h-11 rounded-2xl bg-gray-50 border flex items-center justify-center"
            onClick={() => toggleSort()}
          >
            {sort ? <FaSortNumericDownAlt /> : <FaSortNumericUp />}
          </button>

          {insurance && (
            <button
              onClick={toggleOpen}
              className="h-11 transition-all duration-200 rounded-full border border-[#c00000] text-[#c00000]  bg-[#c00000]/[0.1] hover:bg-[#c00000] hover:text-white text-xs font-semibold flex items-center justify-center px-3"
            >
              Generate Invoice
            </button>
          )}

          <InvoiceModal
            isOpen={open}
            onRequestClose={() => setOpen(false)}
            onConfirm={generateInvoice}
            loading={generateLoading}
            invoiceData={generatedInvoiceData}
            count={selectedInvoice?.length}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full bg-gray-50 px-5 py-4 border rounded-[18px] ">
        {/* Table Section */}
        <div className="overflow-x-auto  w-full   ">
          {invoiceLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <div
                className="grid grid-cols-8 py-2 border-b border-gray-200 gap-4 animate-pulse"
                key={index}
              >
                {/* Column 1 */}
                <div className="flex col-span-2 justify-start items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>

                {/* Column 2 */}
                <div className="flex col-span-2 justify-start items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>

                {/* Column 3 */}
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>

                {/* Column 4 */}
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>

                {/* Column 5 */}
                <div className="h-4 bg-gray-300 rounded w-1/2 capitalize"></div>

                {/* Column 6 */}
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))
          ) : filteredData?.length > 0 ? (
            groupRidesByUser(filteredData)?.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {/* User Details */}
                <div className="w-full bg-[#c00000]/[0.2] border border-[#c00000]/[0.4] p-4 my-4 rounded-2xl text-[10px] text-gray-800 flex flex-col justify-start items-start">
                  <div className="text-[12px] mb-2 font-bold text-black">
                    User Info
                  </div>
                  <div className="w-full text-[10px] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          group?.user?.profilePicture
                            ? group?.user?.profilePicture
                            : "https://placehold.co/400"
                        }
                        alt={group?.user?.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {group?.user?.name ? group?.user?.name : "N/A"}
                        </span>
                        <span className="text-gray-700">
                          {group?.user?.email ? group?.user?.email : "N/A"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleSelectAll(group?.rides, group?.user?.id)
                      }
                      className={`px-3 h-8 flex items-center justify-center font-medium rounded-full ${
                        selectedRidesByUser[group?.user?.id]?.length ===
                        group?.rides.length
                          ? "bg-[#c00000] text-white"
                          : "bg-[#1c1c1c] text-white hover:bg-[#c00000]"
                      }`}
                    >
                      {selectedRidesByUser[group?.user?.id]?.length ===
                      group?.rides.length
                        ? "Unselect All"
                        : "Select All"}
                    </button>
                  </div>
                </div>

                {/* Rides Info */}
                <div className="w-full bg-gray-100 border p-4 my-4 rounded-2xl text-[10px] text-gray-800 flex flex-col justify-start items-start">
                  <div className="text-[12px] mb-2 font-bold text-black">
                    Rides Info
                  </div>
                  <div className="w-full grid grid-cols-8 border-b border-gray-200 text-left text-[11px] font-semibold leading-[17.42px] text-[#0A150F80]">
                    <span className="col-span-2">User</span>
                    <span className="col-span-2">Driver</span>
                    <span>Ride Type</span>
                    <span>Registration Date</span>
                    <span className="flex gap-1 justify-start items-center">
                      <span>Fare</span>
                    </span>
                    <span className="w-full flex justify-center items-center">
                      Action
                    </span>
                  </div>

                  {group?.rides?.map((ride, rideIndex) => (
                    <div
                      key={rideIndex}
                      className="grid grid-cols-8 py-2 border-b border-gray-200 gap-4 items-center text-[10px] text-gray-900 w-full"
                    >
                      {/* Rider Info */}
                      <div className="flex col-span-2 items-start gap-2">
                        <img
                          src={
                            ride?.user?.profilePicture
                              ? ride?.user?.profilePicture
                              : "https://placehold.co/400"
                          }
                          alt={ride?.user?.name}
                          className="w-8 h-8 rounded-lg"
                        />
                        <div className="flex flex-col">
                          <span>{ride?.user?.name || "N/A"}</span>
                          <span>{ride?.user?.email || "N/A"}</span>
                        </div>
                      </div>

                      {/* Driver Info */}
                      <div className="flex col-span-2 items-start gap-2">
                        <img
                          src={
                            ride?.driver?.profilePicture
                              ? ride?.driver?.profilePicture
                              : "https://placehold.co/400"
                          }
                          alt={ride?.driver?.name}
                          className="w-8 h-8 rounded-lg"
                        />
                        <div className="flex flex-col">
                          <span>{ride?.driver?.name || "N/A"}</span>
                          <span>{ride?.driver?.email || "N/A"}</span>
                        </div>
                      </div>

                      {/* Ride Type */}
                      <div>{ride?.ride?.rideType}</div>

                      {/* Registration Date */}
                      <div>
                        {convertToMMDDYYYY(ride?.ride?.registrationDate)}
                      </div>

                      {/* Status */}
                      <div className="capitalize">${ride?.ride?.fare}</div>

                      {/* Actions */}
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() =>
                            handleInvoiceSelect(ride.id, group?.user?.id)
                          }
                          className={` border border-gray-300 w-[26px] h-[26px] flex items-center justify-center rounded-[8px] ${
                            selectedRidesByUser[group?.user?.id]?.includes(
                              ride.id
                            )
                              ? "bg-[#c00000] text-white"
                              : "text-gray-400 bg-gray-200"
                          }`}
                        >
                          {selectedRidesByUser[group?.user?.id]?.includes(
                            ride.id
                          ) && <MdCheck className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ))
          ) : insurance == null && users?.length == 0 ? (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
              <img src="/no-data.png" alt="" className="w-[230px]" />
              <span className="font-semibold text-center text-[#0e0e10] text-[24px] ">
                Please select an insurance <br /> carrier to show data
              </span>
            </div>
          ) : insurance !== null && users?.length == 0 ? (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
              <img src="/no-data.png" alt="" className="w-[230px]" />
              <span className="font-semibold text-center text-[#0e0e10] text-[24px] ">
                No Data available for selected <br /> insurance carrier.
              </span>
            </div>
          ) : insurance !== null && users.length > 0 ? (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
              <img src="/no-data.png" alt="" className="w-[230px]" />
              <span className="font-semibold text-center text-[#0e0e10] text-[24px] ">
                No data available for selected users.
              </span>
            </div>
          ) : insurance !== null && users?.length == 0 ? (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
              <img src="/no-data.png" alt="" className="w-[230px]" />
              <span className="font-semibold text-center text-[#0e0e10] text-[24px] ">
                No data available.
              </span>
            </div>
          ) : null}
        </div>{" "}
      </div>
    </div>
  );
};

export default NemtInvoicesCreate;
