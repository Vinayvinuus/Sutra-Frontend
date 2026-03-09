"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ReflectionPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("sutra_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const startReflection = async () => {
    if (!userId) {
      alert("Please complete the interview first!");
      router.push("/interview");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/reflection/start", {
        user_id: userId,
      });
      setMessages([{ role: "assistant", content: res.data.greeting }]);
      setIsStarted(true);
    } catch (error) {
      console.error("Error starting reflection:", error);
      alert("Failed to start reflection. Please try again.");
    }
  };

  const sendStory = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const userStory = input;
    setInput("");

    try {
      const res = await axios.post("http://localhost:8000/api/reflection/story", {
        user_id: userId,
        user_story: userStory,
        date: new Date().toISOString().split("T")[0],
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);

      if (!res.data.needs_more) {
        setIsComplete(true);
        setTimeout(() => {
          alert("✨ Reflection saved! Your insights have been recorded.");
        }, 500);
      }
    } catch (error) {
      console.error("Error sending story:", error);
      alert("Failed to process your story. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
            End of Day Reflection
          </h1>
          <p className="text-slate-400">Share your story and extract wisdom from your day</p>
        </div>

        {/* Start Reflection */}
        {!isStarted && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🌙</div>
            <h2 className="text-3xl font-semibold mb-4">How Did Today Go?</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Take a moment to reflect on your day. I'm here to listen and help you discover insights.
            </p>
            <button
              onClick={startReflection}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Start Reflection
            </button>
          </div>
        )}

        {/* Chat Interface */}
        {isStarted && (
          <>
            <div className="space-y-4 mb-8 max-h-[60vh] overflow-y-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-blue-600/20 border border-blue-500/30 ml-12"
                      : "bg-orange-600/20 border border-orange-500/30 mr-12"
                  } backdrop-blur-sm animate-fade-in`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{msg.role === "user" ? "🙋" : "🌟"}</span>
                    <span className="text-sm font-semibold text-orange-300">
                      {msg.role === "user" ? "You" : "Sutra Partner"}
                    </span>
                  </div>
                  <p className="text-slate-100 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Input Section */}
            {!isComplete && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-4">
                <div className="flex flex-col gap-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendStory();
                      }
                    }}
                    className="w-full bg-slate-700/50 border border-orange-500/30 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Share your story... (Press Enter to send, Shift+Enter for new line)"
                    rows={4}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">
                      💡 Be honest and detailed - the more you share, the more you'll learn
                    </span>
                    <button
                      onClick={sendStory}
                      disabled={!input.trim()}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Complete Section */}
            {isComplete && (
              <div className="bg-green-600/20 border border-green-500/30 rounded-2xl p-6 text-center backdrop-blur-sm">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-2xl font-semibold mb-2">Reflection Complete!</h3>
                <p className="text-slate-300 mb-4">
                  Your insights have been saved. Keep building on this momentum!
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.push("/track")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    View Progress 📊
                  </button>
                  <button
                    onClick={() => router.push("/mission")}
                    className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Tomorrow's Mission 🚀
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}