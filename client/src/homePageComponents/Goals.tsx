// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Target, X } from "lucide-react";
import JarCard from "./JarCard";

// NOTE: adjust API_BASE if your backend lives on a different path
const API_BASE = "/api"; // -> GET: /api/getGoals, POST: /api/createGoals, DELETE: /api/goals/:id

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
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    goal_name: "",
    total_amount: "",
    remaining_amount: "",
  });

  // Map backend goal shape to frontend Goal
  const mapBackendToGoal = (b: any): Goal => ({
    id: b._id || Date.now().toString(),
    goal_name: b.goalType || b.goal_name || "Untitled Goal",
    total_amount:
      typeof b.targetAmount === "number"
        ? b.targetAmount
        : parseFloat(b.targetAmount || "0"),
    // backend has currentAmount; remaining = target - current
    remaining_amount:
      typeof b.currentAmount === "number"
        ? Math.max((b.targetAmount || 0) - b.currentAmount, 0)
        : typeof b.remainingAmount === "number"
        ? b.remainingAmount
        : parseFloat(b.remainingAmount || "0"),
    created_at: b.deadline || b.created_at || undefined,
  });

  // Fetch goals from backend (axios)
  const fetchGoals = async () => {
    setIsFetching(true);
    setError(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/getGoals`, {},{
        headers: {
          Authorization : `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Expecting a response like:
      // { statusCode:200, message: 'Goals fetched successfully', data: [ ... ] }
      if (Array.isArray(res.data?.data)) {
        const mapped = res.data.data.map(mapBackendToGoal);
        setGoals(mapped);
      } else {
        throw new Error("Unexpected response format from server");
      }
    } catch (err: any) {
      console.error("Error fetching goals:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch goals");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    // load on mount
    fetchGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add new goal (POST to backend createGoals)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      goals: [
      {
        goalType: formData.goal_name,
        targetAmount: parseFloat(formData.total_amount) || 0,
        currentAmount: (parseFloat(formData.total_amount) || 0) - (parseFloat(formData.remaining_amount) || 0),
        deadline: new Date().toISOString(), // add a date picker in the form to set this
        priority: 'medium', // add a priority selector in the form (low/medium/high)
      },
      ...goals.map(goal => ({
        goalType: goal.goal_name,
        targetAmount: goal.total_amount,
        currentAmount: goal.total_amount - goal.remaining_amount,
        deadline: goal.created_at || new Date().toISOString(),
        priority: 'medium'
      }))
      ]
    };

    // optimistic UI: create a temporary goal to show immediately
    const tempGoal: Goal = {
      id: `temp-${Date.now()}`,
      goal_name: payload.goalType,
      total_amount: payload.targetAmount,
      remaining_amount: Math.max(payload.targetAmount - (payload.currentAmount || 0), 0),
      created_at: new Date().toISOString(),
    };

    setGoals((prev) => [tempGoal, ...prev]);
    setFormData({ goal_name: "", total_amount: "", remaining_amount: "" });
    setShowAddModal(false);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/createGoals`, payload, {
        headers: {
          Authorization : `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log(res);

      // If backend returns created goal(s), replace the temp goal with the real one
      const created = res.data?.data && Array.isArray(res.data.data) ? res.data.data[0] : res.data?.data;

      if (created) {
        const mapped = mapBackendToGoal(created);
        setGoals((prev) => [mapped, ...prev.filter((g) => g.id !== tempGoal.id)]);
      } else {
        // if backend doesn't return created object, just refresh list
        fetchGoals();
      }
    } catch (err: any) {
      console.error("Failed to create goal on server", err);
      // remove temp goal on failure
      setGoals((prev) => prev.filter((g) => g.id !== tempGoal.id));
      alert(err.response?.data?.message || "Failed to create goal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete goal (axios)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    const previous = goals;
    setGoals((g) => g.filter((goal) => goal.id !== id));

    try {
      // call delete: adjust backend route if different
      await axios.delete(`${API_BASE}/goals/${id}`, { withCredentials: true });
    } catch (err: any) {
      console.error("Failed to delete goal on server, reverting locally", err);
      setGoals(previous);
      alert(err.response?.data?.message || "Failed to delete goal on server. Please try again.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Financial Goals</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => fetchGoals()} className="px-3 py-2 border rounded-lg hover:bg-gray-50">Refresh</button>
            <button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              <Plus className="w-5 h-5" />
              Add New Goal
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" /> Existing Goals
            </h2>
          </div>

          {isFetching ? (
            <div className="py-12 text-center">Loading goals...</div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">{error}</div>
          ) : goals.length === 0 ? (
            <div className="py-12 sm:py-16 text-center">
              <Target className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">No goals yet. Start by adding your first financial goal!</p>
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
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Add New Goal</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name <span className="text-red-500">*</span></label>
                <input type="text" required value={formData.goal_name} onChange={(e) => setFormData({ ...formData, goal_name: e.target.value })} className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Emergency Fund" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount <span className="text-red-500">*</span></label>
                <input type="number" required min="0" step="0.01" value={formData.total_amount} onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })} className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remaining Amount <span className="text-red-500">*</span></label>
                <input type="number" required min="0" step="0.01" value={formData.remaining_amount} onChange={(e) => setFormData({ ...formData, remaining_amount: e.target.value })} className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? "Adding..." : "Add Goal"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
