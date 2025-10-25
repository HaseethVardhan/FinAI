import { UserPlus, Link2, Sparkles, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up in seconds and set up your financial profile with our simple onboarding process.",
  },
  {
    icon: Link2,
    number: "02",
    title: "Connect Your Data",
    description:
      "Securely link your income sources and spending categories to get a complete financial picture.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Get AI Insights",
    description:
      "Our AI analyzes your patterns and provides personalized recommendations to improve your finances.",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Track & Achieve",
    description:
      "Watch your savings grow with real-time tracking and celebrate milestones along the way.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="text-sm text-emerald-400 font-medium">
              HOW IT WORKS
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Get Started in{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Four Simple Steps
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Begin your journey to financial freedom in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-emerald-500/50 transition-all group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-4 -left-4 text-6xl font-bold text-slate-800/50">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/3 -right-4 w-8 h-8 z-20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/40 transition-all">
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
}
