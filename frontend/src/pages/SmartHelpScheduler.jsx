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
    <div role="region" aria-label="Smart Help Scheduler">
      <header className="page-header"><h1>📅 Smart Help Scheduler</h1><p>Type who you need and why. We find the slot and create the meeting.</p></header>
      <section className="card">
        <form onSubmit={handleSchedule} aria-label="Schedule a help session">
          <label htmlFor="help-request" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>What do you need?</label>
          <input id="help-request" className="input" value={requestText} onChange={(e) => setRequestText(e.target.value)} placeholder="E.g., I need 30 mins with Priya about the API design" style={{ marginBottom: 16 }} required aria-required="true" />
          <button type="submit" className="btn btn-primary" disabled={loading || !requestText.trim()} aria-busy={loading}>
            {loading ? <><Loader2 size={18} aria-hidden="true" /> Finding...</> : <><CalendarClock size={18} aria-hidden="true" /> Find & Book</>}
          </button>
        </form>
      </section>
      {error && <div className="result-panel" role="alert" aria-live="assertive" style={{ borderColor: 'rgba(244,63,94,0.3)', marginTop: 24 }}><AlertCircle size={18} aria-hidden="true" /> {error}</div>}
      {result && (
        <section className="result-panel" aria-live="polite" aria-label="Scheduling result">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🎯 Optimal Slot Found</h2>
          <div className="card" style={{ marginBottom: 16 }}>
            <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><dt style={{ fontSize: 12, color: 'var(--text-muted)' }}>From:</dt><dd style={{ fontWeight: 600, margin: 0 }}>{result.intent?.needed_from}</dd></div>
              <div><dt style={{ fontSize: 12, color: 'var(--text-muted)' }}>Duration:</dt><dd style={{ fontWeight: 600, margin: 0 }}>{result.intent?.duration_minutes} min</dd></div>
              <div><dt style={{ fontSize: 12, color: 'var(--text-muted)' }}>Topic:</dt><dd style={{ fontWeight: 600, margin: 0 }}>{result.intent?.topic}</dd></div>
              <div><dt style={{ fontSize: 12, color: 'var(--text-muted)' }}>Urgency:</dt><dd style={{ margin: 0 }}><span className="badge badge-amber">{result.intent?.urgency}</span></dd></div>
            </dl>
          </div>
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{result.proposedSlot?.summary}</h3>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}><Clock size={14} aria-hidden="true" /> {new Date(result.proposedSlot?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}><Video size={14} aria-hidden="true" /> Meet link auto-generated</span>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 16 }} aria-label="Confirm and create calendar event">📅 Confirm & Create</button>
          </div>
        </section>
      )}
    </div>
  );
}
