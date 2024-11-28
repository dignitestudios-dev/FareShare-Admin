import GlobalLayout from "../layouts/GlobalLayout";
import Broker from "../pages/app/Broker";
import Dashboard from "../pages/app/Dashboard";
import Driver from "../pages/app/Driver";
import Nimt from "../pages/app/Nimt";
import Tickets from "../pages/app/Tickets";
import Users from "../pages/app/Users";
import VehicleApproval from "../pages/app/VehicleApproval";
import ChangePassword from "../pages/authentication/ChangePassword";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import Login from "../pages/authentication/Login";
import VerifyOTP from "../pages/authentication/VerifyOTP";
import BrokerInvoices from "../pages/app/BrokerInvoices";
import BrokerInvoiceDetails from "../pages/app/BrokerInvoiceDetails";
import UserDetails from "../pages/app/UserDetails";
import Rides from "../pages/app/Rides";
import DriverDetails from "../pages/app/DriverDetails";
import NemtDetails from "../pages/app/NemtDetails";
import VehicleApprovalDetails from "../pages/app/VehicleApprovalDetails";
import Notifications from "../pages/app/Notifications";
import InsuranceCarriers from "../pages/app/InsuranceCarriers";
import BrokerDetails from "../pages/app/BrokerDetails";
import RideDetails from "../pages/app/RideDetails";
import NemtInvoicesCreate from "../pages/app/NemtInvoicesCreate";
import NemtInvoices from "../pages/app/NemtInvoices";
import NemtInvoiceDetails from "../pages/app/NemtInvoiceDetails";
import WithdrawalRequests from "../pages/app/WithdrawalRequests";

export const APP_ROUTES = [
  {
    title: "Home",
    url: "/home",
    page: <GlobalLayout page={<Dashboard />} />,
  },
  {
    title: "Users",
    url: "/users",
    page: <GlobalLayout page={<Users />} />,
  },
  {
    title: "Users",
    url: "/users/:id",
    page: <GlobalLayout page={<UserDetails />} />,
  },
  {
    title: "Rides",
    url: "/rides/",
    page: <GlobalLayout page={<Rides />} />,
  },
  {
    title: "Ride Details",
    url: "/rides/:id",
    page: <GlobalLayout page={<RideDetails />} />,
  },
  {
    title: "Drivers",
    url: "/drivers",
    page: <GlobalLayout page={<Driver />} />,
  },
  {
    title: "Driver Details",
    url: "/drivers/:id",
    page: <GlobalLayout page={<DriverDetails />} />,
  },
  {
    title: "Brokers",
    url: "/brokers",
    page: <GlobalLayout page={<Broker />} />,
  },
  {
    title: "Broker Details",
    url: "/brokers/:id",
    page: <GlobalLayout page={<BrokerDetails />} />,
  },
  {
    title: "Nemt",
    url: "/nemt",
    page: <GlobalLayout page={<Nimt />} />,
  },
  {
    title: "Nemt Details",
    url: "/nemt/:id",
    page: <GlobalLayout page={<NemtDetails />} />,
  },
  {
    title: "Vehicle Approval",
    url: "/vehicle-approval",
    page: <GlobalLayout page={<VehicleApproval />} />,
  },
  {
    title: "Vehicle Approval Details",
    url: "/vehicle-approval/:id",
    page: <GlobalLayout page={<VehicleApprovalDetails />} />,
  },
  {
    title: "Broker Invoices",
    url: "/invoices/broker",
    page: <GlobalLayout page={<BrokerInvoices />} />,
  },
  {
    title: "Broker Invoices Detail",
    url: "/invoices/broker/:id",
    page: <GlobalLayout page={<BrokerInvoiceDetails />} />,
  },
  {
    title: "Nemt Invoices",
    url: "/invoices/nemt",
    page: <GlobalLayout page={<NemtInvoices />} />,
  },
  {
    title: "Nemt Invoices Details",
    url: "/invoices/nemt/:id",
    page: <GlobalLayout page={<NemtInvoiceDetails />} />,
  },
  {
    title: "Nemt Invoices Create",
    url: "/invoices/nemt/create",
    page: <GlobalLayout page={<NemtInvoicesCreate />} />,
  },
  {
    title: "Withdrawal Requests",
    url: "/withdrawal-requests",
    page: <GlobalLayout page={<WithdrawalRequests />} />,
  },
  {
    title: "Tickets",
    url: "/tickets",
    page: <GlobalLayout page={<Tickets />} />,
  },
  {
    title: "Notifications",
    url: "/notifications",
    page: <GlobalLayout page={<Notifications />} />,
  },

  {
    title: "Insurance Carriers",
    url: "/insurance-carriers",
    page: <GlobalLayout page={<InsuranceCarriers />} />,
  },
];
