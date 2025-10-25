import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "No credit card required",
  "Free 30-day trial",
  "Cancel anytime",
  "AI-powered insights",
];

export default function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto relative">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

          <div className="relative px-8 py-16 sm:px-12 sm:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Transform Your
                <br />
                Financial Future?
              </h2>
              <p className="text-xl text-emerald-50 mb-8 leading-relaxed">
                Join thousands of users who are already making smarter financial
                decisions with AI-powered insights
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-white"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="group px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-emerald-600/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-emerald-600/30 transition-all">
                  Schedule a Demo
                </button>
              </div>

              <p className="text-emerald-100 text-sm mt-6">
                Trusted by 10,000+ users worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
