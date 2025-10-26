import { TrendingUp, TrendingDown, IndianRupee, Percent } from "lucide-react";
import PieChart from "./PieChart";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [financialData, setFinancialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiData = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/getDashboardSummary`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (apiData.status === 200) {
          setFinancialData(apiData.data.data);
          console.log(apiData.data.data);
        } else {
          throw new Error(apiData.data.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gray-50 min-h-screen">
        <div className="text-2xl font-medium text-gray-700">
          Loading financial data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gray-50 min-h-screen">
        <div className="text-2xl font-medium text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!financialData) {
    return null;
  }

  const savingRate =
    (financialData.netSavings / financialData.totalIncome) * 100;

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
              value: `₹${financialData.totalIncome.toLocaleString()}`,
              icon: <TrendingUp className="w-5 h-5 text-green-500" />,
            },
            {
              title: "Total Expenses",
              value: `₹${financialData.totalExpenses.toLocaleString()}`,
              icon: <TrendingDown className="w-5 h-5 text-red-500" />,
            },
            {
              title: "Net Savings",
              value: `₹${financialData.netSavings.toLocaleString()}`,
              icon: <IndianRupee className="w-5 h-5 text-blue-500" />,
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
              <PieChart data={financialData.incomesByCategory} />
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
                  {financialData.incomesTable.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.source}
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
              <PieChart data={financialData.expensesByCategory} />
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
                  {financialData.expensesTable.map((item, index) => (
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
            {financialData.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
