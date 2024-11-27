import * as Yup from "yup";

export const changePassSchema = Yup.object({
  password: Yup.string()
    .min(8, "Minimum password length is 8.")
    .required("Please enter your password"),
  confirmPassword: Yup.string()
    .min(8, "Minimum password length is 8.")
    .required("Please enter your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});
