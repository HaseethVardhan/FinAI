import { useState } from "react";
import { Plus, Target, X } from "lucide-react";
import JarCard from "./JarCard";

// Define the Goal type locally since Supabase is removed
interface Goal {
  id: string;
  goal_name: string;
  total_amount: number;
  remaining_amount: number;
  created_at?: string;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    goal_name: "",
    total_amount: "",
    remaining_amount: "",
  });

  // Add new goal (locally)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newGoal: Goal = {
      id: Date.now().toString(),
      goal_name: formData.goal_name,
      total_amount: parseFloat(formData.total_amount),
      remaining_amount: parseFloat(formData.remaining_amount),
      created_at: new Date().toISOString(),
    };

    setGoals([newGoal, ...goals]);
    setFormData({ goal_name: "", total_amount: "", remaining_amount: "" });
    setShowAddModal(false);
    setIsLoading(false);
  };

  // Delete goal locally
  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Financial Goals
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add New Goal
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Existing Goals
            </h2>
          </div>

          {goals.length === 0 ? (
            <div className="py-12 sm:py-16 text-center">
              <Target className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">
                No goals yet. Start by adding your first financial goal!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {goals.map((goal) => (
                <JarCard key={goal.id} goal={goal} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Add New Goal
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.goal_name}
                  onChange={(e) =>
                    setFormData({ ...formData, goal_name: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Emergency Fund"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.total_amount}
                  onChange={(e) =>
                    setFormData({ ...formData, total_amount: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remaining Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.remaining_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      remaining_amount: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Adding..." : "Add Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
