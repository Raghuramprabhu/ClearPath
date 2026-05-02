import React, { useState } from 'react';
import { meetingsApi } from '../services/api';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function PreMeetingGenie() {
  const [documentId, setDocumentId] = useState('');
  const [tasks, setTasks] = useState('');
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setBrief(null);
    try {
      const taskList = tasks ? tasks.split('\n').filter(Boolean).map((t, i) => ({ id: i + 1, title: t.trim() })) : [];
      const data = await meetingsApi.preBriefManual(documentId || 'demo', taskList);
      setBrief(data.brief);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div role="region" aria-label="Pre-Meeting Genie">
      <header className="page-header">
        <h1 id="premeeting-heading">✨ Pre-Meeting Genie</h1>
        <p id="premeeting-desc">Get a personalised AI brief before any meeting. Never walk in cold again.</p>
      </header>

      <section className="card" aria-labelledby="premeeting-heading" aria-describedby="premeeting-desc">
        <form onSubmit={handleGenerate} aria-label="Generate meeting brief">
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="doc-id" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Google Doc ID (agenda)
            </label>
            <input id="doc-id" className="input" value={documentId} onChange={(e) => setDocumentId(e.target.value)} placeholder="Paste Google Doc ID or leave blank for demo" aria-describedby="doc-id-help" />
            <span id="doc-id-help" className="sr-only">Optional. Leave blank to use a demo agenda.</span>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="tasks-input" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Your current tasks (one per line)
            </label>
            <textarea id="tasks-input" className="textarea" value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder={"API design review\nUpdate documentation\nFix login bug"} aria-describedby="tasks-help" />
            <span id="tasks-help" className="sr-only">Enter one task per line to personalise your brief.</span>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} aria-busy={loading}>
            {loading ? <><Loader2 size={18} aria-hidden="true" /> Generating Brief...</> : <><Sparkles size={18} aria-hidden="true" /> Generate My Brief</>}
          </button>
        </form>
      </section>

      {error && (
        <div className="result-panel" role="alert" aria-live="assertive" style={{ borderColor: 'rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.05)', marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-rose)' }}><AlertCircle size={18} aria-hidden="true" /> {error}</div>
        </div>
      )}

      {brief && (
        <section className="result-panel" aria-label="Generated meeting brief" aria-live="polite">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} style={{ color: 'var(--accent-indigo)' }} aria-hidden="true" /> Your Meeting Brief
          </h2>
          <ol style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', padding: 0 }} aria-label="Brief points">
            {brief.points && brief.points.map((point, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, padding: 14, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--accent-indigo)', fontWeight: 700 }} aria-hidden="true">{i + 1}.</span>
                <span style={{ fontSize: 14 }}>{point}</span>
              </li>
            ))}
          </ol>
          {brief.prep_questions && brief.prep_questions.length > 0 && (
            <div style={{ marginTop: 20 }} role="region" aria-label="Preparation questions">
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Prep Questions</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {brief.prep_questions.map((q, i) => (
                  <li key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', padding: '6px 0', display: 'flex', gap: 8 }}>
                    <span aria-hidden="true">❓</span> {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {brief.time_estimate_saved_minutes && (
            <div className="badge badge-emerald" style={{ marginTop: 16 }} role="status">⏱ ~{brief.time_estimate_saved_minutes} min saved</div>
          )}
        </section>
      )}
    </div>
  );
}
