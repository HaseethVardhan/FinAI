import React, { useState } from "react";
import { Shield } from "lucide-react";
import Button from "../uiComponents/Button";
import axios from "axios";
import { replace, useNavigate } from "react-router-dom"; // ✅ Import navigate
const InsurancePage: React.FC = () => {
  const navigate = useNavigate(); // ✅ hook for navigation
  const [error, setError] = useState(""); // error state
  const [insuranceData, setInsuranceData] = useState({
    lifeInsurance: {
      coverageAmount: "",
      premium: "",
    },
    healthInsurance: {
      coverageAmount: "",
      premium: "",
    },
  });

  const handleLifeInsuranceChange = (field: string, value: string) => {
    if (Number(value) < 0) {
      setError("⚠️ Value cannot be negative.");
      return;
    }
    setError(""); // Clear error if value is valid
    setInsuranceData({
      ...insuranceData,
      lifeInsurance: {
        ...insuranceData.lifeInsurance,
        [field]: value,
      },
    });
  };

  const handleHealthInsuranceChange = (field: string, value: string) => {
    if (Number(value) < 0) {
      setError("⚠️ Value cannot be negative.");
      return;
    }
    setError(""); // Clear error if value is valid
    setInsuranceData({
      ...insuranceData,
      healthInsurance: {
        ...insuranceData.healthInsurance,
        [field]: value,
      },
    });
  };

  // Utility to check if all values inside an object are empty strings
  const isEmpty = (obj: Record<string, string>) => {
    return Object.values(obj).every((val) => val === "");
  };

  const handleSaveChanges = async() => {
    if (
      isEmpty(insuranceData.lifeInsurance) &&
      isEmpty(insuranceData.healthInsurance)
    ) {
      setError("⚠️ Please fill at least one field before saving.");
      return;
    }

    setError(""); // clear error

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/updateInsurance`,
      {
        lifeInsurance: insuranceData.lifeInsurance,
        healthInsurance: insuranceData.healthInsurance,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    navigate("/dependents", { replace: true });
  };

  const handleSkip = () => {
    navigate("/dependents", { replace: true }); // Navigate to Dependents page after saving
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 font-inter">
      <div className="max-w-md w-full mt-10 mb-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
            Insurance
          </h2>
          <p className="text-gray-400 font-inter">Protect what matters most</p>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-400 font-semibold text-center font-poppins">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Life Insurance */}
          <div className="p-4">
            <h3 className="text-white font-semibold mb-4 font-poppins">
              Life Insurance
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 font-inter">
                  Coverage Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={insuranceData.lifeInsurance.coverageAmount}
                    onChange={(e) =>
                      handleLifeInsuranceChange(
                        "coverageAmount",
                        e.target.value
                      )
                    }
                    placeholder="Enter coverage amount"
                    className={`w-full bg-dark-3 border-dark-2 text-white px-8 py-3 rounded-lg border  focus:border-primary focus:outline-none transition-colors font-poppins`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 font-inter">
                  Monthly Premium
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={insuranceData.lifeInsurance.premium}
                    onChange={(e) =>
                      handleLifeInsuranceChange("premium", e.target.value)
                    }
                    placeholder="Enter monthly premium"
                    className={`w-full bg-dark-3 border-dark-2 text-white px-8 py-3 rounded-lg border  focus:border-primary focus:outline-none transition-colors font-poppins`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Health Insurance */}
          <div className="p-4">
            <h3 className="text-white font-semibold mb-4 font-poppins">
              Health Insurance
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 font-inter">
                  Coverage Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={insuranceData.healthInsurance.coverageAmount}
                    onChange={(e) =>
                      handleHealthInsuranceChange(
                        "coverageAmount",
                        e.target.value
                      )
                    }
                    placeholder="Enter coverage amount"
                    className={`w-full bg-dark-3 border-dark-2 text-white px-8 py-3 rounded-lg border  focus:border-primary focus:outline-none transition-colors font-poppins`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 font-inter">
                  Monthly Premium
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={insuranceData.healthInsurance.premium}
                    onChange={(e) =>
                      handleHealthInsuranceChange("premium", e.target.value)
                    }
                    placeholder="Enter monthly premium"
                    className={`w-full bg-dark-3 border-dark-2 text-white px-8 py-3 rounded-lg border  focus:border-primary focus:outline-none transition-colors font-poppins`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <Button text="Save Changes" onClick={handleSaveChanges} />
        </div>
        {/* Skip Button */}
        <div className="mt-8">
          <Button
            text="Skip"
            onClick={handleSkip}
            bgColor="bg-dark-3"
            hoverColor="bg-dark-2"
          />
        </div>
      </div>
    </div>
  );
};

export default InsurancePage;
