import React, { useState } from 'react';
import { meetingsApi } from '../services/api';
import { FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function PostMeetingIntelligence() {
  const [notes, setNotes] = useState('');
  const [actionItems, setActionItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!notes.trim()) return;
    setLoading(true); setError(null); setActionItems(null);
    try {
      const data = await meetingsApi.postIntelligence(notes);
      setActionItems(data.actionItems);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const sampleNotes = `Team sync notes - May 2nd:\n- Raghu said the API redesign is almost done, needs review by Friday\n- Priya will handle the frontend integration, deadline next Wednesday\n- We decided to postpone the database migration to next sprint\n- Snehal needs to update the test suite before the release\n- Action: Everyone should review the new coding guidelines by Monday\n- Bug #342 assigned to Karthik, high priority, fix by tomorrow`;

  return (
    <div role="region" aria-label="Post-Meeting Intelligence">
      <header className="page-header">
        <h1 id="postmeeting-heading">📋 Post-Meeting Intelligence</h1>
        <p>Paste raw meeting notes. Gemini extracts decisions, action items, owners, and deadlines.</p>
      </header>

      <section className="card" aria-labelledby="postmeeting-heading">
        <form onSubmit={handleExtract} aria-label="Extract action items from meeting notes">
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="meeting-notes" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Meeting Notes</label>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setNotes(sampleNotes)} aria-label="Load sample meeting notes into the text area">Load Sample</button>
          </div>
          <textarea id="meeting-notes" className="textarea" style={{ minHeight: 200 }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your messy meeting notes here..." required aria-required="true" />
          <button type="submit" className="btn btn-primary" disabled={loading || !notes.trim()} style={{ marginTop: 16 }} aria-busy={loading}>
            {loading ? <><Loader2 size={18} aria-hidden="true" /> Extracting...</> : <><FileText size={18} aria-hidden="true" /> Extract Action Items</>}
          </button>
        </form>
      </section>

      {error && (
        <div className="result-panel" role="alert" aria-live="assertive" style={{ borderColor: 'rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.05)', marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-rose)' }}><AlertCircle size={18} aria-hidden="true" /> {error}</div>
        </div>
      )}

      {actionItems && (
        <section className="result-panel" aria-live="polite" aria-label="Extracted action items">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={18} style={{ color: 'var(--accent-emerald)' }} aria-hidden="true" /> {actionItems.length} Action Items Extracted
          </h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0 }} role="list" aria-label="Action items list">
            {actionItems.map((item, i) => (
              <li key={i} className="action-item" style={{ animationDelay: `${i * 0.1}s` }} aria-label={`${item.priority} priority: ${item.action}, assigned to ${item.owner}, due ${item.deadline}`}>
                <div className={`action-item-priority ${item.priority}`} role="img" aria-label={`${item.priority} priority`} />
                <div className="action-item-content">
                  <div className="action-item-text">{item.action}</div>
                  <div className="action-item-meta">
                    <span aria-label={`Assigned to ${item.owner}`}>👤 {item.owner}</span> · <span aria-label={`Due ${item.deadline}`}>📅 {item.deadline}</span> · <span className={`badge badge-${item.priority === 'high' ? 'rose' : item.priority === 'medium' ? 'amber' : 'emerald'}`}>{item.priority}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }} role="toolbar" aria-label="Export actions">
            <button className="btn btn-secondary btn-sm" aria-label="Push action items to Google Sheets">📊 Push to Google Sheets</button>
            <button className="btn btn-secondary btn-sm" aria-label="Create Google Tasks for each action item">✅ Create Google Tasks</button>
          </div>
        </section>
      )}
    </div>
  );
}
