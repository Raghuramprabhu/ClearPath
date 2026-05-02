import React, { useState } from 'react';
import { schedulerApi } from '../services/api';
import { CalendarClock, Loader2, AlertCircle, Video, Clock } from 'lucide-react';

export default function SmartHelpScheduler() {
  const [requestText, setRequestText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!requestText.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try { const data = await schedulerApi.smartHelp(requestText); setResult(data); }
    catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header"><h1>📅 Smart Help Scheduler</h1><p>Type who you need and why. We find the slot and create the meeting.</p></div>
      <div className="card">
        <form onSubmit={handleSchedule}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>What do you need?</label>
          <input className="input" value={requestText} onChange={(e) => setRequestText(e.target.value)} placeholder="E.g., I need 30 mins with Priya about the API design" style={{ marginBottom: 16 }} />
          <button type="submit" className="btn btn-primary" disabled={loading || !requestText.trim()}>
            {loading ? <><Loader2 size={18} /> Finding...</> : <><CalendarClock size={18} /> Find & Book</>}
          </button>
        </form>
      </div>
      {error && <div className="result-panel" style={{ borderColor: 'rgba(244,63,94,0.3)', marginTop: 24 }}><AlertCircle size={18} /> {error}</div>}
      {result && (
        <div className="result-panel">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🎯 Optimal Slot Found</h3>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>From:</span><div style={{ fontWeight: 600 }}>{result.intent?.needed_from}</div></div>
              <div><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Duration:</span><div style={{ fontWeight: 600 }}>{result.intent?.duration_minutes} min</div></div>
              <div><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Topic:</span><div style={{ fontWeight: 600 }}>{result.intent?.topic}</div></div>
              <div><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Urgency:</span><span className="badge badge-amber">{result.intent?.urgency}</span></div>
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{result.proposedSlot?.summary}</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}><Clock size={14} /> {new Date(result.proposedSlot?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}><Video size={14} /> Meet link auto-generated</span>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 16 }}>📅 Confirm & Create</button>
          </div>
        </div>
      )}
    </div>
  );
}
