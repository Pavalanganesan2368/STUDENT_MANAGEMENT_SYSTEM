import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("accessToken");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    localStorage.setItem("accessToken", data.accessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch { }
    localStorage.removeItem("accessToken");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
