import {
  Brain,
  PieChart,
  Target,
  Shield,
  TrendingUp,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Financial Assistant",
    description:
      "Get personalized insights and recommendations powered by advanced AI to optimize your spending habits.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: PieChart,
    title: "Smart Analytics",
    description:
      "Visualize your spending patterns with interactive charts and category breakdowns.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description:
      "Set savings goals and track your progress with intelligent milestones and reminders.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description:
      "Your financial data is protected with industry-leading encryption and security measures.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Budget Optimization",
    description:
      "AI-powered budget suggestions help you allocate funds efficiently across categories.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Receive timely notifications when you approach budget limits or achieve savings milestones.",
    gradient: "from-green-500 to-emerald-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative font-poppins">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="text-sm text-emerald-400 font-medium">
              FEATURES
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Master Your Finances
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Powerful tools and AI-driven insights to help you make smarter
            financial decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-all hover:transform hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
