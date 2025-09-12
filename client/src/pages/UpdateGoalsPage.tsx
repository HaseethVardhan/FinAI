import React, { useState } from "react";
import { Target, Plus, Trash2, Edit2 } from "lucide-react";
import Button from "../uiComponents/Button";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  timeframe: string;
  priority: string;
}

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    timeframe: "",
    priority: "",
  });
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState({
    name: "",
    targetAmount: "",
    timeframe: "",
    priority: "",
  });

  const addGoal = () => {
    if (
      newGoal.name &&
      newGoal.targetAmount &&
      newGoal.timeframe &&
      newGoal.priority
    ) {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        timeframe: newGoal.timeframe,
        priority: newGoal.priority,
      };
      setGoals([...goals, goal]);
      setNewGoal({ name: "", targetAmount: "", timeframe: "", priority: "" });
      setIsAddingGoal(false);
    }
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const startEditing = (goal: Goal) => {
    setEditingId(goal.id);
    setEditingGoal({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      timeframe: goal.timeframe,
      priority: goal.priority,
    });
  };

  const saveEdit = () => {
    if (
      editingGoal.name &&
      editingGoal.targetAmount &&
      editingGoal.timeframe &&
      editingGoal.priority
    ) {
      setGoals(
        goals.map((goal) =>
          goal.id === editingId
            ? {
                ...goal,
                name: editingGoal.name,
                targetAmount: parseFloat(editingGoal.targetAmount),
                timeframe: editingGoal.timeframe,
                priority: editingGoal.priority,
              }
            : goal
        )
      );
      setEditingId(null);
      setEditingGoal({
        name: "",
        targetAmount: "",
        timeframe: "",
        priority: "",
      });
    }
  };

  const handleSaveChanges = () => {
    console.log("Goals Data:", goals);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };
  const handleSkip = () => {};

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 font-inter">
      <div className="max-w-md w-full mb-10">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
            Financial Goals
          </h2>
          <p className="text-gray-400">Set your financial objectives</p>
        </div>

        {goals.length === 0 && !isAddingGoal && (
          <div className="text-center py-8 mb-6">
            <p className="text-gray-400 mb-4">No financial goals set yet</p>
            <p className="text-gray-500 text-sm">
              Start by adding your first financial goal
            </p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {isAddingGoal && (
            <div className=" bg-dark-3 p-4 rounded-lg border border-dark-2 mb-3 ">
              <h3 className="text-white font-semibold mb-3 font-poppins">
                Add Financial Goal
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Goal Name (e.g., Emergency Fund, House Down Payment)"
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, name: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-inter"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Target Amount"
                    value={newGoal.targetAmount}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, targetAmount: e.target.value })
                    }
                    className="w-full bg-gray-700 text-white px-8 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-inter"
                  />
                </div>
                <select
                  value={newGoal.timeframe}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, timeframe: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-inter"
                >
                  <option value="">Select Timeframe</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="5 years">5 years</option>
                  <option value="10 years">10 years</option>
                  <option value="Long term">Long term</option>
                </select>
                <select
                  value={newGoal.priority}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, priority: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-inter"
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <button
                onClick={addGoal}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors mt-3 font-poppins"
              >
                Add Goal
              </button>
            </div>
          )}

          {!isAddingGoal && (
            <button
              onClick={() => setIsAddingGoal(true)}
              className="w-full bg-gray-800 text-green-500 py-3 px-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 font-poppins"
            >
              <Plus size={20} />
              <span>Add Financial Goal</span>
            </button>
          )}
        </div>

        <div className="space-y-3 mb-8">
          {goals.length > 0 && (
            <h3 className="text-white font-semibold font-poppins">
              Your Goals
            </h3>
          )}
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              {editingId === goal.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Goal Name"
                    value={editingGoal.name}
                    onChange={(e) =>
                      setEditingGoal({ ...editingGoal, name: e.target.value })
                    }
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-inter"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="Target Amount"
                      value={editingGoal.targetAmount}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          targetAmount: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 text-white px-8 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-inter"
                    />
                  </div>
                  <select
                    value={editingGoal.timeframe}
                    onChange={(e) =>
                      setEditingGoal({
                        ...editingGoal,
                        timeframe: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-inter"
                  >
                    <option value="">Select Timeframe</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                    <option value="2 years">2 years</option>
                    <option value="5 years">5 years</option>
                    <option value="10 years">10 years</option>
                    <option value="Long term">Long term</option>
                  </select>
                  <select
                    value={editingGoal.priority}
                    onChange={(e) =>
                      setEditingGoal({
                        ...editingGoal,
                        priority: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-inter"
                  >
                    <option value="">Select Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors font-poppins"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors font-poppins"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-white font-medium font-poppins">
                        {goal.name}
                      </p>
                      <p className="text-indigo-400 font-semibold font-inter">
                        ${goal.targetAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(goal)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 font-inter">
                      {goal.timeframe}
                    </span>
                    <span
                      className={`font-medium ${getPriorityColor(
                        goal.priority
                      )} font-poppins`}
                    >
                      {goal.priority} Priority
                    </span>
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

export default GoalsPage;
