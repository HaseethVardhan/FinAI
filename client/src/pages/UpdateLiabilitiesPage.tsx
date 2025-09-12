import React, { useState } from "react";
import { AlertTriangle, Plus, Trash2, Edit2 } from "lucide-react";
import Button from "../uiComponents/Button";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate

interface Liability {
  id: string;
  name: string;
  amount: number;
}

const LiabilitiesPage: React.FC = () => {
  const navigate = useNavigate(); // ✅ hook for navigation
  const [liabilitiesData, setLiabilitiesData] = useState({
    loans: [] as Liability[],
    creditCards: [] as Liability[],
  });
  const [error, setError] = useState(""); // error state
  const [newLoan, setNewLoan] = useState({ name: "", amount: "" });
  const [newCreditCard, setNewCreditCard] = useState({ name: "", amount: "" });
  const [isAddingLoan, setIsAddingLoan] = useState(false);
  const [isAddingCreditCard, setIsAddingCreditCard] = useState(false);
  const [editingLoanId, setEditingLoanId] = useState<string | null>(null);
  const [editingCreditCardId, setEditingCreditCardId] = useState<string | null>(
    null
  );
  const [editingLoan, setEditingLoan] = useState({ name: "", amount: "" });
  const [editingCreditCard, setEditingCreditCard] = useState({
    name: "",
    amount: "",
  });

  const isValidName = (name: string) => {
    const regex = /^[A-Za-z][A-Za-z_]*$/; // must start with letter, only letters + underscores
    return regex.test(name);
  };

  // ----------------- Add / Remove / Edit Logic -----------------
  const addLoan = () => {
    if (!newLoan.name || !newLoan.amount) {
      setError("⚠️ Please fill in all fields.");
      return;
    }
    if (!isValidName(newLoan.name)) {
      setError(
        "⚠️ Source name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(newLoan.amount) < 0) {
      setError("⚠️ Amount cannot be negative.");
      return;
    }
    if (newLoan.name && newLoan.amount) {
      const loan: Liability = {
        id: Date.now().toString(),
        name: newLoan.name,
        amount: parseFloat(newLoan.amount),
      };
      setLiabilitiesData({
        ...liabilitiesData,
        loans: [...liabilitiesData.loans, loan],
      });
      setNewLoan({ name: "", amount: "" });
      setIsAddingLoan(false);
    }
    setError(""); // Clear error if all validations pass
  };

  const addCreditCard = () => {
    if (!newCreditCard.name || !newCreditCard.amount) {
      setError("⚠️ Please fill in all fields.");
      return;
    }
    if (!isValidName(newCreditCard.name)) {
      setError(
        "⚠️ Source name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(newCreditCard.amount) < 0) {
      setError("⚠️ Amount cannot be negative.");
      return;
    }
    if (newCreditCard.name && newCreditCard.amount) {
      const creditCard: Liability = {
        id: Date.now().toString(),
        name: newCreditCard.name,
        amount: parseFloat(newCreditCard.amount),
      };
      setLiabilitiesData({
        ...liabilitiesData,
        creditCards: [...liabilitiesData.creditCards, creditCard],
      });
      setNewCreditCard({ name: "", amount: "" });
      setIsAddingCreditCard(false);
    }
    setError(""); // Clear error if all validations pass
  };

  const removeLoan = (id: string) => {
    setLiabilitiesData({
      ...liabilitiesData,
      loans: liabilitiesData.loans.filter((loan) => loan.id !== id),
    });
  };

  const removeCreditCard = (id: string) => {
    setLiabilitiesData({
      ...liabilitiesData,
      creditCards: liabilitiesData.creditCards.filter((card) => card.id !== id),
    });
  };

  const startEditingLoan = (loan: Liability) => {
    setEditingLoanId(loan.id);
    setEditingLoan({ name: loan.name, amount: loan.amount.toString() });
  };

  const saveLoanEdit = () => {
    if (!editingLoan.name || !editingLoan.amount) {
      setError("⚠️ Please fill in all fields.");
      return;
    }
    if (!isValidName(editingLoan.name)) {
      setError(
        "⚠️ Source name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(editingLoan.amount) < 0) {
      setError("⚠️ Amount cannot be negative.");
      return;
    }
    if (editingLoan.name && editingLoan.amount) {
      setLiabilitiesData({
        ...liabilitiesData,
        loans: liabilitiesData.loans.map((loan) =>
          loan.id === editingLoanId
            ? {
                ...loan,
                name: editingLoan.name,
                amount: parseFloat(editingLoan.amount),
              }
            : loan
        ),
      });
      setEditingLoanId(null);
      setEditingLoan({ name: "", amount: "" });
    }
    setError(""); // Clear error if all validations pass
  };

  const startEditingCreditCard = (card: Liability) => {
    setEditingCreditCardId(card.id);
    setEditingCreditCard({ name: card.name, amount: card.amount.toString() });
  };

  const saveCreditCardEdit = () => {
    if (!editingCreditCard.name || !editingCreditCard.amount) {
      setError("⚠️ Please fill in all fields.");
      return;
    }
    if (!isValidName(editingCreditCard.name)) {
      setError(
        "⚠️ Source name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(editingCreditCard.amount) < 0) {
      setError("⚠️ Amount cannot be negative.");
      return;
    }
    if (editingCreditCard.name && editingCreditCard.amount) {
      setLiabilitiesData({
        ...liabilitiesData,
        creditCards: liabilitiesData.creditCards.map((card) =>
          card.id === editingCreditCardId
            ? {
                ...card,
                name: editingCreditCard.name,
                amount: parseFloat(editingCreditCard.amount),
              }
            : card
        ),
      });
      setEditingCreditCardId(null);
      setEditingCreditCard({ name: "", amount: "" });
    }
    setError(""); // Clear error if all validations pass
  };

  const handleSaveChanges = () => {
    if (
      liabilitiesData.loans.length === 0 &&
      liabilitiesData.creditCards.length === 0
    ) {
      setError("⚠️ Please fill at least one field before saving.");
      return;
    }
    setError(""); // clear error
    console.log("Liabilities Data:", liabilitiesData);
    navigate("/insurance", { replace: true }); // ✅ Navigate to the Insurance page
  };

  const handleSkip = () => {
    navigate("/insurance", { replace: true }); // ✅ Navigate to the Insurance page
  };

  // ----------------- JSX -----------------
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 font-inter">
      <div className="max-w-md w-full mt-10 mb-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
            Liabilities
          </h2>
          <p className="text-gray-400 font-inter">
            Track your debts and obligations
          </p>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-400 font-semibold text-center font-poppins">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Loans Section */}
          <div>
            <h3 className="text-white font-semibold mb-3 font-poppins">
              Loans
            </h3>
            {liabilitiesData.loans.length === 0 && !isAddingLoan && (
              <div className="text-center py-4 mb-3">
                <p className="text-gray-500 text-sm font-inter">
                  No loans added yet
                </p>
              </div>
            )}

            {isAddingLoan && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-3">
                <input
                  type="text"
                  placeholder="Loan Name"
                  value={newLoan.name}
                  onChange={(e) =>
                    setNewLoan({ ...newLoan, name: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none mb-3 font-poppins"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Outstanding Amount"
                    value={newLoan.amount}
                    onChange={(e) =>
                      setNewLoan({ ...newLoan, amount: e.target.value })
                    }
                    className="w-full bg-gray-700 text-white px-8 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-poppins"
                  />
                </div>
                <button
                  onClick={addLoan}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors mt-3 font-poppins"
                >
                  Add Loan
                </button>
              </div>
            )}

            {!isAddingLoan && (
              <button
                onClick={() => setIsAddingLoan(true)}
                className="w-full bg-gray-800 text-green-500 py-2 px-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 mb-3 font-poppins"
              >
                <Plus size={18} />
                <span>Add Loan</span>
              </button>
            )}

            {liabilitiesData.loans.map((loan) => (
              <div
                key={loan.id}
                className="bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors mb-2"
              >
                {editingLoanId === loan.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingLoan.name}
                      onChange={(e) =>
                        setEditingLoan({ ...editingLoan, name: e.target.value })
                      }
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none text-sm font-poppins"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={editingLoan.amount}
                        onChange={(e) =>
                          setEditingLoan({
                            ...editingLoan,
                            amount: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 text-white px-8 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none text-sm font-poppins"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={saveLoanEdit}
                        className="flex-1 bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600 transition-colors font-poppins"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingLoanId(null)}
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
                        {loan.name}
                      </p>
                      <p className="text-orange-400 text-sm font-semibold font-inter">
                        ₹{loan.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingLoan(loan)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => removeLoan(loan.id)}
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

          {/* Credit Cards Section */}
          <div>
            <h3 className="text-white font-semibold mb-3 font-poppins">
              Credit Cards
            </h3>
            {liabilitiesData.creditCards.length === 0 &&
              !isAddingCreditCard && (
                <div className="text-center py-4 mb-3">
                  <p className="text-gray-500 text-sm font-inter">
                    No credit cards added yet
                  </p>
                </div>
              )}

            {isAddingCreditCard && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-3">
                <input
                  type="text"
                  placeholder="Credit Card Name"
                  value={newCreditCard.name}
                  onChange={(e) =>
                    setNewCreditCard({ ...newCreditCard, name: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none mb-3 font-poppins"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Outstanding Balance"
                    value={newCreditCard.amount}
                    onChange={(e) =>
                      setNewCreditCard({
                        ...newCreditCard,
                        amount: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 text-white px-8 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-poppins"
                  />
                </div>
                <button
                  onClick={addCreditCard}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors mt-3 font-poppins"
                >
                  Add Credit Card
                </button>
              </div>
            )}

            {!isAddingCreditCard && (
              <button
                onClick={() => setIsAddingCreditCard(true)}
                className="w-full bg-gray-800 text-green-500 py-2 px-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 mb-3 font-poppins"
              >
                <Plus size={18} />
                <span>Add Credit Card</span>
              </button>
            )}

            {liabilitiesData.creditCards.map((card) => (
              <div
                key={card.id}
                className="bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors mb-2"
              >
                {editingCreditCardId === card.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingCreditCard.name}
                      onChange={(e) =>
                        setEditingCreditCard({
                          ...editingCreditCard,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none text-sm font-poppins"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={editingCreditCard.amount}
                        onChange={(e) =>
                          setEditingCreditCard({
                            ...editingCreditCard,
                            amount: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 text-white px-8 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none text-sm font-poppins"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={saveCreditCardEdit}
                        className="flex-1 bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600 transition-colors font-poppins"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCreditCardId(null)}
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
                        {card.name}
                      </p>
                      <p className="text-orange-400 text-sm font-semibold font-inter">
                        ₹{card.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingCreditCard(card)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => removeCreditCard(card.id)}
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

export default LiabilitiesPage;
