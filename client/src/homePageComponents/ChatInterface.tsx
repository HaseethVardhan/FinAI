// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

// Define a type for the message structure
type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  // --- FIX ---
  // Read the URL on *every render* to get the most current value.
  // const params = new URLSearchParams(window.location.search);
  // const currentUrlConvId = params.get("conversationId");
  // --- END OLD CODE ---

  // --- NEW FIX ---
  // This state will track the URL parameter and trigger the fetch effect.
  const [urlConvId, setUrlConvId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("conversationId");
  });

  useEffect(() => {
    // This effect listens for browser navigation events

    // 1. Listen for 'popstate' (back/forward buttons)
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setUrlConvId(params.get("conversationId"));
    };
    window.addEventListener("popstate", handlePopState);

    // 2. "Patch" pushState to dispatch a custom event
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      // Dispatch our custom event
      window.dispatchEvent(new Event("pushstate"));
    };

    // 3. Listen for our custom 'pushstate' event
    const handlePushState = () => {
      const params = new URLSearchParams(window.location.search);
      setUrlConvId(params.get("conversationId"));
    };
    window.addEventListener("pushstate", handlePushState);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pushstate", handlePushState);
      // Restore the original function
      window.history.pushState = originalPushState;
    };
  }, []);
  // --- END NEW FIX ---

  useEffect(() => {
    // Now, this effect runs whenever 'urlConvId' (from the new hook) changes.
    if (urlConvId) {
      setConversationId(urlConvId); // Sync internal state
      setIsLoading(true); // Show loading while fetching

      const fetchMessages = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/user/loadConversations`,
            {
              conversationId: urlConvId, // Use the ID from the URL-aware state
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setMessages(response.data.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
          if (axios.isAxiosError(error) && error.response) {
            console.error(
              "Failed to fetch messages",
              error.response.status,
              error.response.data
            );
          }
          // setMessages([
          //   {
          //     role: "assistant",
          //     // --- BUG FIX ---
          //     // The 'Message' type uses 'text', not 'content'.
          //     text: "Sorry, I couldn't load the previous messages.",
          //   },
          // ]);
        } finally {
          setIsLoading(false); // Stop loading
        }
      };

      fetchMessages();
    } else {
      // If there's no ID in the URL (like a new chat), clear messages.
      setMessages([]);
      setConversationId(null);
    }
  }, [urlConvId]); // --- FIX --- The dependency is now the URL-aware state.

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      const userMessage: Message = {
        role: "user",
        text: trimmedMessage,
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessage("");
      setIsLoading(true); // Start loading animation

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/newPrompt`,
          {
            prompt: trimmedMessage,
            conversationId: conversationId, // This uses the synced state
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response.data.data;
        if (data.response) {
          const assistantMessage: Message = {
            role: "assistant",
            text: data.response,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
        // Handle new conversation ID if one is created
        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId);
          // Update URL for new chat
          const url = new URL(window.location.href);
          url.searchParams.set("conversationId", data.conversationId);
          window.history.pushState({}, "", url);
        }
      } catch (error) {
        console.error("Error calling newPrompt:", error);
        if (axios.isAxiosError(error) && error.response) {
          console.error(
            "Failed to get response from newPrompt",
            error.response.status,
            error.response.data
          );
        }
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Sorry, an error occurred." },
        ]);
      } finally {
        setIsLoading(false); // Stop loading animation
      }
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
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`shadow-sm border rounded-lg sm:rounded-2xl p-2 sm:p-3 w-fit max-w-[90%] sm:max-w-[80%] text-sm sm:text-base
                ${
                  isUser
                    ? "bg-blue-500 text-white ml-auto border-blue-500"
                    : "bg-white text-gray-800 border-gray-200"
                }
              `}
            >
              {msg.text}
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="shadow-sm border rounded-lg sm:rounded-2xl p-3 w-fit max-w-[90%] sm:max-w-[80%] bg-white text-gray-800 border-gray-200"
          >
            <div className="flex items-center justify-center space-x-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Bar */}
      <div className="w-full max-w-3xl relative mb-20 sm:mb-40 px-2">
        <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 px-3 sm:px-5 py-2 sm:py-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
          />

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

