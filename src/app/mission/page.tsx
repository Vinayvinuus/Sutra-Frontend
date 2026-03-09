"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Task = {
  task: string;
  why: string;
  duration: string;
  completed?: boolean;
};

type Mission = {
  id: number;
  date: string;
  mission_statement: string;
  tasks: Task[];
  focus_goal: string;
};

export default function MissionPage() {
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [hasUser, setHasUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUserId = localStorage.getItem("sutra_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      setHasUser(true);
    }
  }, []);

  const generateMission = async () => {
    if (!userId) {
      alert("Please complete the interview first!");
      router.push("/interview");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/mission/generate", {
        user_id: userId,
      });
      setMission(res.data);
    } catch (error: any) {
      console.error("Error generating mission:", error);
      if (error.response?.status === 404) {
        alert("User not found. Please complete the interview first.");
        router.push("/interview");
      } else if (error.response?.status === 400) {
        alert("No goals found. Please complete the interview first.");
        router.push("/interview");
      } else {
        alert("Failed to generate mission. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskIndex: number) => {
    if (!mission) return;
    const updatedTasks = [...mission.tasks];
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
    setMission({ ...mission, tasks: updatedTasks });
  };

  const completedCount = mission?.tasks.filter((t) => t.completed).length || 0;
  const totalTasks = mission?.tasks.length || 0;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Daily Mission
          </h1>
          <p className="text-slate-400">Your personalized action plan for today</p>
        </div>

        {/* Generate Mission Button */}
        {!mission && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl font-semibold mb-4">Ready for Today's Mission?</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Based on your goals and past progress, I'll create a personalized mission to keep you moving forward.
            </p>
            <button
              onClick={generateMission}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate Today's Mission"}
            </button>
          </div>
        )}

        {/* Mission Content */}
        {mission && (
          <div className="space-y-6">
            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎯</span>
                <h2 className="text-xl font-semibold">Today's Focus</h2>
              </div>
              <p className="text-2xl font-bold mb-2">{mission.mission_statement}</p>
              <p className="text-slate-300">Goal: {mission.focus_goal}</p>
            </div>

            {/* Progress Bar */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Progress</span>
                <span className="text-sm text-slate-400">
                  {completedCount} of {totalTasks} tasks completed
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <span>📋</span> Today's Tasks
              </h3>
              {mission.tasks.map((task, index) => (
                <div
                  key={index}
                  className={`bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${
                    task.completed
                      ? "border-green-500/30 bg-green-900/10"
                      : "border-purple-500/20 hover:border-purple-500/40"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTask(index)}
                      className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                        task.completed
                          ? "bg-green-500 border-green-500"
                          : "border-purple-500 hover:border-purple-400"
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <h4
                        className={`text-lg font-semibold mb-2 ${
                          task.completed ? "line-through text-slate-500" : ""
                        }`}
                      >
                        {task.task}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <span>💡</span>
                          <span>{task.why}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <span>⏱️</span>
                          <span>{task.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/reflection")}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-6 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                End Day & Reflect 🌙
              </button>
              <button
                onClick={generateMission}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-4 rounded-lg font-semibold transition-all duration-200"
              >
                Regenerate Mission
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}