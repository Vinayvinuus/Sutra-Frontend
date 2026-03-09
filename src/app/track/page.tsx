"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

type Reflection = {
  date: string;
  story: string;
  wins: string[];
  blockers: string[];
  energy_level: number;
  insights: string[];
};

export default function TrackPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("sutra_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchReflections(storedUserId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchReflections = async (uid: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/reflection/history/${uid}`);
      setReflections(res.data);
    } catch (error) {
      console.error("Error fetching reflections:", error);
      // Mock data for demonstration
      setReflections([
        {
          date: "2025-12-25",
          story: "Had a productive day working on the project",
          wins: ["Completed 3 tasks", "Learned new techniques"],
          blockers: ["Time management issues"],
          energy_level: 7,
          insights: ["Need better time blocking"],
        },
        {
          date: "2025-12-24",
          story: "Slow start but picked up momentum",
          wins: ["Fixed critical bug", "Good team collaboration"],
          blockers: ["Morning distractions"],
          energy_level: 6,
          insights: ["Morning routine needs work"],
        },
        {
          date: "2025-12-23",
          story: "Great focus throughout the day",
          wins: ["Deep work session", "Clear progress on goals"],
          blockers: ["Meeting interruptions"],
          energy_level: 8,
          insights: ["Deep work in mornings is most effective"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Prepare energy trend data
  const energyData = [...reflections]
    .reverse()
    .map((r) => ({
      date: new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      energy: r.energy_level,
    }));

  // Prepare productivity metrics
  const productivityData = [
    { metric: "Wins", value: reflections.reduce((sum, r) => sum + r.wins.length, 0) / reflections.length || 0 },
    { metric: "Insights", value: reflections.reduce((sum, r) => sum + r.insights.length, 0) / reflections.length || 0 },
    { metric: "Energy", value: reflections.reduce((sum, r) => sum + r.energy_level, 0) / reflections.length || 0 },
    { metric: "Blockers", value: 10 - (reflections.reduce((sum, r) => sum + r.blockers.length, 0) / reflections.length || 0) },
  ];

  const totalWins = reflections.reduce((sum, r) => sum + r.wins.length, 0);
  const totalInsights = reflections.reduce((sum, r) => sum + r.insights.length, 0);
  const avgEnergy = reflections.length > 0 
    ? (reflections.reduce((sum, r) => sum + r.energy_level, 0) / reflections.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8 flex items-center justify-center">
        <div className="text-2xl">Loading your journey...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Your Progress Journey
          </h1>
          <p className="text-slate-400">Track your growth and celebrate your wins</p>
        </div>

        {reflections.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-3xl font-semibold mb-4">Start Your Journey</h2>
            <p className="text-slate-400 mb-6">
              Complete your first reflection to start tracking your progress!
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-3xl font-bold mb-1">{totalWins}</div>
                <div className="text-slate-300">Total Wins</div>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-4xl mb-2">💡</div>
                <div className="text-3xl font-bold mb-1">{totalInsights}</div>
                <div className="text-slate-300">Insights Gained</div>
              </div>
              <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-4xl mb-2">⚡</div>
                <div className="text-3xl font-bold mb-1">{avgEnergy}/10</div>
                <div className="text-slate-300">Avg Energy Level</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Energy Trend */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <span>⚡</span> Energy Trend
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis domain={[0, 10]} stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        border: "1px solid #7C3AED",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={{ fill: "#F59E0B", r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Productivity Radar */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <span>📊</span> Productivity Balance
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={productivityData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" />
                    <PolarRadiusAxis domain={[0, 10]} stroke="#9CA3AF" />
                    <Radar
                      name="Metrics"
                      dataKey="value"
                      stroke="#A855F7"
                      fill="#A855F7"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Reflections Timeline */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span>📅</span> Daily Reflections
              </h2>
              <div className="space-y-4">
                {reflections.map((reflection, index) => (
                  <div
                    key={index}
                    className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 hover:border-purple-500/40 transition-all cursor-pointer"
                    onClick={() => setSelectedReflection(reflection)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {new Date(reflection.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </h3>
                        <p className="text-slate-400 text-sm">{reflection.story}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-orange-600/20 px-3 py-1 rounded-full">
                        <span>⚡</span>
                        <span className="font-semibold">{reflection.energy_level}/10</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Wins */}
                      <div>
                        <div className="text-xs font-semibold text-green-400 mb-2">
                          🏆 WINS ({reflection.wins.length})
                        </div>
                        <ul className="space-y-1">
                          {reflection.wins.slice(0, 2).map((win, i) => (
                            <li key={i} className="text-sm text-slate-300">• {win}</li>
                          ))}
                          {reflection.wins.length > 2 && (
                            <li className="text-xs text-slate-500">+{reflection.wins.length - 2} more</li>
                          )}
                        </ul>
                      </div>

                      {/* Blockers */}
                      <div>
                        <div className="text-xs font-semibold text-red-400 mb-2">
                          🚧 BLOCKERS ({reflection.blockers.length})
                        </div>
                        <ul className="space-y-1">
                          {reflection.blockers.slice(0, 2).map((blocker, i) => (
                            <li key={i} className="text-sm text-slate-300">• {blocker}</li>
                          ))}
                          {reflection.blockers.length > 2 && (
                            <li className="text-xs text-slate-500">+{reflection.blockers.length - 2} more</li>
                          )}
                        </ul>
                      </div>

                      {/* Insights */}
                      <div>
                        <div className="text-xs font-semibold text-blue-400 mb-2">
                          💡 INSIGHTS ({reflection.insights.length})
                        </div>
                        <ul className="space-y-1">
                          {reflection.insights.slice(0, 2).map((insight, i) => (
                            <li key={i} className="text-sm text-slate-300">• {insight}</li>
                          ))}
                          {reflection.insights.length > 2 && (
                            <li className="text-xs text-slate-500">+{reflection.insights.length - 2} more</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}