import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const userContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });


        if (response.data.success) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {

        localStorage.removeItem("token"); 
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (user) => {
    localStorage.setItem("token", user.token);
    setUser(user);
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("leaveFormDraft");
    localStorage.removeItem("addDepartmentDraft");
    localStorage.removeItem("salaryData");
    localStorage.removeItem("addEmployeeDraft");
    localStorage.removeItem("changePasswordDraft");

    setUser(null);
    navigate('/login');
  };

  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
export default AuthContextProvider;
