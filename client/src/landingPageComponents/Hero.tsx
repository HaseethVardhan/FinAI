import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-poppins">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium">
              AI-Powered Financial Intelligence
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Master Your Money with{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Smart Insights
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-3xl mx-auto">
            Take control of your financial future with AI-driven budgeting,
            personalized recommendations, and real-time insights. Join thousands
            of users building better money habits.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
            onClick={()=> {
              navigate('/auth')
            }}
            className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/40 transition-all flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-emerald-500/10">
            <div className="bg-slate-900/50 backdrop-blur-xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl p-6">
                  <div className="text-emerald-400 text-sm font-medium mb-2">
                    Total Balance
                  </div>
                  <div className="text-3xl font-bold text-white">₹24,586</div>
                  <div className="text-emerald-400 text-sm mt-2">
                    +12.5% this month
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
                  <div className="text-slate-400 text-sm font-medium mb-2">
                    Expenses
                  </div>
                  <div className="text-3xl font-bold text-white">₹3,240</div>
                  <div className="text-red-400 text-sm mt-2">
                    -8% from last month
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
                  <div className="text-slate-400 text-sm font-medium mb-2">
                    Savings Goal
                  </div>
                  <div className="text-3xl font-bold text-white">75%</div>
                  <div className="text-teal-400 text-sm mt-2">
                    On track for ₹5,000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
