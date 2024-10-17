import GlobalLayout from "../layouts/GlobalLayout";
import Home from "../pages/Dashboard/Home";
import SettingsLayout from "../layouts/SettingsLayout";
import Users from "../pages/Users/Users";
import Rides from "../pages/Rides/Rides";
import Driver from "../pages/Driver/Driver";
import Nimt from "../pages/Nimt/Nimt";
import Broker from "../pages/Broker/Broker";
import UserDetails from "../pages/Users/UserDetails";
import DriverDetails from "../pages/Driver/DriverDetails";
import RideDetails from "../pages/Rides/RideDetails";
import DriverDetailsPage from "../pages/Driver/DriverDetailsPage";
import VehicleApproval from "../pages/VehicleApproval/VehicleApproval";
import NimtDetails from "../pages/Nimt/NimtDetails";
import NimtUnpaid from "../pages/Nimt/NimtUnpaid";
import BrokerDetails from "../pages/Broker/BrokerDetails";
import BrokerSchedule from "../pages/Broker/BrokerSchedule";
import BrokerComplete from "../pages/Broker/BrokerComplete";
import DriverApprove from "../pages/Driver/DriverApprove";
import VehicleApproveDetails from "../pages/VehicleApproval/VehicleApproveDetails";
import NimtApproved from "../pages/Nimt/NimtApproved";
import NimtPaid from "../pages/Nimt/NimtPaid";
import RidePending from "../pages/Rides/RidePendig";

export const normalRoutes = [
  {
    title: "Home",
    url: "/dashboard",
    page: <GlobalLayout page={<Home />} />,
  },
  {
    title: "Home",
    url: "/Users",
    page: <GlobalLayout page={<Users />} />,
  },
  {
    title: "Rides",
    url: "/rides",
    page: <GlobalLayout page={<Rides />} />,
  },

  {
    title: "Driver",
    url: "/driver",
    page: <GlobalLayout page={<Driver />} />,
  },
  {
    title: "NEMT",
    url: "/nemt",
    page: <GlobalLayout page={<Nimt />} />,
  },
  {
    title: "Broker",
    url: "/broker",
    page: <GlobalLayout page={<Broker />} />,
  },
  {
    title: "User Details",
    url: "/user-details/:id",
    page: <GlobalLayout page={<UserDetails />} />,
  },
  {
    title: "Driver Details",
    url: "/driver-details",
    page: <GlobalLayout page={<DriverDetails />} />,
  },
  {
    title: "Ride Details",
    url: "/ride-details",
    page: <GlobalLayout page={<RideDetails />} />,
  },
  {
    title: "Driver Details",
    url: "/driver-details-page/:id",
    page: <GlobalLayout page={<DriverDetailsPage />} />,
  },
  {
    title: "Driver Details",
    url: "/vehicle-approval",
    page: <GlobalLayout page={<VehicleApproval />} />,
  },
  {
    title: "NIMT Details",
    url: "/nemt-details/:id",
    page: <GlobalLayout page={<NimtDetails />} />,
  },
  {
    title: "NIMT Unpaid",
    url: "/nimt-unpaid",
    page: <GlobalLayout page={<NimtUnpaid />} />,
  },
  {
    title: "Broker Details",
    url: "/broker-details/:id",
    page: <GlobalLayout page={<BrokerDetails />} />,
  },
  {
    title: "Broker Schedule",
    url: "/broker-schedule",
    page: <GlobalLayout page={<BrokerSchedule />} />,
  },
  {
    title: "Broker Completee",
    url: "/broker-complete",
    page: <GlobalLayout page={<BrokerComplete />} />,
  },
  {
    title: "Driver Approve",
    url: "/driver-approve",
    page: <GlobalLayout page={<DriverApprove />} />,
  },
  {
    title: "Vehicle Approve Details",
    url: "/vehicle-approve-details/:id",
    page: <GlobalLayout page={<VehicleApproveDetails />} />,
  },
  {
    title: "NIMT Approved",
    url: "/nimt-approved",
    page: <GlobalLayout page={<NimtApproved />} />,
  },
  {
    title: "NIMT Paid",
    url: "/nimt-paid",
    page: <GlobalLayout page={<NimtPaid />} />,
  },
  {
    title: "Ride Pending",
    url: "/ride-pending",
    page: <GlobalLayout page={<RidePending />} />,
  },
];
