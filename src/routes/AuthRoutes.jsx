import ChangePassword from "../pages/authentication/ChangePassword";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import Login from "../pages/authentication/Login";
import VerifyOTP from "../pages/authentication/VerifyOTP";

export const AUTH_ROUTES = [
  {
    title: "Login",
    url: "/auth/login",
    page: <Login />,
  },
  {
    title: "Forgot Password",
    url: "/auth/forgot-password",
    page: <ForgotPassword />,
  },
  {
    title: "Verify OTP",
    url: "/auth/verify-otp",
    page: <VerifyOTP />,
  },
  {
    title: "Change Password",
    url: "/auth/change-password",
    page: <ChangePassword />,
  },
];
