import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5003/api/users/login",
        {
          username,
          password,
        }
      );
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setUser({ username });
    } catch (error) {
      console.error("Login error:", error.response.data.message);
    }
  };

  const register = async (username, password) => {
    try {
      await axios.post("http://localhost:5003/api/users/register", {
        username,
        password,
      });
    } catch (error) {
      console.error("Registration error:", error.response.data.message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
