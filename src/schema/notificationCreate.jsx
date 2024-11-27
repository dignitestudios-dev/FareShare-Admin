import * as Yup from "yup";

export const notificationCreate = Yup.object({
  title: Yup.string().required("Please enter notification title."),
  message: Yup.string().max(300).required("Please enter notification message."),
  target: Yup.string().required("Please select target audience."),
});

export const insuranceCreate = Yup.object({
  name: Yup.string().required("Please enter carrier name."),
});
