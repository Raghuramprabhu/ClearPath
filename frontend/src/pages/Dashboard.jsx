import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, CalendarClock, Sun, Heart, Puzzle, ArrowRight, Zap, Users, Brain } from 'lucide-react';

const features = [
  { path: '/pre-meeting', icon: '✨', color: 'rgba(99,102,241,0.15)', title: 'Pre-Meeting Genie', desc: 'AI-generated personalised briefs 30 min before every meeting. Never walk in cold again.' },
  { path: '/post-meeting', icon: '📋', color: 'rgba(16,185,129,0.15)', title: 'Post-Meeting Intel', desc: 'Paste raw notes. Get structured action items, owners, and deadlines automatically.' },
  { path: '/smart-help', icon: '📅', color: 'rgba(6,182,212,0.15)', title: 'Smart Help Scheduler', desc: 'Tell us who you need and why. We find the slot and create the meeting.' },
  { path: '/daily-offload', icon: '☀️', color: 'rgba(245,158,11,0.15)', title: 'Daily Cognitive Offload', desc: 'Your optimal day, recommended by AI. Deep work mornings, meetings afternoons.' },
  { path: '/gentle-nudge', icon: '💛', color: 'rgba(245,158,11,0.15)', title: 'Gentle Nudge', desc: 'Not a follow-up. A check-in. Psychologically safe task monitoring.' },
  { path: '/ippo', icon: '🧩', color: 'rgba(139,92,246,0.15)', title: 'Ippo Tasks', desc: 'Break overwhelming tasks into momentum-friendly steps. Built for how humans actually work.' },
];

const stats = [
  { value: '87%', label: 'Less meeting prep time', icon: Zap },
  { value: '12+', label: 'Google APIs integrated', icon: Users },
  { value: '0', label: 'Managers pinged by nudge', icon: Heart },
  { value: '∞', label: 'Cognitive load saved', icon: Brain },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <h1>Welcome to ClearPath</h1>
        <p>Your AI-powered coordination layer. Pick a feature to get started.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="feature-grid">
        {features.map((f) => (
          <div key={f.path} className="feature-card" onClick={() => navigate(f.path)}>
            <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, color: 'var(--accent-indigo)', fontSize: 13, fontWeight: 600 }}>
              Open <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
