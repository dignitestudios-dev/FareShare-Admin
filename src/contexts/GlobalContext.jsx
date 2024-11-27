import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const route = useNavigate();
  const [activeLink, setActiveLink] = useState("Home");
  const navigate = (url, active) => {
    route(url);
    setActiveLink(active);
  };
  const test = "";
  return (
    <GlobalContext.Provider value={{ test, navigate, activeLink }}>
      {children}
    </GlobalContext.Provider>
  );
};
