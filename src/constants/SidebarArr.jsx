import { FaRegUser } from "react-icons/fa";
import { LuHome } from "react-icons/lu";
import { BiCar } from "react-icons/bi";
import { GrUserPolice } from "react-icons/gr";
import { LuUser2 } from "react-icons/lu";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { IoCarSportOutline } from "react-icons/io5";







export const sidebarArr = [
  {
    title: "Home",
    url: "/dashboard",
    icon: <LuHome className="text-red-600" />,
  },
  {
    title: "Users",
    url: "/users",
    icon: <FaRegUser className="text-red-600" />,
  },
  {
    title: "Rides",
    url: "/rides",
    icon: <BiCar className="text-red-600" />,
  },
  {
    title: "Driver",
    url: "/driver",
    icon: <GrUserPolice className="text-red-600" />,
  },
  {
    title: "Broker",
    url: "/broker",
    icon: <LuUser2 className="text-red-600" />,
  },
  {
    title: "NIMT Approval",
    url: "/nimt",
    icon: <MdOutlineDocumentScanner className="text-red-600" />,
  },
  {
    title: "Vehicle Approval",
    url: "/vehicle-approval",
    icon: <IoCarSportOutline className="text-red-600" />,
  },
];