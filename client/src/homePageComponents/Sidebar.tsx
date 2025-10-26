import { Menu, MessageSquare, LayoutDashboard, Target } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

interface Conversation {
  _id: string;
  user: string;
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the structure of the API response
interface ApiResponse {
  statusCode: number;
  message: string;
  data: Conversation[];
  success: boolean;
}

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
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const navigate = useNavigate();
  useEffect(() => {
    const getAllConversations = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/getAllConversations`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data && response.data.success) {
          setConversations(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    getAllConversations();
  }, []);

  const handleChatNavigation = (conversationId: string) => {
    onNavigate("chat");

    const url = new URL(window.location.href);
    url.searchParams.set("conversationId", conversationId);
    // Update URL and refresh the page
    window.location.href = url.toString();
  };

  // Function to handle "New Chat" button click
  const handleNewChat = () => {
    // Generate a new random UUID
    const newConversationId = crypto.randomUUID();
    // Use the existing navigation logic to update the URL
    handleChatNavigation(newConversationId);
  };

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
          <span className="text-xl font-semibold ml-12 mt-2">FinAI</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <button
            onClick={handleNewChat}
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
          <button
            onClick={() => onNavigate("goals")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === "goals" ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <Target className="w-5 h-5" />
            <span>Goals</span>
          </button>
          {/* Chat History */}
          <div className="pt-6">
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Chats
            </h3>
            <div className="space-y-1">
              {conversations.map((chat) => (
                <button
                  key={chat._id} // Use the unique _id for the key
                  onClick={() => handleChatNavigation(chat.id)} // Set onClick to navigate
                  className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-800 rounded-lg transition-colors truncate"
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              // console.log('hi');
              localStorage.clear('token');
              navigate('/landing');
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === "dashboard" ? "bg-red-400" : "hover:bg-red-600"
            }`}
          >
            <span>Signout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
