import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  useEffect(() => {
    if (!token || token === null) {
      navigate("/landing");
    }
  }, [token, navigate]);
  
  return (
    <>
      {children}
    </>
  );
};

export default ProtectedRoute;
