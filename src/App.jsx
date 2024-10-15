import { Route, Routes } from "react-router-dom";
import { AuthenticationRoutes } from "./routes/AuthenticationRoutes.jsx";
import { normalRoutes } from "./routes/normalRoutes.jsx";
import { AuthProvider } from "./contexts/AuthContext"; // Import the AuthProvider
import "./App.css";
import "./fonts/stylesheet.css";

function App() {
  return (
    <AuthProvider> {/* Wrap your routes with AuthProvider */}
      <Routes>
        {AuthenticationRoutes.map((route) => {
          return (
            <Route path={route?.url} element={route?.page} key={route?.title} />
          );
        })}
        {normalRoutes.map((route) => {
          return (
            <Route path={route?.url} element={route?.page} key={route?.title} />
          );
        })}
      </Routes>
    </AuthProvider>
  );
}

export default App;
