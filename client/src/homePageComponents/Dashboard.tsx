import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import PieChart from "./PieChart";

const dummyData = {
  totalIncome: 255000,
  totalExpenses: 56111,
  netSavings: 198889,
  expensesByCategory: [
    { name: "Food", value: 5000 },
    { name: "Transport", value: 51111 },
  ],
  expensesTable: [
    { category: "Transport", amount: 51111, percentage: 91.09 },
    { category: "Food", amount: 5000, percentage: 8.91 },
  ],
  incomesByCategory: [
    { name: "Salary", value: 250000 },
    { name: "Other", value: 5000 },
  ],
  incomesTable: [
    { category: "Salary", amount: 250000, percentage: 98.04 },
    { category: "Other", amount: 5000, percentage: 1.96 },
  ],
};

export default function Dashboard() {
  const savingRate = (dummyData.netSavings / dummyData.totalIncome) * 100;

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center sm:text-left">
          Financial Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Income",
              value: `₹${dummyData.totalIncome.toLocaleString()}`,
              icon: <TrendingUp className="w-5 h-5 text-green-500" />,
            },
            {
              title: "Total Expenses",
              value: `₹${dummyData.totalExpenses.toLocaleString()}`,
              icon: <TrendingDown className="w-5 h-5 text-red-500" />,
            },
            {
              title: "Net Savings",
              value: `₹${dummyData.netSavings.toLocaleString()}`,
              icon: <DollarSign className="w-5 h-5 text-blue-500" />,
            },
            {
              title: "Saving Rate",
              value: `${savingRate.toFixed(2)}%`,
              icon: <Percent className="w-5 h-5 text-emerald-500" />,
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  {card.title}
                </h3>
                {card.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Income Breakdown */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">
            Income Breakdown
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <PieChart data={dummyData.incomesByCategory} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {["S.No", "Category", "Amount", "%"].map((head, i) => (
                      <th
                        key={i}
                        className={`py-3 px-4 text-sm font-semibold text-gray-700 ${
                          i > 1 ? "text-right" : "text-left"
                        }`}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dummyData.incomesTable.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 text-right font-medium">
                        ₹{item.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-right">
                        {item.percentage.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">
            Expenses Breakdown
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <PieChart data={dummyData.expensesByCategory} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {["S.No", "Category", "Amount", "%"].map((head, i) => (
                      <th
                        key={i}
                        className={`py-3 px-4 text-sm font-semibold text-gray-700 ${
                          i > 1 ? "text-right" : "text-left"
                        }`}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dummyData.expensesTable.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 text-right font-medium">
                        ₹{item.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-right">
                        {item.percentage.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm hover:shadow-md transition-all border border-blue-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">AI Insights</h2>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              Your saving rate of {savingRate.toFixed(2)}% is excellent — above
              the recommended 20%.
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              Transport expenses account for 91% of total spending. Try reducing
              this category.
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              Income sources are healthy with a strong primary salary stream.
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              Consider setting aside an emergency fund for 3–6 months of
              expenses.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
