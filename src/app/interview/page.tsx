"use client";
import { useState } from "react";
import axios from "axios";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function InterviewPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [userId] = useState(`user_${Math.random().toString(36).slice(2)}`);
  const [isStarted, setIsStarted] = useState(false);
  const [showNameInput, setShowNameInput] = useState(true);

  const startInterview = async () => {
    if (!userName.trim()) {
      alert("Please enter your name first!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/interview/start", {
        user_id: userId,
        user_name: userName,
      });
      setMessages([{ role: "assistant", content: res.data.message }]);
      setIsStarted(true);
      setShowNameInput(false);
      
      // Save user ID to localStorage for other pages
      localStorage.setItem("sutra_user_id", userId);
      localStorage.setItem("sutra_user_name", userName);
    } catch (error) {
      console.error("Error starting interview:", error);
      alert("Failed to start interview. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const userInput = input;
    setInput("");

    try {
      const res = await axios.post("http://localhost:8000/api/interview/respond", {
        user_id: userId,
        user_input: userInput,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);

      if (res.data.complete) {
        setTimeout(() => {
          alert("🎉 Interview complete! Your goal has been saved.");
        }, 500);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "Sorry, there was an error processing your message. Please try again." 
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Interview Phase
        </h1>
        <p className="text-slate-400 mb-8">Let's discover your goals together</p>

        {/* Name Input Section */}
        {showNameInput && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Project Sutra</h2>
            <p className="text-slate-300 mb-6">
              Before we begin, what should I call you?
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startInterview()}
                className="flex-1 bg-slate-700/50 border border-purple-500/30 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your name..."
                autoFocus
              />
              <button
                onClick={startInterview}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Start Interview
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {isStarted && (
          <div className="space-y-4 mb-8 max-h-[60vh] overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-blue-600/20 border border-blue-500/30 ml-12"
                    : "bg-purple-600/20 border border-purple-500/30 mr-12"
                } backdrop-blur-sm animate-fade-in`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-purple-300">
                    {msg.role === "user" ? userName : "Sutra AI"}
                  </span>
                </div>
                <p className="text-slate-100 leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Input Section */}
        {isStarted && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 bg-slate-700/50 border border-purple-500/30 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}