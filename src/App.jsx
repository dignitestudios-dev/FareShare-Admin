import { useState } from "react";
import "./App.css";
import "./fonts/stylesheet.css";
import { Routes, Route } from "react-router-dom";
import { AUTH_ROUTES } from "./routes/AuthRoutes";
import { APP_ROUTES } from "./routes/AppRoutes";
import Splash from "./pages/authentication/Splash";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      {AUTH_ROUTES?.map((route, index) => {
        return <Route path={route?.url} element={route?.page} key={index} />;
      })}
      {APP_ROUTES?.map((route, index) => {
        return <Route path={route?.url} element={route?.page} key={index} />;
      })}
    </Routes>
  );
}

export default App;
