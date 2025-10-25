import React, { useState } from "react";
import { IndianRupee, Plus, Trash2, Edit2 } from "lucide-react";
import Button from "../uiComponents/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface IncomeSource {
  id: string;
  name: string;
  amount: number;
}

const IncomeSourcesPage: React.FC = () => {
  const navigate = useNavigate(); // ✅ hook for navigation
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [newSource, setNewSource] = useState({ name: "", amount: "" });
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSource, setEditingSource] = useState({ name: "", amount: "" });
  const [error, setError] = useState(""); // error state

  // 🔹 Validation for source name
  const isValidName = (name: string) => {
    const regex = /^[A-Za-z][A-Za-z_]*$/; // must start with letter, only letters + underscores
    return regex.test(name);
  };

  // 🔹 Add income source
  const addIncomeSource = () => {
    if (!newSource.name || !newSource.amount) {
      setError("⚠️ Please fill in all fields.");
      return;
    }
    if (!isValidName(newSource.name)) {
      setError(
        "⚠️ Source name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(newSource.amount) < 0) {
      setError("⚠️ Amount cannot be negative.");
      return;
    }

    const source: IncomeSource = {
      id: Date.now().toString(),
      name: newSource.name,
      amount: parseFloat(newSource.amount),
    };
    setIncomeSources([...incomeSources, source]);
    setNewSource({ name: "", amount: "" });
    setIsAddingSource(false);
    setError(""); // clear error after adding
  };

  const removeIncomeSource = (id: string) => {
    setIncomeSources(incomeSources.filter((source) => source.id !== id));
  };

  const startEditing = (source: IncomeSource) => {
    setEditingId(source.id);
    setEditingSource({ name: source.name, amount: source.amount.toString() });
  };

  // 🔹 Save edited income source
  const saveEdit = () => {
    if (!editingSource.name || !editingSource.amount) {
      setError("⚠️ Please fill in all fields.");
      return;
    }
    if (!isValidName(editingSource.name)) {
      setError(
        "⚠️ Source name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(editingSource.amount) < 0) {
      setError("⚠️ Amount cannot be negative.");
      return;
    }

    setIncomeSources(
      incomeSources.map((source) =>
        source.id === editingId
          ? {
              ...source,
              name: editingSource.name,
              amount: parseFloat(editingSource.amount),
            }
          : source
      )
    );
    setEditingId(null);
    setEditingSource({ name: "", amount: "" });
    setError(""); // clear error after edit
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingSource({ name: "", amount: "" });
  };

  const handleSaveChanges = async () => {
    if (incomeSources.length === 0) {
      setError("⚠️ Please add at least one income source before saving.");
      return;
    }
    setError("");
    console.log("Income Sources:", incomeSources);

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/updateIncomeDetails`,
      {
        incomeDetails: incomeSources,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(response);

    navigate("/expenses", { replace: true });
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 font-inter">
      <div className="max-w-md w-full mt-10 mb-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
            <IndianRupee size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
            Income Sources
          </h2>
          <p className="text-gray-400 font-inter">Add your income sources</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-400 font-semibold text-center font-poppins">
            {error}
          </div>
        )}

        {/* Empty State */}
        {incomeSources.length === 0 && !isAddingSource && (
          <div className="text-center py-8 mb-6">
            <p className="text-gray-400 mb-4 font-inter">
              No income sources added yet
            </p>
            <p className="text-gray-500 text-sm font-inter">
              Start by adding your first income source
            </p>
          </div>
        )}

        {/* Add Source Form */}
        <div className="space-y-4 mb-6">
          {isAddingSource && (
            <div className="bg-dark-3 p-4 rounded-lg border border-dark-2">
              <h3 className="text-white font-semibold mb-3 font-poppins">
                Add Income Source
              </h3>
              <input
                type="text"
                placeholder="Source Name"
                value={newSource.name}
                onChange={(e) =>
                  setNewSource({ ...newSource, name: e.target.value })
                }
                className="w-full bg-dark-2 text-white px-3 py-2 rounded-lg border border-dark-4 focus:border-primary focus:outline-none mb-3 font-poppins"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Amount"
                  value={newSource.amount}
                  onChange={(e) =>
                    setNewSource({ ...newSource, amount: e.target.value })
                  }
                  className="w-full bg-dark-2 text-white px-8 py-2 rounded-lg border border-dark-4 focus:border-primary focus:outline-none font-poppins"
                />
              </div>
              <button
                onClick={addIncomeSource}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors mt-3 font-poppins"
              >
                Add Source
              </button>
            </div>
          )}

          {!isAddingSource && (
            <button
              onClick={() => setIsAddingSource(true)}
              className="w-full bg-dark-3 text-primary py-3 px-4 rounded-lg border border-dark-2 hover:bg-dark-2 transition-colors flex items-center justify-center space-x-2 font-poppins"
            >
              <Plus size={20} />
              <span>Add Income Source</span>
            </button>
          )}
        </div>

        {/* List of Sources */}
        <div className="space-y-3 mb-8">
          {incomeSources.length > 0 && (
            <h3 className="text-white font-semibold font-poppins">
              Your Income Sources
            </h3>
          )}
          {incomeSources.map((source) => (
            <div
              key={source.id}
              className="bg-dark-3 p-4 rounded-lg border border-dark-2 hover:border-dark-4 transition-colors"
            >
              {editingId === source.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingSource.name}
                    onChange={(e) =>
                      setEditingSource({
                        ...editingSource,
                        name: e.target.value,
                      })
                    }
                    className="w-full bg-dark-2 text-white px-3 py-2 rounded-lg border border-dark-4 focus:border-primary focus:outline-none font-poppins"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={editingSource.amount}
                      onChange={(e) =>
                        setEditingSource({
                          ...editingSource,
                          amount: e.target.value,
                        })
                      }
                      className="w-full bg-dark-2 text-white px-8 py-2 rounded-lg border border-dark-4 focus:border-primary focus:outline-none font-poppins"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors font-poppins"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-dark-4 text-white py-2 px-4 rounded-lg font-semibold hover:bg-dark-2 transition-colors font-poppins"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium font-poppins">
                      {source.name}
                    </p>
                    <p className="text-success-light font-semibold font-inter">
                      ₹{source.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(source)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => removeIncomeSource(source.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <Button text="Save Changes" onClick={handleSaveChanges} />
        </div>
      </div>
    </div>
  );
};

export default IncomeSourcesPage;
