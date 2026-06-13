import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("xenji_user") || "null")
  );

  const [token, setToken] = useState(
    localStorage.getItem("xenji_token")
  );

  const save = (data) => {
    localStorage.setItem("xenji_token", data.token);
    localStorage.setItem("xenji_user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  };

  const updateUser = (newUser) => {
    localStorage.setItem("xenji_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const login = async (form) => {
    const { data } = await api.post("/auth/login", form);

    save(data);

    return data;
  };

  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);

    save(data);

    return data;
  };

  const handleGoogleCallback = ({ token, user }) => {
    const parsedUser =
      typeof user === "string" ? JSON.parse(user) : user;

    save({
      token,
      user: parsedUser,
    });

    return parsedUser;
  };

  const startGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    }/auth/google`;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}

    localStorage.removeItem("xenji_token");
    localStorage.removeItem("xenji_user");

    setToken(null);
    setUser(null);

    window.location.href = "/login";
  };

  const refresh = async () => {
    const storedToken = localStorage.getItem("xenji_token");

    if (!storedToken) {
      setUser(null);
      setToken(null);
      return null;
    }

    try {
      const { data } = await api.get("/auth/me");

      updateUser(data.user);
      setToken(storedToken);

      return data.user;
    } catch {
      localStorage.removeItem("xenji_token");
      localStorage.removeItem("xenji_user");

      setUser(null);
      setToken(null);

      return null;
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        refresh,
        updateUser,
        isAdmin: user?.role === "admin",
        startGoogleLogin,
        handleGoogleCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);