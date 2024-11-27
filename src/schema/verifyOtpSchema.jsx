import * as Yup from "yup";

export const verifytOtpSchema = Yup.object({
  otp: Yup.string()
    .min(4, "Minimum OTP length is 4.")
    .max(4, "Maximum OTP length is 4.")
    .required("Please provide the otp."),
});
