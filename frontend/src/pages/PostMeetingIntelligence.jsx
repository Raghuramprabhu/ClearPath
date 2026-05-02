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
    setLoading(true);
    setError(null);
    setActionItems(null);
    try {
      const data = await meetingsApi.postIntelligence(notes);
      setActionItems(data.actionItems);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const sampleNotes = `Team sync notes - May 2nd:
- Raghu said the API redesign is almost done, needs review by Friday
- Priya will handle the frontend integration, deadline next Wednesday
- We decided to postpone the database migration to next sprint
- Snehal needs to update the test suite before the release
- Action: Everyone should review the new coding guidelines by Monday
- Bug #342 assigned to Karthik, high priority, fix by tomorrow`;

  return (
    <div>
      <div className="page-header">
        <h1>📋 Post-Meeting Intelligence</h1>
        <p>Paste raw meeting notes. Gemini extracts decisions, action items, owners, and deadlines.</p>
      </div>

      <div className="card">
        <form onSubmit={handleExtract}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Meeting Notes</label>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setNotes(sampleNotes)}>Load Sample</button>
          </div>
          <textarea className="textarea" style={{ minHeight: 200 }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your messy meeting notes here..." />
          <button type="submit" className="btn btn-primary" disabled={loading || !notes.trim()} style={{ marginTop: 16 }}>
            {loading ? <><Loader2 size={18} className="spin" /> Extracting...</> : <><FileText size={18} /> Extract Action Items</>}
          </button>
        </form>
      </div>

      {error && (
        <div className="result-panel" style={{ borderColor: 'rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.05)', marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-rose)' }}><AlertCircle size={18} /> {error}</div>
        </div>
      )}

      {actionItems && (
        <div className="result-panel">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={18} style={{ color: 'var(--accent-emerald)' }} /> {actionItems.length} Action Items Extracted
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {actionItems.map((item, i) => (
              <div key={i} className="action-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`action-item-priority ${item.priority}`} />
                <div className="action-item-content">
                  <div className="action-item-text">{item.action}</div>
                  <div className="action-item-meta">
                    👤 {item.owner} · 📅 {item.deadline} · <span className={`badge badge-${item.priority === 'high' ? 'rose' : item.priority === 'medium' ? 'amber' : 'emerald'}`}>{item.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary btn-sm">📊 Push to Google Sheets</button>
            <button className="btn btn-secondary btn-sm">✅ Create Google Tasks</button>
          </div>
        </div>
      )}
    </div>
  );
}
