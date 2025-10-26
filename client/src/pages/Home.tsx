import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../homePageComponents/Sidebar";
import ChatInterface from "../homePageComponents/ChatInterface";
import Dashboard from "../homePageComponents/Dashboard";
import Goals from "../homePageComponents/Goals";

const Home: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState("chat");

  // Auto-close sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Run on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden">
      {/* Sidebar Section */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Main Content */}
      <motion.main
        key={currentView}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Top Bar for Title */}
        <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight ml-10 mt-2">
            {currentView === "chat" ? "Chat Assistant" : "Finance Dashboard"}
          </h1>
        </div>

        {/* Main Display Area */}
        <div className="flex-1 flex justify-center items-center p-4 sm:p-6 md:p-8 overflow-auto">
          {currentView === "chat" && <ChatInterface />}
          {currentView === "dashboard" && <Dashboard />}
          {currentView === "goals" && <Goals />}
        </div>
      </motion.main>
    </div>
  );
};

export default Home;
