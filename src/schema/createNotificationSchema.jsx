import * as Yup from "yup";

export const createNotificationSchema = Yup.object({
  notification_title: Yup.string()
    .min(4)
    .max(150, "Notification Title cannot exceed 150 characters.")
    .required("Notification Title is a required field."),
  notification_message: Yup.string()
    .min(10)
    .max(1000, "Notification Message cannot exceed 1000 characters.")
    .required("Notification Message is a required field."),
});
