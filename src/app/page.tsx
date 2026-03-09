"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("sutra_user_name");
    setUserName(name);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Welcome to Project Sutra
          </h1>
          <p className="text-2xl text-slate-300 mb-8">
            Your AI Co-Pilot for Personal Mastery
          </p>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Transform vague goals into daily actions. Track your progress. Build lasting habits.
            {userName && ` Welcome back, ${userName}!`}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <FeatureCard
            icon="💬"
            title="Interview"
            description="Deep conversations to understand your goals"
            href="/interview"
            color="from-blue-600 to-cyan-600"
          />
          <FeatureCard
            icon="🚀"
            title="Daily Mission"
            description="Personalized action plans for each day"
            href="/mission"
            color="from-purple-600 to-pink-600"
          />
          <FeatureCard
            icon="🌙"
            title="Reflection"
            description="End-of-day insights and wisdom"
            href="/reflection"
            color="from-orange-600 to-red-600"
          />
          <FeatureCard
            icon="📈"
            title="Progress Track"
            description="Visualize your journey and growth"
            href="/track"
            color="from-green-600 to-emerald-600"
          />
        </div>

        {/* How It Works */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step
              number="1"
              title="Set Your Goals"
              description="Share your aspirations in a conversational interview. We'll help you clarify what you truly want."
            />
            <Step
              number="2"
              title="Daily Missions"
              description="Get personalized daily action plans that break down your goals into achievable tasks."
            />
            <Step
              number="3"
              title="Track & Grow"
              description="Reflect on your day, track progress, and gain insights that help you improve continuously."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => router.push("/interview")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-12 py-6 rounded-lg font-semibold text-2xl transition-all duration-200 transform hover:scale-105"
          >
            {userName ? "Continue Your Journey" : "Start Your Journey"} →
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className={`bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer group`}
    >
      <div className={`text-6xl mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {title}
      </h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-2xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}