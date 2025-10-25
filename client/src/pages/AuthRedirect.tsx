import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const status = query.get("status");

  useEffect(() => {
    const verifyUserAuth = async () => {
      console.log("Token:", token);
      console.log("Status:", status);
      try {
        if (!token || token === null || !status || status === null) {
          navigate("/landing");
        } else {
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/oauth/checkValidToken`,
            { token }
          );

          if (response.data.data.isValid !== "true") {
            navigate("/landing");
            return;
          }

          localStorage.setItem("token", token);

          if (status === "pending") {
            navigate("/complete-profile");
          } else if (status === "completed") {
            navigate("/");
          } else {
            navigate("/landing");
          }
        }
      } catch (error) {
        console.log(error);
        navigate("/landing");
      } finally {
        setLoading(false);
      }
    };

    verifyUserAuth();
  }, [token]);

  return <div>{loading && <p>Loading...</p>}</div>;
};

export default AuthRedirect;
