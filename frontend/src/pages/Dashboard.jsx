import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Users, Brain, Heart } from 'lucide-react';

const features = [
  { path: '/pre-meeting', icon: '✨', color: 'rgba(99,102,241,0.15)', title: 'Pre-Meeting Genie', desc: 'AI-generated personalised briefs 30 min before every meeting.' },
  { path: '/post-meeting', icon: '📋', color: 'rgba(16,185,129,0.15)', title: 'Post-Meeting Intel', desc: 'Paste raw notes. Get structured action items automatically.' },
  { path: '/smart-help', icon: '📅', color: 'rgba(6,182,212,0.15)', title: 'Smart Help Scheduler', desc: 'Tell us who you need and why. We find the slot.' },
  { path: '/daily-offload', icon: '☀️', color: 'rgba(245,158,11,0.15)', title: 'Daily Cognitive Offload', desc: 'Your optimal day, recommended by AI.' },
  { path: '/gentle-nudge', icon: '💛', color: 'rgba(245,158,11,0.15)', title: 'Gentle Nudge', desc: 'Psychologically safe task monitoring.' },
  { path: '/ippo', icon: '🧩', color: 'rgba(139,92,246,0.15)', title: 'Ippo Tasks', desc: 'Break overwhelming tasks into momentum-friendly steps.' },
];

const stats = [
  { value: '87%', label: 'Less meeting prep time' },
  { value: '12+', label: 'Google APIs integrated' },
  { value: '0', label: 'Managers pinged by nudge' },
  { value: '∞', label: 'Cognitive load saved' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div role="region" aria-label="Dashboard">
      <header className="page-header">
        <h1 id="dashboard-heading">Welcome to ClearPath</h1>
        <p>Your AI-powered coordination layer. Pick a feature to get started.</p>
      </header>

      <section aria-label="Key metrics" className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" role="figure" aria-label={`${stat.value} ${stat.label}`}>
            <div className="stat-value" aria-hidden="true">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      <section aria-label="Features" className="feature-grid">
        {features.map((f) => (
          <article
            key={f.path}
            className="feature-card"
            onClick={() => navigate(f.path)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(f.path); } }}
            tabIndex={0}
            role="link"
            aria-label={`${f.title}: ${f.desc}`}
          >
            <div className="feature-icon" style={{ background: f.color }} aria-hidden="true">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, color: 'var(--accent-indigo)', fontSize: 13, fontWeight: 600 }} aria-hidden="true">
              Open <ArrowRight size={14} />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
