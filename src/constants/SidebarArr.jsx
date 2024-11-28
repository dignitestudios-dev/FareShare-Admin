import { FaRegUser } from "react-icons/fa";
import { LuHome } from "react-icons/lu";
import { BiCar } from "react-icons/bi";
import { GrUserPolice } from "react-icons/gr";
import { LuUser2 } from "react-icons/lu";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { IoCarSportOutline } from "react-icons/io5";
import { TbFileInvoice } from "react-icons/tb";
import { MdOutlineContactSupport } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { PiHandWithdrawBold, PiHandWithdrawLight } from "react-icons/pi";

export const sidebarArr = [
  {
    title: "Home",
    url: "/home",
    icon: <LuHome />,
  },
  {
    title: "Users",
    url: "/users",
    icon: <FaRegUser />,
  },
  {
    title: "Rides",
    url: "/rides",
    icon: <BiCar />,
  },
  {
    title: "Drivers",
    url: "/drivers",
    icon: <GrUserPolice />,
  },
  {
    title: "Brokers",
    url: "/brokers",
    icon: <LuUser2 />,
  },
  {
    title: "NEMT Approval",
    url: "/nemt",
    icon: <MdOutlineDocumentScanner />,
  },
  {
    title: "Vehicle Approval",
    url: "/vehicle-approval",
    icon: <IoCarSportOutline />,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: <TbFileInvoice />,
    submenu: [
      {
        title: "Brokers Invoices",
        url: "/invoices/broker",
      },
      {
        title: "NEMT Invoices",
        url: "/invoices/nemt",
      },
    ],
  },
  {
    title: "Withdrawal Requests",
    url: "/withdrawal-requests",
    icon: <PiHandWithdrawBold />,
  },
  {
    title: "Tickets",
    url: "/tickets",
    icon: <MdOutlineContactSupport />,
  },
  {
    title: "Insurance Carriers",
    url: "/insurance-carriers",
    icon: <LiaFileInvoiceSolid />,
  },
];
