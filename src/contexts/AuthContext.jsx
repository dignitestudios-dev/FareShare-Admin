import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [name, setName] = useState(localStorage.getItem('name'))
  const [email, setEmail] = useState(localStorage.getItem('email'))

  const login = (data) => {
    console.log("🚀 ~ login ~ data:", data)
    if(data){
      localStorage.setItem("token", data?.token);
    // localStorage.setItem("name", data?.data?.userRecord?.name);
    localStorage.setItem("email", data?.data?.email);

    setToken(data?.data?.token);
    setName(data?.data?.userRecord?.name);
    setEmail(data?.data?.userRecord?.email);

    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    setToken(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, email, name }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
