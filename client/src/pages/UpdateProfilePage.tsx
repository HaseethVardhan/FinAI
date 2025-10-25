import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate
import Button from "../uiComponents/Button";
import axios from "axios";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate(); // ✅ hook for navigation

  const [formData, setFormData] = useState({
    username: "",
    age: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    age: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error as user types
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSaveChanges = async () => {
    let newErrors = { username: "", age: "" };
    let isValid = true;

    // Username check
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else {
      const usernameRegex = /^[A-Za-z][A-Za-z_]*$/;
      if (!usernameRegex.test(formData.username)) {
        newErrors.username =
          "Username must start with a letter and contain only letters or underscores";
        isValid = false;
      }
    }

    // Age check
    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
      isValid = false;
    } else {
      const ageValue = Number(formData.age);
      if (isNaN(ageValue) || ageValue < 16 || ageValue > 60) {
        newErrors.age = "Age must be between 16 and 60";
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (!isValid) return;

    console.log("Profile Data:", formData);

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/updateUserNameAndAge`,
      {
        username: formData.username,
        age: formData.age,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(response);

    navigate("/income-sources", { replace: true });
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 font-inter">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Create Your Profile
          </h2>
          <p
            className="text-gray-400"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Tell us about yourself
          </p>
        </div>

        <div className="space-y-4">
          {/* Username */}
          <div>
            <label
              className="block text-gray-300 text-sm font-medium mb-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className={`w-full bg-dark-3 text-white px-4 py-3 rounded-lg border ${
                errors.username ? "border-red-500" : "border-dark-2"
              } focus:border-primary focus:outline-none transition-colors pr-12`}
              style={{ fontFamily: "var(--font-poppins)" }}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label
              className="block text-gray-300 text-sm font-medium mb-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Enter your age"
              className={`w-full bg-dark-3 text-white px-4 py-3 rounded-lg border ${
                errors.age ? "border-red-500" : "border-dark-2"
              } focus:border-primary focus:outline-none transition-colors`}
              style={{ fontFamily: "var(--font-poppins)" }}
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <Button
            text="Save Changes"
            onClick={handleSaveChanges}
            bgColor="bg-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
