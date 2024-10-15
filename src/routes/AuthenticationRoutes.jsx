import ForgotPassword from "../pages/Onboarding/ForgotPassword";
import Login from "../pages/Onboarding/Login";
import ResetPassword from "../pages/Onboarding/ResetPassword";
import VerifyOTP from "../pages/Onboarding/VerifyOtp";

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
    page: <VerifyOTP />,
  },
  {
    title: "Update Password",
    url: "/reset-password",
    page: <ResetPassword />,
  },
];