import React, { useState } from "react";
import { Wallet, Plus, Trash2, Edit2 } from "lucide-react";
import Button from "../uiComponents/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Investment {
  id: string;
  name: string;
  amount: number;
}

const AssetsPage: React.FC = () => {
  const navigate = useNavigate(); // ✅ hook for navigation
  const [assetsData, setAssetsData] = useState({
    bankBalance: "",
    investments: [] as Investment[],
    otherAssets: [] as Investment[],
  });

  const [newInvestment, setNewInvestment] = useState({ name: "", amount: "" });
  const [newOtherAsset, setNewOtherAsset] = useState({ name: "", amount: "" });
  const [isAddingInvestment, setIsAddingInvestment] = useState(false);
  const [isAddingOtherAsset, setIsAddingOtherAsset] = useState(false);
  const [editingInvestmentId, setEditingInvestmentId] = useState<string | null>(
    null
  );
  const [editingOtherAssetId, setEditingOtherAssetId] = useState<string | null>(
    null
  );
  const [editingInvestment, setEditingInvestment] = useState({
    name: "",
    amount: "",
  });
  const [editingOtherAsset, setEditingOtherAsset] = useState({
    name: "",
    amount: "",
  });

  const [errors, setErrors] = useState({
    bankBalance: "",
  });
  const [err, setErr] = useState(""); // error state

  const isValidName = (name: string) => {
    const regex = /^[A-Za-z][A-Za-z_]*$/; // must start with letter, only letters + underscores
    return regex.test(name);
  };

  const addInvestment = () => {
    if (!newInvestment.name || !newInvestment.amount) {
      setErr("⚠️ Please fill in all fields.");
      return;
    }
    if (!isValidName(newInvestment.name)) {
      setErr(
        "⚠️ Source name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(newInvestment.amount) < 0) {
      setErr("⚠️ Amount cannot be negative.");
      return;
    }
    if (newInvestment.name && newInvestment.amount) {
      const investment: Investment = {
        id: Date.now().toString(),
        name: newInvestment.name,
        amount: parseFloat(newInvestment.amount),
      };
      setAssetsData({
        ...assetsData,
        investments: [...assetsData.investments, investment],
      });
      setNewInvestment({ name: "", amount: "" });
      setIsAddingInvestment(false);
    }
    setErr("");
  };

  const addOtherAsset = () => {
    if (!newOtherAsset.name || !newOtherAsset.amount) {
      setErr("⚠️ Please fill in all fields.");
      return;
    }
    if (!isValidName(newOtherAsset.name)) {
      setErr(
        "⚠️ Source name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(newOtherAsset.amount) < 0) {
      setErr("⚠️ Amount cannot be negative.");
      return;
    }
    if (newOtherAsset.name && newOtherAsset.amount) {
      const asset: Investment = {
        id: Date.now().toString(),
        name: newOtherAsset.name,
        amount: parseFloat(newOtherAsset.amount),
      };
      setAssetsData({
        ...assetsData,
        otherAssets: [...assetsData.otherAssets, asset],
      });
      setNewOtherAsset({ name: "", amount: "" });
      setIsAddingOtherAsset(false);
    }
    setErr("");
  };

  const removeInvestment = (id: string) => {
    setAssetsData({
      ...assetsData,
      investments: assetsData.investments.filter((inv) => inv.id !== id),
    });
  };

  const removeOtherAsset = (id: string) => {
    setAssetsData({
      ...assetsData,
      otherAssets: assetsData.otherAssets.filter((asset) => asset.id !== id),
    });
  };

  const startEditingInvestment = (investment: Investment) => {
    setEditingInvestmentId(investment.id);
    setEditingInvestment({
      name: investment.name,
      amount: investment.amount.toString(),
    });
  };

  const saveInvestmentEdit = () => {
    if (!editingInvestment.name || !editingInvestment.amount) {
      setErr("⚠️ Please fill in all fields.");
      return;
    }
    if (!isValidName(editingInvestment.name)) {
      setErr(
        "⚠️ Source name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(editingInvestment.amount) < 0) {
      setErr("⚠️ Amount cannot be negative.");
      return;
    }
    if (editingInvestment.name && editingInvestment.amount) {
      setAssetsData({
        ...assetsData,
        investments: assetsData.investments.map((inv) =>
          inv.id === editingInvestmentId
            ? {
                ...inv,
                name: editingInvestment.name,
                amount: parseFloat(editingInvestment.amount),
              }
            : inv
        ),
      });
      setEditingInvestmentId(null);
      setEditingInvestment({ name: "", amount: "" });
    }
    setErr("");
  };

  const startEditingOtherAsset = (asset: Investment) => {
    setEditingOtherAssetId(asset.id);
    setEditingOtherAsset({ name: asset.name, amount: asset.amount.toString() });
  };

  const saveOtherAssetEdit = () => {
    if (!editingOtherAsset.name || !editingOtherAsset.amount) {
      setErr("⚠️ Please fill in all fields.");
      return;
    }
    if (!isValidName(editingOtherAsset.name)) {
      setErr(
        "⚠️ Source name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(editingOtherAsset.amount) < 0) {
      setErr("⚠️ Amount cannot be negative.");
      return;
    }
    if (editingOtherAsset.name && editingOtherAsset.amount) {
      setAssetsData({
        ...assetsData,
        otherAssets: assetsData.otherAssets.map((asset) =>
          asset.id === editingOtherAssetId
            ? {
                ...asset,
                name: editingOtherAsset.name,
                amount: parseFloat(editingOtherAsset.amount),
              }
            : asset
        ),
      });
      setEditingOtherAssetId(null);
      setEditingOtherAsset({ name: "", amount: "" });
    }
    setErr("");
  };

  const handleSaveChanges = async () => {
    let valid = true;
    const newErrors = { bankBalance: "" };

    if (!assetsData.bankBalance) {
      newErrors.bankBalance = "Bank balance is required";
      valid = false;
    } else if (parseFloat(assetsData.bankBalance) < 0) {
      newErrors.bankBalance = "Bank balance cannot be negative";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/updateAssets`,
      {
        bankBalance: assetsData.bankBalance,
        investments: assetsData.investments,
        otherAssets: assetsData.otherAssets,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(response)
    navigate("/liabilities", { replace: true }); // ✅ Navigate to the liabilities page
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 font-inter ">
      <div className="max-w-md w-full mt-10 mb-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
            Assets
          </h2>
          <p className="text-gray-400 font-inter">Tell us about your assets</p>
        </div>

        <div className="space-y-6">
          {/* Bank Balance */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2 font-inter">
              Bank Balance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ₹
              </span>
              <input
                type="number"
                value={assetsData.bankBalance}
                onChange={(e) =>
                  setAssetsData({ ...assetsData, bankBalance: e.target.value })
                }
                placeholder="Enter your bank balance"
                className={`w-full bg-dark-3 text-white px-8 py-3 rounded-lg border ${
                  errors.bankBalance ? "border-red-500" : "border-dark-2"
                } focus:border-primary focus:outline-none transition-colors font-poppins`}
              />
            </div>
            {errors.bankBalance && (
              <p className="text-red-500 text-sm mt-1 font-inter">
                {errors.bankBalance}
              </p>
            )}
          </div>

          {/* Investments */}

          {/* Error Message */}
          {err && (
            <div className="mb-4 text-red-400 font-semibold text-center font-poppins">
              {err}
            </div>
          )}

          <div>
            <h3 className="text-white font-semibold mb-3 font-poppins">
              Investments
            </h3>
            {assetsData.investments.length === 0 && !isAddingInvestment && (
              <div className="text-center py-4 mb-3">
                <p className="text-gray-500 text-sm font-inter">
                  No investments added yet
                </p>
              </div>
            )}

            {isAddingInvestment && (
              <div className="bg-dark-3 p-4 rounded-lg border border-dark-2 mb-3">
                <input
                  type="text"
                  placeholder="Investment Name"
                  value={newInvestment.name}
                  onChange={(e) =>
                    setNewInvestment({ ...newInvestment, name: e.target.value })
                  }
                  className="w-full bg-dark-2 text-white px-3 py-2 rounded-lg border border-dark-2 focus:border-primary focus:outline-none mb-3 font-poppins"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newInvestment.amount}
                    onChange={(e) =>
                      setNewInvestment({
                        ...newInvestment,
                        amount: e.target.value,
                      })
                    }
                    className="w-full bg-dark-2 text-white px-8 py-2 rounded-lg border border-dark-2 focus:border-primary focus:outline-none font-poppins"
                  />
                </div>
                <button
                  onClick={addInvestment}
                  className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors mt-3 font-poppins"
                >
                  Add Investment
                </button>
              </div>
            )}

            {!isAddingInvestment && (
              <button
                onClick={() => setIsAddingInvestment(true)}
                className="w-full bg-dark-3 text-primary py-2 px-4 rounded-lg border border-dark-2 hover:bg-dark-2 transition-colors flex items-center justify-center space-x-2 mb-3 font-poppins"
              >
                <Plus size={18} />
                <span>Add Investment</span>
              </button>
            )}

            {assetsData.investments.map((investment) => (
              <div
                key={investment.id}
                className="bg-dark-3 p-3 rounded-lg border border-dark-2 hover:border-gray-600 transition-colors mb-2"
              >
                {editingInvestmentId === investment.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingInvestment.name}
                      onChange={(e) =>
                        setEditingInvestment({
                          ...editingInvestment,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-dark-2 text-white px-3 py-2 rounded-lg border border-dark-2 focus:border-primary focus:outline-none text-sm font-poppins"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={editingInvestment.amount}
                        onChange={(e) =>
                          setEditingInvestment({
                            ...editingInvestment,
                            amount: e.target.value,
                          })
                        }
                        className="w-full bg-dark-2 text-white px-8 py-2 rounded-lg border border-dark-2 focus:border-primary focus:outline-none text-sm font-poppins"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={saveInvestmentEdit}
                        className="flex-1 bg-primary text-white py-1 px-3 rounded text-sm hover:bg-primary-dark transition-colors font-poppins"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingInvestmentId(null)}
                        className="flex-1 bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-dark-2 transition-colors font-poppins"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium font-poppins">
                        {investment.name}
                      </p>
                      <p className="text-blue-400 text-sm font-semibold font-inter">
                        ₹{investment.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingInvestment(investment)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => removeInvestment(investment.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Other Assets */}
          <div>
            <h3 className="text-white font-semibold mb-3 font-poppins">
              Other Assets
            </h3>
            {assetsData.otherAssets.length === 0 && !isAddingOtherAsset && (
              <div className="text-center py-4 mb-3">
                <p className="text-gray-500 text-sm font-inter">
                  No other assets added yet
                </p>
              </div>
            )}

            {isAddingOtherAsset && (
              <div className="bg-dark-3 p-4 rounded-lg border border-dark-2 mb-3">
                <input
                  type="text"
                  placeholder="Asset Name"
                  value={newOtherAsset.name}
                  onChange={(e) =>
                    setNewOtherAsset({ ...newOtherAsset, name: e.target.value })
                  }
                  className="w-full bg-dark-2 text-white px-3 py-2 rounded-lg border border-dark-2 focus:border-primary focus:outline-none mb-3 font-poppins"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newOtherAsset.amount}
                    onChange={(e) =>
                      setNewOtherAsset({
                        ...newOtherAsset,
                        amount: e.target.value,
                      })
                    }
                    className="w-full bg-dark-2 text-white px-8 py-2 rounded-lg border border-dark-2 focus:border-primary focus:outline-none font-poppins"
                  />
                </div>
                <button
                  onClick={addOtherAsset}
                  className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors mt-3 font-poppins"
                >
                  Add Asset
                </button>
              </div>
            )}

            {!isAddingOtherAsset && (
              <button
                onClick={() => setIsAddingOtherAsset(true)}
                className="w-full bg-dark-3 text-primary py-2 px-4 rounded-lg border border-dark-2 hover:bg-dark-2 transition-colors flex items-center justify-center space-x-2 mb-3 font-poppins"
              >
                <Plus size={18} />
                <span>Add Other Asset</span>
              </button>
            )}

            {assetsData.otherAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-dark-3 p-3 rounded-lg border border-dark-2 hover:border-gray-600 transition-colors mb-2"
              >
                {editingOtherAssetId === asset.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingOtherAsset.name}
                      onChange={(e) =>
                        setEditingOtherAsset({
                          ...editingOtherAsset,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-dark-2 text-white px-3 py-2 rounded-lg border border-dark-2 focus:border-primary focus:outline-none text-sm font-poppins"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={editingOtherAsset.amount}
                        onChange={(e) =>
                          setEditingOtherAsset({
                            ...editingOtherAsset,
                            amount: e.target.value,
                          })
                        }
                        className="w-full bg-dark-2 text-white px-8 py-2 rounded-lg border border-dark-2 focus:border-primary focus:outline-none text-sm font-poppins"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={saveOtherAssetEdit}
                        className="flex-1 bg-primary text-white py-1 px-3 rounded text-sm hover:bg-green-600 transition-colors font-poppins"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingOtherAssetId(null)}
                        className="flex-1 bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700 transition-colors font-poppins"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium font-poppins">
                        {asset.name}
                      </p>
                      <p className="text-blue-400 text-sm font-semibold font-inter">
                        ₹{asset.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingOtherAsset(asset)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => removeOtherAsset(asset.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <Button text="Save Changes" onClick={handleSaveChanges} />
        </div>
      </div>
    </div>
  );
};

export default AssetsPage;
