import React, { useState } from "react";
import { Users, Plus, Trash2, Edit2 } from "lucide-react";
import Button from "../uiComponents/Button";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate

interface Dependent {
  id: string;
  name: string;
  age: number;
  relationship: string;
}

const DependentsPage: React.FC = () => {
  const navigate = useNavigate(); // ✅ hook for navigation
  const [dependentsData, setDependentsData] = useState({
    count: 0,
    dependents: [] as Dependent[],
  });

  const [newDependent, setNewDependent] = useState({
    name: "",
    age: "",
    relationship: "",
  });
  const [isAddingDependent, setIsAddingDependent] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDependent, setEditingDependent] = useState({
    name: "",
    age: "",
    relationship: "",
  });
  const [error, setError] = useState(""); // error state
  const isValidName = (name: string) => {
    const regex = /^[A-Za-z][A-Za-z_]*$/; // must start with letter, only letters + underscores
    return regex.test(name);
  };

  const addDependent = () => {
    if (!newDependent.name || !newDependent.age || !newDependent.relationship) {
      setError("⚠️ Please fill in all fields.");
      return;
    }
    if (!isValidName(newDependent.name)) {
      setError(
        "⚠️ Source name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(newDependent.age) < 0) {
      setError("⚠️ Age cannot be negative.");
      return;
    }
    if (newDependent.name && newDependent.age && newDependent.relationship) {
      const dependent: Dependent = {
        id: Date.now().toString(),
        name: newDependent.name,
        age: parseInt(newDependent.age),
        relationship: newDependent.relationship,
      };
      const updatedDependents = [...dependentsData.dependents, dependent];
      setDependentsData({
        dependents: updatedDependents,
        count: updatedDependents.length,
      });
      setNewDependent({ name: "", age: "", relationship: "" });
      setIsAddingDependent(false);
    }
    setError(""); // Clear error if all validations pass
  };

  const removeDependent = (id: string) => {
    const updatedDependents = dependentsData.dependents.filter(
      (dep) => dep.id !== id
    );
    setDependentsData({
      dependents: updatedDependents,
      count: updatedDependents.length,
    });
  };

  const startEditing = (dependent: Dependent) => {
    setEditingId(dependent.id);
    setEditingDependent({
      name: dependent.name,
      age: dependent.age.toString(),
      relationship: dependent.relationship,
    });
  };

  const saveEdit = () => {
    if (!newDependent.name || !newDependent.age || !newDependent.relationship) {
      setError("⚠️ Please fill in all fields.");
      return;
    }
    if (!isValidName(newDependent.name)) {
      setError(
        "⚠️ Source name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(newDependent.age) < 0) {
      setError("⚠️ Age cannot be negative.");
      return;
    }
    if (
      editingDependent.name &&
      editingDependent.age &&
      editingDependent.relationship
    ) {
      const updatedDependents = dependentsData.dependents.map((dep) =>
        dep.id === editingId
          ? {
              ...dep,
              name: editingDependent.name,
              age: parseInt(editingDependent.age),
              relationship: editingDependent.relationship,
            }
          : dep
      );
      setDependentsData({
        dependents: updatedDependents,
        count: updatedDependents.length,
      });
      setEditingId(null);
      setEditingDependent({ name: "", age: "", relationship: "" });
    }
    setError(""); // Clear error if all validations pass
  };

  const handleSaveChanges = () => {
    if (dependentsData.count === 0) {
      setError(
        "⚠️ Please add at least one dependent or click Skip to proceed."
      );
      return;
    }
    setError(""); // Clear any existing errors
    console.log("Dependents Data:", dependentsData);
    navigate("/final", { replace: true }); // Navigate to final page after saving
  };

  const handleSkip = () => {
    navigate("/final", { replace: true }); // Navigate to final page after saving
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full mt-10 mb-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
            Dependents
          </h2>
          <p className="text-gray-400 font-inter">
            Tell us about your dependents
          </p>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-400 font-semibold text-center font-poppins">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="space-y-4 mb-6">
          <div className="text-center">
            <p className="text-white text-lg font-semibold font-poppins">
              Total Dependents:{" "}
              <span className="text-green-500 font-inter">
                {dependentsData.count}
              </span>
            </p>
          </div>

          {dependentsData.dependents.length === 0 && !isAddingDependent && (
            <div className="text-center py-8 mb-6">
              <p className="text-gray-400 mb-4 font-inter">
                No dependents added yet
              </p>
              <p className="text-gray-500 text-sm font-inter">
                Add your first dependent to get started
              </p>
            </div>
          )}

          {/* Add Dependent Form */}
          {isAddingDependent && (
            <div className="bg-dark-3 p-4 rounded-lg border border-dark-2 mb-3">
              <h3 className="text-white font-semibold mb-3 font-poppins">
                Add Dependent
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newDependent.name}
                  onChange={(e) =>
                    setNewDependent({ ...newDependent, name: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg 
                             border border-gray-600 focus:border-green-500 
                             focus:outline-none font-inter"
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={newDependent.age}
                  onChange={(e) =>
                    setNewDependent({ ...newDependent, age: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg 
                             border border-gray-600 focus:border-green-500 
                             focus:outline-none font-inter"
                />
                <select
                  value={newDependent.relationship}
                  onChange={(e) =>
                    setNewDependent({
                      ...newDependent,
                      relationship: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg 
                             border border-gray-600 focus:border-green-500 
                             focus:outline-none font-inter"
                >
                  <option value="">Select Relationship</option>
                  <option value="Child">Child</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button
                onClick={addDependent}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg 
                           font-semibold hover:bg-green-600 transition-colors mt-3 
                           font-poppins"
              >
                Add Dependent
              </button>
            </div>
          )}

          {!isAddingDependent && (
            <button
              onClick={() => setIsAddingDependent(true)}
              className="w-full bg-gray-800 text-green-500 py-3 px-4 rounded-lg 
                         border border-gray-700 hover:bg-gray-700 transition-colors 
                         flex items-center justify-center space-x-2 font-poppins"
            >
              <Plus size={20} />
              <span>Add Dependent</span>
            </button>
          )}
        </div>

        {/* Dependents List */}
        <div className="space-y-3 mb-8">
          {dependentsData.dependents.length > 0 && (
            <h3 className="text-white font-semibold font-poppins">
              Your Dependents
            </h3>
          )}
          {dependentsData.dependents.map((dependent) => (
            <div
              key={dependent.id}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700 
                         hover:border-gray-600 transition-colors"
            >
              {editingId === dependent.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={editingDependent.name}
                    onChange={(e) =>
                      setEditingDependent({
                        ...editingDependent,
                        name: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg 
                               border border-gray-600 focus:border-green-500 
                               focus:outline-none font-inter"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={editingDependent.age}
                    onChange={(e) =>
                      setEditingDependent({
                        ...editingDependent,
                        age: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg 
                               border border-gray-600 focus:border-green-500 
                               focus:outline-none font-inter"
                  />
                  <select
                    value={editingDependent.relationship}
                    onChange={(e) =>
                      setEditingDependent({
                        ...editingDependent,
                        relationship: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg 
                               border border-gray-600 focus:border-green-500 
                               focus:outline-none font-inter"
                  >
                    <option value="">Select Relationship</option>
                    <option value="Child">Child</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg 
                                 font-semibold hover:bg-green-600 transition-colors 
                                 font-poppins"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg 
                                 font-semibold hover:bg-gray-700 transition-colors 
                                 font-poppins"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium font-poppins">
                      {dependent.name}
                    </p>
                    <p className="text-pink-400 text-sm font-semibold font-inter">
                      {dependent.relationship} • Age {dependent.age}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(dependent)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => removeDependent(dependent.id)}
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

export default DependentsPage;
