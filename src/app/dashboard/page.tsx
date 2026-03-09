"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

type UserStats = {
  total_users: number;
  total_goals: number;
  total_missions: number;
  total_reflections: number;
  recent_users: Array<{
    name: string;
    user_id: string;
    created_at: string;
    goals_count: number;
  }>;
  daily_activity: Array<{
    date: string;
    users: number;
  }>;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

const fetchStats = async () => {
  console.log("🚀 Attempting to fetch from backend..."); // This MUST appear in your browser console (F12)
  try {
    const res = await axios.get("http://localhost:8000/api/admin/stats");
    console.log("✅ Data received:", res.data);
    setStats(res.data);
  } catch (error) {
    console.error("❌ API Call Failed:", error);
      // Mock data for demonstration
      setStats({
        total_users: 42,
        total_goals: 87,
        total_missions: 156,
        total_reflections: 134,
        recent_users: [
          { name: "Alice", user_id: "user_001", created_at: "2025-12-24", goals_count: 3 },
          { name: "Bob", user_id: "user_002", created_at: "2025-12-24", goals_count: 2 },
          { name: "Charlie", user_id: "user_003", created_at: "2025-12-23", goals_count: 4 },
        ],
        daily_activity: [
          { date: "Dec 20", users: 8 },
          { date: "Dec 21", users: 12 },
          { date: "Dec 22", users: 15 },
          { date: "Dec 23", users: 18 },
          { date: "Dec 24", users: 22 },
          { date: "Dec 25", users: 28 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8 flex items-center justify-center">
        <div className="text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Mission Control Dashboard
        </h1>
        <p className="text-slate-400 mb-8">Track your users' journey to mastery</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.total_users || 0}
            icon="👥"
            gradient="from-blue-600 to-cyan-600"
          />
          <StatCard
            title="Active Goals"
            value={stats?.total_goals || 0}
            icon="🎯"
            gradient="from-purple-600 to-pink-600"
          />
          <StatCard
            title="Daily Missions"
            value={stats?.total_missions || 0}
            icon="🚀"
            gradient="from-green-600 to-emerald-600"
          />
          <StatCard
            title="Reflections"
            value={stats?.total_reflections || 0}
            icon="✨"
            gradient="from-orange-600 to-red-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">User Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.daily_activity || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    border: "1px solid #7C3AED",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#A855F7"
                  strokeWidth={3}
                  dot={{ fill: "#A855F7", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Bar Chart */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Activity Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Users", count: stats?.total_users || 0 },
                  { name: "Goals", count: stats?.total_goals || 0 },
                  { name: "Missions", count: stats?.total_missions || 0 },
                  { name: "Reflections", count: stats?.total_reflections || 0 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    border: "1px solid #7C3AED",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#A855F7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400">Name</th>
                  <th className="text-left py-3 px-4 text-slate-400">User ID</th>
                  <th className="text-left py-3 px-4 text-slate-400">Joined</th>
                  <th className="text-left py-3 px-4 text-slate-400">Goals</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_users.map((user, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-sm">
                      {user.user_id}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{user.created_at}</td>
                    <td className="py-3 px-4">
                      <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {user.goals_count} goals
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: number;
  icon: string;
  gradient: string;
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:scale-105 transition-transform">
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl">{icon}</span>
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} opacity-20`}
        />
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
        {value}
      </p>
    </div>
  );
}