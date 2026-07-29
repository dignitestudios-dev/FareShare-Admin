import * as Yup from "yup";

export const notificationCreate = Yup.object({
  title: Yup.string().max(150, "Title cannot exceed 150 characters.").required("Please enter notification title."),
  message: Yup.string().max(1000, "Message cannot exceed 1000 characters.").required("Please enter notification message."),
  target: Yup.string().required("Please select target audience."),
});

export const insuranceCreate = Yup.object({
  name: Yup.string().required("Please enter carrier name."),
});
