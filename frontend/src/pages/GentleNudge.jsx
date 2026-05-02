import React, { useState } from 'react';
import { nudgeApi } from '../services/api';
import { Heart, Loader2, AlertCircle, Clock, Users, Shield } from 'lucide-react';

const sampleTasks = [
  { id: '1', title: 'API documentation update', assignee: 'Raghu', lastUpdated: new Date(Date.now() - 4 * 86400000).toISOString(), deadline: 'May 5', status: 'in_progress' },
  { id: '2', title: 'Fix authentication bug', assignee: 'Priya', lastUpdated: new Date(Date.now() - 6 * 86400000).toISOString(), deadline: 'May 3', status: 'in_progress' },
  { id: '3', title: 'Design review', assignee: 'Snehal', lastUpdated: new Date().toISOString(), deadline: 'May 7', status: 'completed' },
];

export default function GentleNudge() {
  const [nudge, setNudge] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckTask = async (task) => {
    setSelectedTask(task); setLoading(true); setError(null); setNudge(null); setResponse(null);
    try {
      const days = Math.floor((Date.now() - new Date(task.lastUpdated)) / 86400000);
      const data = await nudgeApi.check(task.title, task.assignee, days, task.deadline);
      setNudge(data.nudge);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const handleRespond = async (option) => {
    setLoading(true);
    try { const data = await nudgeApi.respond(selectedTask.id, option, selectedTask.title); setResponse(data); }
    catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div role="region" aria-label="Gentle Nudge">
      <header className="page-header">
        <h1>💛 Gentle Nudge</h1>
        <p>Not a follow-up. A check-in. Psychologically safe task monitoring.</p>
      </header>
      <section className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(99,102,241,0.05))' }} aria-label="Privacy notice">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Shield size={16} style={{ color: 'var(--accent-emerald)' }} aria-hidden="true" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-emerald)' }}>Privacy First</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Managers are never notified unless the person explicitly asks for support.</p>
      </section>
      <section className="card" style={{ marginBottom: 24 }} aria-label="Team tasks requiring attention">
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>Team Tasks</h2>
        <ul role="list" style={{ listStyle: 'none', padding: 0 }}>
          {sampleTasks.map((t) => {
            const days = Math.floor((Date.now() - new Date(t.lastUpdated)) / 86400000);
            const isStuck = days >= 3 && t.status !== 'completed';
            return (
              <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }} aria-label={`${t.title}, assigned to ${t.assignee}, last updated ${days} days ago, ${isStuck ? 'needs check-in' : t.status}`}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>👤 {t.assignee} · Last update: {days}d ago · Due: {t.deadline}</div>
                </div>
                {isStuck && <span className="badge badge-amber" role="status">Needs check-in</span>}
                {t.status === 'completed' && <span className="badge badge-emerald" role="status">Done</span>}
                {isStuck && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleCheckTask(t)} disabled={loading} aria-label={`Send gentle nudge for task: ${t.title}`}>
                    <Heart size={14} aria-hidden="true" /> Nudge
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>
      {error && <div className="result-panel" role="alert" aria-live="assertive" style={{ borderColor: 'rgba(244,63,94,0.3)' }}><AlertCircle size={18} aria-hidden="true" /> {error}</div>}
      {loading && !nudge && <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }} role="status" aria-label="Generating nudge"><div className="loading-spinner" aria-hidden="true" /><span className="sr-only">Generating gentle nudge...</span></div>}
      {nudge && !response && (
        <section className="nudge-card" aria-live="polite" aria-label="Gentle nudge message" role="region">
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>{nudge.message}</p>
          <div className="nudge-options" role="group" aria-label="Response options">
            {nudge.options?.map((opt) => (
              <button key={opt.id} className="nudge-option" onClick={() => handleRespond(opt.id)} disabled={loading} aria-label={opt.label}>
                {opt.id === 'more_time' && <Clock size={18} aria-hidden="true" />}
                {opt.id === 'need_input' && <Users size={18} aria-hidden="true" />}
                {opt.id === 'need_support' && <Shield size={18} aria-hidden="true" />}
                {opt.label}
              </button>
            ))}
          </div>
        </section>
      )}
      {response && (
        <div className="celebration" role="status" aria-live="polite">
          <div className="celebration-emoji" aria-hidden="true">{response.managerNotified ? '🤝' : '✅'}</div>
          <div className="celebration-text">{response.message}</div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
            {response.managerNotified ? 'Your lead has context. No red flags, just support.' : 'No manager was pinged. No one felt watched. The work just moved forward.'}
          </p>
        </div>
      )}
    </div>
  );
}
