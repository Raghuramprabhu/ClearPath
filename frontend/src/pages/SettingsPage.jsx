import React from 'react';
import { Shield, Eye, Key, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <div className="page-header"><h1>⚙️ Settings</h1><p>Configure your ClearPath experience.</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Eye size={18} /> Role</h3>
          <select className="input" defaultValue="developer">
            <option value="developer">Developer</option>
            <option value="qa">QA Engineer</option>
            <option value="lead">Team Lead / Supervisor</option>
            <option value="manager">Manager / Director</option>
          </select>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>ClearPath adapts its features based on your role.</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={18} /> Ippo Preferences</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer', marginBottom: 12 }}>
            <input type="checkbox" style={{ accentColor: 'var(--accent-violet)' }} /> Enable neurodivergent support mode
          </label>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Private — team and managers never see this setting.</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Key size={18} /> Connected Services</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Google Calendar', 'Google Docs', 'Google Sheets', 'Google Slides', 'Google Tasks'].map((s) => (
              <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 14 }}>
                <span>{s}</span><span className="badge badge-emerald">Connected</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Database size={18} /> Gentle Nudge</h3>
          <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Nudge threshold (days without update)</label>
          <input className="input" type="number" defaultValue={3} min={1} max={14} />
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>How many days before a private check-in is triggered.</p>
        </div>
      </div>
    </div>
  );
}
