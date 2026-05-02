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
    try {
      const data = await schedulerApi.dailyOffload(sampleTasks, []);
      setSchedule(data.schedule);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header"><h1>☀️ Daily Cognitive Offload</h1><p>Let AI recommend your optimal day. Deep work mornings, meetings afternoons.</p></div>
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>Today's Tasks</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sampleTasks.map((t) => (
            <div key={t.id} className="action-item">
              <div className={`action-item-priority ${t.priority}`} />
              <div className="action-item-content">
                <div className="action-item-text">{t.title}</div>
                <div className="action-item-meta">Due: {t.due}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={loading} style={{ marginTop: 20, width: '100%' }}>
          {loading ? <><Loader2 size={18} /> Optimizing...</> : <><Sun size={18} /> Generate My Optimal Day</>}
        </button>
      </div>
      {error && <div className="result-panel" style={{ borderColor: 'rgba(244,63,94,0.3)' }}><AlertCircle size={18} /> {error}</div>}
      {schedule && Array.isArray(schedule) && (
        <div className="result-panel">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📅 Your Recommended Schedule</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {schedule.map((block, i) => (
              <div key={i} className="schedule-block" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="schedule-time">{block.start_time} – {block.end_time}</div>
                <div className="schedule-detail">
                  <div className="schedule-task">{block.task_title || block.task_id}</div>
                  <div className="schedule-reason">{block.reason}</div>
                </div>
                <span className={`badge ${block.type === 'deep_work' ? 'badge-indigo' : block.type === 'meeting' ? 'badge-cyan' : 'badge-emerald'}`}>{block.type?.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 20 }}><Calendar size={16} /> Push to Google Calendar</button>
        </div>
      )}
    </div>
  );
}
