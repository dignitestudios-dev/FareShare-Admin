import ForgotPassword from "../pages/onboarding/ForgotPassword";
// import UpdatePassword from "../pages/onboarding/UpdatePassword";
import VerifyOtp from "../pages/onboarding/VerifyOtp";
import Login from "../pages/Onboarding/Login";
import ResetPassword from "../pages/Onboarding/ResetPassword";

export const AuthenticationRoutes = [
  {
    title: "Login",
    url: "/",
    page: <Login />,
  },
  {
    title: "Forgot Password",
    url: "/forgot-password",
    page: <ForgotPassword />,
  },
  {
    title: "Verify Otp",
    url: "/verify-otp",
    page: <VerifyOtp />,
  },
  {
    title: "Update Password",
    url: "/reset-password",
    page: <ResetPassword />,
  },
];