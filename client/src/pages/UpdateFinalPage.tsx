import React, { useState } from "react";
import { PiggyBank, TrendingUp } from "lucide-react";
import Button from "../uiComponents/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FinalPage: React.FC = () => {
  const [finalData, setFinalData] = useState({
    emergencyFund: "",
    creditScore: "",
  });
  const [error, setError] = useState(""); // error state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (Number(value) < 0) {
      setError("Value cannot be negative.");
    } else {
      setError("");
      setFinalData({
        ...finalData,
        [name]: value,
      });
    }
  };

  const navigate = useNavigate();

  const handleSaveChanges = async () => {
    if (!finalData.emergencyFund && !finalData.creditScore) {
      setError("Please fill at least one field before saving.");
      return;
    }
    setError("");

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/updateOtherDetails`,
      {
        emergencyFund: finalData.emergencyFund,
        creditScore: finalData.creditScore,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const stat = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/changeStatus`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response);
    navigate("/");
  };
  const handleSkip = () => {
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 font-poppins">
      <div className="max-w-md w-full mb-10 mt-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <PiggyBank size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-inter">
            Final Details
          </h2>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-400 font-semibold text-center font-poppins">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Emergency Fund */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Emergency Fund
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ₹
              </span>
              <input
                type="number"
                name="emergencyFund"
                value={finalData.emergencyFund}
                onChange={handleInputChange}
                placeholder="Enter your emergency fund amount"
                className="w-full bg-gray-800 text-white px-8 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition-colors font-poppins"
              />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Amount you have set aside for emergencies
            </p>
          </div>

          {/* Credit Score */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Credit Score
            </label>
            <div className="relative">
              <TrendingUp
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="number"
                name="creditScore"
                value={finalData.creditScore}
                onChange={handleInputChange}
                placeholder="Enter your credit score"
                min="300"
                max="850"
                className="w-full bg-gray-800 text-white px-12 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition-colors font-poppins"
              />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Range: 300-850 (leave blank if unknown)
            </p>
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

export default FinalPage;
