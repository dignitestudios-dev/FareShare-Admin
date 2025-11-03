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
  const handleLogout = () => {
    localStorage.clear();

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    route("/auth/login");
  };

  return (
    <GlobalContext.Provider value={{ test, navigate, activeLink,handleLogout }}>
      {children}
    </GlobalContext.Provider>
  );
};
