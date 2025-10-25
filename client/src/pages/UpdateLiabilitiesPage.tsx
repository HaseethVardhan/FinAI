import React, { useState } from "react";
import { AlertTriangle, Plus, Trash2, Edit2 } from "lucide-react";
// Removed the import for Button as it wasn't provided.
// Instead, created a simple Button component below for completeness.
import { useNavigate } from "react-router-dom"; // ✅ Import navigate
import axios from "axios";

// ----------------- Simple Button Component -----------------
// Added this component to make the file runnable, based on your original import.
const Button: React.FC<{
  text: string;
  onClick: () => void;
  bgColor?: string;
  hoverColor?: string;
}> = ({
  text,
  onClick,
  bgColor = "bg-green-500",
  hoverColor = "bg-green-600",
}) => (
  <button
    onClick={onClick}
    className={`w-full ${bgColor} text-white py-3 px-4 rounded-lg font-semibold ${hoverColor} transition-colors font-poppins`}
  >
    {text}
  </button>
);

// ----------------- New Interfaces (Schema-based) -----------------
interface Loan {
  id: string;
  type: string;
  outstanding: number;
  monthlyEMI: number;
}

interface CreditCard {
  id: string;
  cardName: string;
  balance: number;
  creditLimit: number;
}

// ----------------- Main Component -----------------
const LiabilitiesPage: React.FC = () => {
  const navigate = useNavigate(); // ✅ hook for navigation

  // ----------------- Updated State -----------------
  const [liabilitiesData, setLiabilitiesData] = useState<{
    loans: Loan[];
    creditCards: CreditCard[];
  }>({
    loans: [],
    creditCards: [],
  });

  const [error, setError] = useState(""); // error state

  const [newLoan, setNewLoan] = useState({
    type: "",
    outstanding: "",
    monthlyEMI: "",
  });
  const [newCreditCard, setNewCreditCard] = useState({
    cardName: "",
    balance: "",
    creditLimit: "",
  });

  const [isAddingLoan, setIsAddingLoan] = useState(false);
  const [isAddingCreditCard, setIsAddingCreditCard] = useState(false);

  const [editingLoanId, setEditingLoanId] = useState<string | null>(null);
  const [editingCreditCardId, setEditingCreditCardId] = useState<string | null>(
    null
  );

  const [editingLoan, setEditingLoan] = useState({
    type: "",
    outstanding: "",
    monthlyEMI: "",
  });
  const [editingCreditCard, setEditingCreditCard] = useState({
    cardName: "",
    balance: "",
    creditLimit: "",
  });

  // ----------------- Validation Logic (Unchanged) -----------------
  const isValidName = (name: string) => {
    const regex = /^[A-Za-z][A-Za-z_]*$/; // must start with letter, only letters + underscores
    return regex.test(name);
  };

  // ----------------- Updated Add/Remove/Edit Logic -----------------
  const addLoan = () => {
    const { type, outstanding, monthlyEMI } = newLoan;
    if (!type || !outstanding || !monthlyEMI) {
      setError("⚠️ Please fill in all loan fields.");
      return;
    }
    if (!isValidName(type)) {
      setError(
        "⚠️ Loan Type can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(outstanding) < 0 || parseFloat(monthlyEMI) < 0) {
      setError("⚠️ Amounts cannot be negative.");
      return;
    }

    const loan: Loan = {
      id: Date.now().toString(),
      type: type,
      outstanding: parseFloat(outstanding),
      monthlyEMI: parseFloat(monthlyEMI),
    };
    setLiabilitiesData({
      ...liabilitiesData,
      loans: [...liabilitiesData.loans, loan],
    });
    setNewLoan({ type: "", outstanding: "", monthlyEMI: "" });
    setIsAddingLoan(false);
    setError(""); // Clear error
  };

  const addCreditCard = () => {
    const { cardName, balance, creditLimit } = newCreditCard;
    if (!cardName || !balance || !creditLimit) {
      setError("⚠️ Please fill in all credit card fields.");
      return;
    }
    if (!isValidName(cardName)) {
      setError(
        "⚠️ Card Name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(balance) < 0 || parseFloat(creditLimit) < 0) {
      setError("⚠️ Amounts cannot be negative.");
      return;
    }

    const creditCard: CreditCard = {
      id: Date.now().toString(),
      cardName: cardName,
      balance: parseFloat(balance),
      creditLimit: parseFloat(creditLimit),
    };
    setLiabilitiesData({
      ...liabilitiesData,
      creditCards: [...liabilitiesData.creditCards, creditCard],
    });
    setNewCreditCard({ cardName: "", balance: "", creditLimit: "" });
    setIsAddingCreditCard(false);
    setError(""); // Clear error
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

  const startEditingLoan = (loan: Loan) => {
    setEditingLoanId(loan.id);
    setEditingLoan({
      type: loan.type,
      outstanding: loan.outstanding.toString(),
      monthlyEMI: loan.monthlyEMI.toString(),
    });
  };

  const saveLoanEdit = () => {
    const { type, outstanding, monthlyEMI } = editingLoan;
    if (!type || !outstanding || !monthlyEMI) {
      setError("⚠️ Please fill in all loan fields.");
      return;
    }
    if (!isValidName(type)) {
      setError(
        "⚠️ Loan Type can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(outstanding) < 0 || parseFloat(monthlyEMI) < 0) {
      setError("⚠️ Amounts cannot be negative.");
      return;
    }

    setLiabilitiesData({
      ...liabilitiesData,
      loans: liabilitiesData.loans.map((loan) =>
        loan.id === editingLoanId
          ? {
              ...loan,
              type: type,
              outstanding: parseFloat(outstanding),
              monthlyEMI: parseFloat(monthlyEMI),
            }
          : loan
      ),
    });
    setEditingLoanId(null);
    setEditingLoan({ type: "", outstanding: "", monthlyEMI: "" });
    setError(""); // Clear error
  };

  const startEditingCreditCard = (card: CreditCard) => {
    setEditingCreditCardId(card.id);
    setEditingCreditCard({
      cardName: card.cardName,
      balance: card.balance.toString(),
      creditLimit: card.creditLimit.toString(),
    });
  };

  const saveCreditCardEdit = () => {
    const { cardName, balance, creditLimit } = editingCreditCard;
    if (!cardName || !balance || !creditLimit) {
      setError("⚠️ Please fill in all credit card fields.");
      return;
    }
    if (!isValidName(cardName)) {
      setError(
        "⚠️ Card Name can only contain alphabets and underscores, must start with a letter, and no numbers allowed."
      );
      return;
    }
    if (parseFloat(balance) < 0 || parseFloat(creditLimit) < 0) {
      setError("⚠️ Amounts cannot be negative.");
      return;
    }

    setLiabilitiesData({
      ...liabilitiesData,
      creditCards: liabilitiesData.creditCards.map((card) =>
        card.id === editingCreditCardId
          ? {
              ...card,
              cardName: cardName,
              balance: parseFloat(balance),
              creditLimit: parseFloat(creditLimit),
            }
          : card
      ),
    });
    setEditingCreditCardId(null);
    setEditingCreditCard({ cardName: "", balance: "", creditLimit: "" });
    setError(""); // Clear error
  };

  // ----------------- Navigation Logic (Unchanged) -----------------
  const handleSaveChanges = async () => {
    if (
      liabilitiesData.loans.length === 0 &&
      liabilitiesData.creditCards.length === 0
    ) {
      setError("⚠️ Please fill at least one field before saving.");
      return;
    }
    setError(""); // clear error

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/updateLiabilities`,
      {
        loans: liabilitiesData.loans,
        creditCards: liabilitiesData.creditCards,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(response);

    navigate("/insurance", { replace: true }); // ✅ Navigate to the Insurance page
  };

  const handleSkip = () => {
    navigate("/insurance", { replace: true }); // ✅ Navigate to the Insurance page
  };

  // ----------------- Updated JSX -----------------
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

            {/* Add Loan Form */}
            {isAddingLoan && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-3 space-y-3">
                <input
                  type="text"
                  placeholder="Loan Type (e.g., Home_Loan)"
                  value={newLoan.type}
                  onChange={(e) =>
                    setNewLoan({ ...newLoan, type: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-poppins"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Outstanding Amount"
                    value={newLoan.outstanding}
                    onChange={(e) =>
                      setNewLoan({ ...newLoan, outstanding: e.target.value })
                    }
                    className="w-full bg-gray-700 text-white px-8 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-poppins"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Monthly EMI"
                    value={newLoan.monthlyEMI}
                    onChange={(e) =>
                      setNewLoan({ ...newLoan, monthlyEMI: e.target.value })
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

            {/* Loan List */}
            {liabilitiesData.loans.map((loan) => (
              <div
                key={loan.id}
                className="bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors mb-2"
              >
                {/* Edit Loan Form */}
                {editingLoanId === loan.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingLoan.type}
                      onChange={(e) =>
                        setEditingLoan({ ...editingLoan, type: e.target.value })
                      }
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none text-sm font-poppins"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={editingLoan.outstanding}
                        onChange={(e) =>
                          setEditingLoan({
                            ...editingLoan,
                            outstanding: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 text-white px-8 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none text-sm font-poppins"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={editingLoan.monthlyEMI}
                        onChange={(e) =>
                          setEditingLoan({
                            ...editingLoan,
                            monthlyEMI: e.target.value,
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
                  // Display Loan Item
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium font-poppins">
                        {loan.type}
                      </p>
                      <p className="text-orange-400 text-sm font-semibold font-inter">
                        ₹{loan.outstanding.toFixed(2)} (EMI: ₹
                        {loan.monthlyEMI.toFixed(2)})
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

            {/* Add Credit Card Form */}
            {isAddingCreditCard && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-3 space-y-3">
                <input
                  type="text"
                  placeholder="Card Name (e.g., HDFC_Regalia)"
                  value={newCreditCard.cardName}
                  onChange={(e) =>
                    setNewCreditCard({
                      ...newCreditCard,
                      cardName: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-poppins"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Outstanding Balance"
                    value={newCreditCard.balance}
                    onChange={(e) =>
                      setNewCreditCard({
                        ...newCreditCard,
                        balance: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 text-white px-8 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none font-poppins"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Credit Limit"
                    value={newCreditCard.creditLimit}
                    onChange={(e) =>
                      setNewCreditCard({
                        ...newCreditCard,
                        creditLimit: e.target.value,
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

            {/* Credit Card List */}
            {liabilitiesData.creditCards.map((card) => (
              <div
                key={card.id}
                className="bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors mb-2"
              >
                {/* Edit Credit Card Form */}
                {editingCreditCardId === card.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingCreditCard.cardName}
                      onChange={(e) =>
                        setEditingCreditCard({
                          ...editingCreditCard,
                          cardName: e.target.value,
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
                        value={editingCreditCard.balance}
                        onChange={(e) =>
                          setEditingCreditCard({
                            ...editingCreditCard,
                            balance: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 text-white px-8 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none text-sm font-poppins"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={editingCreditCard.creditLimit}
                        onChange={(e) =>
                          setEditingCreditCard({
                            ...editingCreditCard,
                            creditLimit: e.target.value,
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
                  // Display Credit Card Item
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium font-poppins">
                        {card.cardName}
                      </p>
                      <p className="text-orange-400 text-sm font-semibold font-inter">
                        ₹{card.balance.toFixed(2)} (Limit: ₹
                        {card.creditLimit.toFixed(2)})
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
        <div className="mt-4">
          <Button
            text="Skip"
            onClick={handleSkip}
            bgColor="bg-gray-700"
            hoverColor="bg-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default LiabilitiesPage;
