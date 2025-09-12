import React, { useState } from "react";
import { CreditCard, Plus, Trash2, Edit2 } from "lucide-react";
import Button from "../uiComponents/Button";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate

interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
}

const ExpensesPage: React.FC = () => {
  const navigate = useNavigate(); // ✅ hook for navigation
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [newExpense, setNewExpense] = useState({ name: "", amount: "" });
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState({
    name: "",
    amount: "",
  });
  const [error, setError] = useState(""); // 🔹 error state

  // ✅ Validation helper
  const isValidCategoryName = (name: string) =>
    /^[A-Za-z][A-Za-z_]*$/.test(name);

  const addExpenseCategory = () => {
    if (!newExpense.name || !newExpense.amount) {
      setError("⚠️ Both fields are required.");
      return;
    }
    if (!isValidCategoryName(newExpense.name)) {
      setError(
        "⚠️ Category name must start with a letter and contain only alphabets or underscores."
      );
      return;
    }
    if (parseFloat(newExpense.amount) < 0) {
      setError("⚠️ Amount cannot be negative.");
      return;
    }

    const expense: ExpenseCategory = {
      id: Date.now().toString(),
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
    };

    setExpenseCategories([...expenseCategories, expense]);
    setNewExpense({ name: "", amount: "" });
    setIsAddingExpense(false);
    setError(""); // clear error
  };

  const removeExpenseCategory = (id: string) => {
    setExpenseCategories(
      expenseCategories.filter((expense) => expense.id !== id)
    );
  };

  const startEditing = (expense: ExpenseCategory) => {
    setEditingId(expense.id);
    setEditingExpense({
      name: expense.name,
      amount: expense.amount.toString(),
    });
  };

  const saveEdit = () => {
    if (!editingExpense.name || !editingExpense.amount) {
      setError("⚠️ Both fields are required.");
      return;
    }
    if (!isValidCategoryName(editingExpense.name)) {
      setError(
        "⚠️ Category name must start with a letter and contain only alphabets or underscores."
      );
      return;
    }
    if (parseFloat(editingExpense.amount) < 0) {
      setError("⚠️ Amount cannot be negative.");
      return;
    }

    setExpenseCategories(
      expenseCategories.map((expense) =>
        expense.id === editingId
          ? {
              ...expense,
              name: editingExpense.name,
              amount: parseFloat(editingExpense.amount),
            }
          : expense
      )
    );
    setEditingId(null);
    setEditingExpense({ name: "", amount: "" });
    setError(""); // clear error
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingExpense({ name: "", amount: "" });
  };

  const handleSaveChanges = () => {
    if (expenseCategories.length === 0) {
      setError("⚠️ Please add at least one expense category before saving.");
      return;
    }
    setError(""); // clear error
    console.log("Expense Categories:", expenseCategories);
    navigate("/assets", { replace: true }); // ✅ Navigate to Assets page
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 font-inter">
      <div className="max-w-md w-full mt-10 mb-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
            Expense Categories
          </h2>
          <p className="text-gray-400 font-inter">
            Track your spending categories
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-400 font-semibold text-center font-poppins">
            {error}
          </div>
        )}

        {/* Empty State */}
        {expenseCategories.length === 0 && !isAddingExpense && (
          <div className="text-center py-8 mb-6">
            <p className="text-gray-400 mb-4 font-inter">
              No expense categories added yet
            </p>
            <p className="text-gray-500 text-sm font-inter">
              Start by adding your first expense category
            </p>
          </div>
        )}

        {/* Add Category Form */}
        <div className="space-y-4 mb-6">
          {isAddingExpense && (
            <div className="bg-dark-3 p-4 rounded-lg border border-dark-2">
              <h3 className="text-white font-semibold mb-3 font-poppins">
                Add Expense Category
              </h3>
              <input
                type="text"
                placeholder="Category Name"
                value={newExpense.name}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, name: e.target.value })
                }
                className="w-full bg-dark-2 text-white px-3 py-2 rounded-lg border border-dark-4 focus:border-primary focus:outline-none mb-3 font-poppins"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Monthly Amount"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  className="w-full bg-dark-2 text-white px-8 py-2 rounded-lg border border-dark-4 focus:border-primary focus:outline-none font-poppins"
                />
              </div>
              <button
                onClick={addExpenseCategory}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors mt-3 font-poppins"
              >
                Add Category
              </button>
            </div>
          )}

          {!isAddingExpense && (
            <button
              onClick={() => setIsAddingExpense(true)}
              className="w-full bg-dark-3 text-primary py-3 px-4 rounded-lg border border-dark-2 hover:bg-dark-2 transition-colors flex items-center justify-center space-x-2 font-poppins"
            >
              <Plus size={20} />
              <span>Add Expense Category</span>
            </button>
          )}
        </div>

        {/* Expense List */}
        <div className="space-y-3 mb-8">
          {expenseCategories.length > 0 && (
            <h3 className="text-white font-semibold font-poppins">
              Your Expense Categories
            </h3>
          )}
          {expenseCategories.map((expense) => (
            <div
              key={expense.id}
              className="bg-dark-3 p-4 rounded-lg border border-dark-2 hover:border-dark-4 transition-colors"
            >
              {editingId === expense.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingExpense.name}
                    onChange={(e) =>
                      setEditingExpense({
                        ...editingExpense,
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
                      value={editingExpense.amount}
                      onChange={(e) =>
                        setEditingExpense({
                          ...editingExpense,
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
                      {expense.name}
                    </p>
                    <p className="text-red-400 font-semibold font-inter">
                      ₹{expense.amount.toFixed(2)}/month
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(expense)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => removeExpenseCategory(expense.id)}
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

export default ExpensesPage;
