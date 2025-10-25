import { TrendingUp, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">FinAI</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
              Your AI-powered financial assistant helping you make smarter money
              decisions and achieve your financial goals.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-slate-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Github className="w-5 h-5 text-slate-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5 text-slate-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Mail className="w-5 h-5 text-slate-400" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © 2025 FinAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
