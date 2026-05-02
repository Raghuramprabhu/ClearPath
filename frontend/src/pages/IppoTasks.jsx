import React, { useState } from 'react';
import { ippoApi } from '../services/api';
import { Puzzle, Loader2, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

export default function IppoTasks() {
  const [taskDesc, setTaskDesc] = useState('');
  const [ndMode, setNdMode] = useState(false);
  const [breakdown, setBreakdown] = useState(null);
  const [recovery, setRecovery] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [celebration, setCelebration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBreakdown = async (e) => {
    e.preventDefault();
    if (!taskDesc.trim()) return;
    setLoading(true); setError(null); setBreakdown(null); setRecovery(null);
    setCompletedSteps(new Set()); setCelebration(null);
    try {
      const data = await ippoApi.breakdown(taskDesc, ndMode);
      setBreakdown(data.breakdown);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const handleComplete = async (stepNum) => {
    const total = breakdown.steps.length;
    const isFullComplete = stepNum === total;
    try {
      const data = await ippoApi.complete(breakdown.original_task, stepNum, total, isFullComplete);
      setCompletedSteps((prev) => new Set([...prev, stepNum]));
      setCelebration(data);
      setTimeout(() => setCelebration(null), 3000);
    } catch (err) { setError(err.message); }
  };

  const handleRecovery = async () => {
    setLoading(true); setError(null); setRecovery(null);
    try {
      const data = await ippoApi.recovery(taskDesc || 'Start working on my task');
      setRecovery(data.recovery);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header"><h1>🧩 Ippo — Task Intelligence</h1>
        <p>Break overwhelming tasks into momentum-friendly steps. Built for how humans actually work.</p>
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        <form onSubmit={handleBreakdown}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Describe your task</label>
          <textarea className="textarea" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} placeholder="E.g., Refactor the authentication module to use OAuth 2.0 with token refresh" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
            <button type="submit" className="btn btn-primary" disabled={loading || !taskDesc.trim()}>
              {loading ? <><Loader2 size={18} /> Breaking down...</> : <><Puzzle size={18} /> Break It Down</>}
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={ndMode} onChange={(e) => setNdMode(e.target.checked)}
                style={{ accentColor: 'var(--accent-violet)' }} />
              Supportive mode (neurodivergent-friendly)
            </label>
          </div>
        </form>
        <button className="btn btn-ghost btn-sm" onClick={handleRecovery} disabled={loading} style={{ marginTop: 12 }}>
          <RotateCcw size={14} /> Can't start? Try recovery protocol
        </button>
      </div>

      {error && <div className="result-panel" style={{ borderColor: 'rgba(244,63,94,0.3)' }}><AlertCircle size={18} /> {error}</div>}

      {celebration && (
        <div className="celebration">
          <div className="celebration-emoji">🎉</div>
          <div className="celebration-text">{celebration.message}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{celebration.progress?.percentComplete}% complete</div>
        </div>
      )}

      {breakdown && (
        <div className="result-panel">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🧩 Your Momentum Plan</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            Est. {breakdown.estimated_total_minutes} min total · {breakdown.steps?.length} steps
          </p>
          <div className="ippo-steps">
            {breakdown.steps?.map((step) => (
              <div key={step.step_number} className={`ippo-step ${completedSteps.has(step.step_number) ? 'completed' : ''}`}>
                <div className="ippo-step-number">
                  {completedSteps.has(step.step_number) ? <CheckCircle2 size={14} /> : step.step_number}
                </div>
                <div className="ippo-step-content">
                  <div className="ippo-step-title">
                    {step.step}
                    {step.momentum_starter && <span className="momentum-badge">⚡ Start here</span>}
                  </div>
                  <div className="ippo-step-effort">~{step.effort_minutes} min</div>
                </div>
                {!completedSteps.has(step.step_number) && (
                  <button className="btn btn-sm btn-success" onClick={() => handleComplete(step.step_number)}>Done</button>
                )}
              </div>
            ))}
          </div>
          {breakdown.momentum_tip && (
            <div style={{ marginTop: 20, padding: 16, background: 'rgba(139,92,246,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139,92,246,0.2)', fontSize: 13, color: 'var(--text-secondary)' }}>
              💡 <strong>Tip:</strong> {breakdown.momentum_tip}
            </div>
          )}
        </div>
      )}

      {recovery && (
        <div className="result-panel" style={{ borderColor: 'rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.05)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🌱 Recovery Protocol</h3>
          <p style={{ fontSize: 14, marginBottom: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{recovery.acknowledgement}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recovery.recovery_steps?.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: 14, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 20 }}>{step.icon}</span>
                <div><div style={{ fontSize: 14, fontWeight: 500 }}>{step.step}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{step.duration_seconds}s</div></div>
              </div>
            ))}
          </div>
          {recovery.momentum_starter && (
            <div style={{ marginTop: 16, padding: 16, background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ fontSize: 12, color: 'var(--accent-emerald)', fontWeight: 600, marginBottom: 4 }}>⚡ YOUR SMALLEST FIRST ACTION</div>
              <div style={{ fontSize: 14 }}>{recovery.momentum_starter}</div>
            </div>
          )}
          {recovery.encouragement && <p style={{ marginTop: 12, fontSize: 13, color: 'var(--accent-violet)', fontStyle: 'italic' }}>{recovery.encouragement}</p>}
        </div>
      )}
    </div>
  );
}
