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
    try {
      const data = await nudgeApi.respond(selectedTask.id, option, selectedTask.title);
      setResponse(data);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>💛 Gentle Nudge</h1>
        <p>Not a follow-up. A check-in. Psychologically safe task monitoring.</p>
      </div>
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(99,102,241,0.05))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Shield size={16} style={{ color: 'var(--accent-emerald)' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-emerald)' }}>Privacy First</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Managers are never notified unless the person explicitly asks for support. This is a check-in, not surveillance.</p>
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>Team Tasks</h3>
        {sampleTasks.map((t) => {
          const days = Math.floor((Date.now() - new Date(t.lastUpdated)) / 86400000);
          const isStuck = days >= 3 && t.status !== 'completed';
          return (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>👤 {t.assignee} · Last update: {days}d ago · Due: {t.deadline}</div>
              </div>
              {isStuck && <span className="badge badge-amber">Needs check-in</span>}
              {t.status === 'completed' && <span className="badge badge-emerald">Done</span>}
              {isStuck && (
                <button className="btn btn-secondary btn-sm" onClick={() => handleCheckTask(t)} disabled={loading}>
                  <Heart size={14} /> Nudge
                </button>
              )}
            </div>
          );
        })}
      </div>
      {error && <div className="result-panel" style={{ borderColor: 'rgba(244,63,94,0.3)' }}><AlertCircle size={18} /> {error}</div>}
      {loading && !nudge && <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><div className="loading-spinner" /></div>}
      {nudge && !response && (
        <div className="nudge-card">
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>{nudge.message}</p>
          <div className="nudge-options">
            {nudge.options?.map((opt) => (
              <button key={opt.id} className="nudge-option" onClick={() => handleRespond(opt.id)} disabled={loading}>
                {opt.id === 'more_time' && <Clock size={18} />}
                {opt.id === 'need_input' && <Users size={18} />}
                {opt.id === 'need_support' && <Shield size={18} />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {response && (
        <div className="celebration">
          <div className="celebration-emoji">{response.managerNotified ? '🤝' : '✅'}</div>
          <div className="celebration-text">{response.message}</div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
            {response.managerNotified ? 'Your lead has context. No red flags, just support.' : 'No manager was pinged. No one felt watched. The work just moved forward.'}
          </p>
        </div>
      )}
    </div>
  );
}
