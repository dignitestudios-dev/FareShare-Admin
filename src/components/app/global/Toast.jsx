import { toast, Toaster } from "react-hot-toast";
export const ToasterContainer = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: "#fff",
          color: "#c00000",
        },
      }}
    />
  );
};

export const SuccessToast = (message) => {
  toast.success(message, {
    duration: 3000, // customize as needed
    style: {
      background: "white",
      color: "#000",
    },
    iconTheme: {
      primary: "green",
      secondary: "white",
    },
  });
};

export const ErrorToast = (message) => {
  toast.error(message, {
    duration: 3000,
    style: {
      background: "#fff",
      color: "#000",
    },
    iconTheme: {
      primary: "#c00000",
      secondary: "#fff",
    },
  });
};
