import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GlobalContextProvider } from "./contexts/GlobalContext.jsx";
import { ToasterContainer } from "./components/app/global/Toast.jsx";
import { LoadScript } from "@react-google-maps/api";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalContextProvider>
        <LoadScript
          googleMapsApiKey="AIzaSyDu5qz6dMJookAbJFiPHHss-deq9JYr9qw"
          preventGoogleFontsLoading
        >
          <ToasterContainer />
          <App />
        </LoadScript>
      </GlobalContextProvider>
    </BrowserRouter>
  </StrictMode>
);
