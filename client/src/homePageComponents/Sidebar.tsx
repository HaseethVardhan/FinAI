import { Menu, MessageSquare, LayoutDashboard, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function Sidebar({
  isOpen,
  onToggle,
  currentView,
  onNavigate,
}: SidebarProps) {
  const dummyChats = [
    "TLE solution optimization",
    "Flutter overview and details",
    "Create WhatsApp group link",
  ];

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors"
      >
        <Menu className="w-6 h-6 text-gray-700 " />
      </button>

      {/* Animated Sidebar */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: isOpen ? 0 : -260 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed top-0 left-0 h-full bg-gray-900 text-white w-64 flex flex-col shadow-xl z-40"
      >
        {/* Header */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-800">
          {/*<div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>*/}
          <span className="text-xl font-semibold ml-12 mt-2">FinanceAI</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <button
            onClick={() => onNavigate("chat")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === "chat" ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>New Chat</span>
          </button>

          <button
            onClick={() => onNavigate("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === "dashboard" ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          {/* Chat History */}
          <div className="pt-6">
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Chats
            </h3>
            <div className="space-y-1">
              {dummyChats.map((chat, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-800 rounded-lg transition-colors truncate"
                >
                  {chat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
