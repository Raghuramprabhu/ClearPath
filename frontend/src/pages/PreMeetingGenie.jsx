import React, { useState } from 'react';
import { meetingsApi } from '../services/api';
import { Sparkles, Loader2, FileText, AlertCircle } from 'lucide-react';

export default function PreMeetingGenie() {
  const [documentId, setDocumentId] = useState('');
  const [tasks, setTasks] = useState('');
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBrief(null);
    try {
      const taskList = tasks ? tasks.split('\n').filter(Boolean).map((t, i) => ({ id: i + 1, title: t.trim() })) : [];
      const data = await meetingsApi.preBriefManual(documentId || 'demo', taskList);
      setBrief(data.brief);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>✨ Pre-Meeting Genie</h1>
        <p>Get a personalised AI brief before any meeting. Never walk in cold again.</p>
      </div>

      <div className="card">
        <form onSubmit={handleGenerate}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Google Doc ID (agenda)
            </label>
            <input className="input" value={documentId} onChange={(e) => setDocumentId(e.target.value)} placeholder="Paste Google Doc ID or leave blank for demo" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Your current tasks (one per line)
            </label>
            <textarea className="textarea" value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder={"API design review\nUpdate documentation\nFix login bug"} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <><Loader2 size={18} className="spin" /> Generating Brief...</> : <><Sparkles size={18} /> Generate My Brief</>}
          </button>
        </form>
      </div>

      {error && (
        <div className="result-panel" style={{ borderColor: 'rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.05)', marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-rose)' }}>
            <AlertCircle size={18} /> {error}
          </div>
        </div>
      )}

      {brief && (
        <div className="result-panel">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} style={{ color: 'var(--accent-indigo)' }} /> Your Meeting Brief
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {brief.points && brief.points.map((point, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: 14, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--accent-indigo)', fontWeight: 700 }}>{i + 1}.</span>
                <span style={{ fontSize: 14 }}>{point}</span>
              </div>
            ))}
          </div>
          {brief.prep_questions && brief.prep_questions.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Prep Questions</h4>
              {brief.prep_questions.map((q, i) => (
                <div key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', padding: '6px 0', display: 'flex', gap: 8 }}>
                  <span>❓</span> {q}
                </div>
              ))}
            </div>
          )}
          {brief.time_estimate_saved_minutes && (
            <div className="badge badge-emerald" style={{ marginTop: 16 }}>⏱ ~{brief.time_estimate_saved_minutes} min saved</div>
          )}
        </div>
      )}
    </div>
  );
}
