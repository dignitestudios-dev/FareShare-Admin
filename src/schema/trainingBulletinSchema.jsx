// 📄 validationSchema.js
import * as Yup from "yup";

const trainingBulletinSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),
  description: Yup.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  bannerLink: Yup.string()
    .trim()
    .required("Banner link is required")
    .url("Enter a valid URL"), // ✅ allows any valid URL now
  // bannerImage: Yup.mixed().required("Banner image is required"),
});

export default trainingBulletinSchema;
