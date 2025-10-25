import { Send, Mic, Paperclip } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, message]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 mt-6 sm:mt-10 mb-4 sm:mb-6 text-center px-2"
      >
        What can I help with?
      </motion.h1>

      {/* Chat Messages */}
      <div className="w-full max-w-3xl flex-1 overflow-y-auto mb-4 sm:mb-8 space-y-3 sm:space-y-4 px-2">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-sm border border-gray-200 rounded-lg sm:rounded-2xl p-2 sm:p-3 w-fit max-w-[90%] sm:max-w-[80%] text-sm sm:text-base"
          >
            {msg}
          </motion.div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="w-full max-w-3xl relative mb-20 sm:mb-40 px-2">
        <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 px-3 sm:px-5 py-2 sm:py-3">
          <button className="text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">
            <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
          />

          <button className="text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleSend}
            className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
