import React, { useState } from 'react';
import { schedulerApi } from '../services/api';
import { Sun, Loader2, AlertCircle, Calendar } from 'lucide-react';

const sampleTasks = [
  { id: '1', title: 'Write API spec document', due: 'Today', priority: 'high' },
  { id: '2', title: 'Review pull request #42', due: 'Today', priority: 'medium' },
  { id: '3', title: 'Update test coverage', due: 'Tomorrow', priority: 'medium' },
  { id: '4', title: 'Team standup prep', due: 'Today', priority: 'low' },
  { id: '5', title: 'Design review feedback', due: 'Wednesday', priority: 'high' },
];

export default function DailyCognitiveOffload() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true); setError(null); setSchedule(null);
    try { const data = await schedulerApi.dailyOffload(sampleTasks, []); setSchedule(data.schedule); }
    catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div role="region" aria-label="Daily Cognitive Offload">
      <header className="page-header"><h1>☀️ Daily Cognitive Offload</h1><p>Let AI recommend your optimal day. Deep work mornings, meetings afternoons.</p></header>
      <section className="card" style={{ marginBottom: 24 }} aria-label="Today's tasks">
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>Today's Tasks</h2>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0 }} role="list">
          {sampleTasks.map((t) => (
            <li key={t.id} className="action-item" aria-label={`${t.title}, ${t.priority} priority, due ${t.due}`}>
              <div className={`action-item-priority ${t.priority}`} role="img" aria-label={`${t.priority} priority`} />
              <div className="action-item-content">
                <div className="action-item-text">{t.title}</div>
                <div className="action-item-meta">Due: {t.due}</div>
              </div>
            </li>
          ))}
        </ul>
        <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={loading} style={{ marginTop: 20, width: '100%' }} aria-busy={loading}>
          {loading ? <><Loader2 size={18} aria-hidden="true" /> Optimizing...</> : <><Sun size={18} aria-hidden="true" /> Generate My Optimal Day</>}
        </button>
      </section>
      {error && <div className="result-panel" role="alert" aria-live="assertive" style={{ borderColor: 'rgba(244,63,94,0.3)' }}><AlertCircle size={18} aria-hidden="true" /> {error}</div>}
      {schedule && Array.isArray(schedule) && (
        <section className="result-panel" aria-live="polite" aria-label="Recommended daily schedule">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📅 Your Recommended Schedule</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0 }} role="list">
            {schedule.map((block, i) => (
              <li key={i} className="schedule-block" style={{ animationDelay: `${i * 0.1}s` }} aria-label={`${block.start_time} to ${block.end_time}: ${block.task_title || block.task_id}. ${block.reason}`}>
                <div className="schedule-time" aria-hidden="true">{block.start_time} – {block.end_time}</div>
                <div className="schedule-detail">
                  <div className="schedule-task">{block.task_title || block.task_id}</div>
                  <div className="schedule-reason">{block.reason}</div>
                </div>
                <span className={`badge ${block.type === 'deep_work' ? 'badge-indigo' : block.type === 'meeting' ? 'badge-cyan' : 'badge-emerald'}`}>{block.type?.replace('_', ' ')}</span>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" style={{ marginTop: 20 }} aria-label="Push recommended schedule to Google Calendar"><Calendar size={16} aria-hidden="true" /> Push to Google Calendar</button>
        </section>
      )}
    </div>
  );
}
