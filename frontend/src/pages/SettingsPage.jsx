import React from 'react';
import { Shield, Eye, Key, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div role="region" aria-label="Settings">
      <header className="page-header"><h1>⚙️ Settings</h1><p>Configure your ClearPath experience.</p></header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        <section className="card" aria-labelledby="role-heading">
          <h2 id="role-heading" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Eye size={18} aria-hidden="true" /> Role</h2>
          <label htmlFor="role-select" className="sr-only">Select your role</label>
          <select id="role-select" className="input" defaultValue="developer">
            <option value="developer">Developer</option>
            <option value="qa">QA Engineer</option>
            <option value="lead">Team Lead / Supervisor</option>
            <option value="manager">Manager / Director</option>
          </select>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>ClearPath adapts its features based on your role.</p>
        </section>
        <section className="card" aria-labelledby="ippo-heading">
          <h2 id="ippo-heading" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={18} aria-hidden="true" /> Ippo Preferences</h2>
          <label htmlFor="nd-setting" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer', marginBottom: 12 }}>
            <input id="nd-setting" type="checkbox" style={{ accentColor: 'var(--accent-violet)' }} aria-describedby="nd-privacy" /> Enable neurodivergent support mode
          </label>
          <p id="nd-privacy" style={{ fontSize: 12, color: 'var(--text-muted)' }}>Private — team and managers never see this setting.</p>
        </section>
        <section className="card" aria-labelledby="services-heading">
          <h2 id="services-heading" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Key size={18} aria-hidden="true" /> Connected Services</h2>
          <ul role="list" style={{ listStyle: 'none', padding: 0 }}>
            {['Google Calendar', 'Google Docs', 'Google Sheets', 'Google Slides', 'Google Tasks'].map((s) => (
              <li key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 14 }} aria-label={`${s}: Connected`}>
                <span>{s}</span><span className="badge badge-emerald" role="status">Connected</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card" aria-labelledby="nudge-heading">
          <h2 id="nudge-heading" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Database size={18} aria-hidden="true" /> Gentle Nudge</h2>
          <label htmlFor="nudge-threshold" style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Nudge threshold (days without update)</label>
          <input id="nudge-threshold" className="input" type="number" defaultValue={3} min={1} max={14} aria-describedby="nudge-help" />
          <p id="nudge-help" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>How many days before a private check-in is triggered.</p>
        </section>
      </div>
    </div>
  );
}
