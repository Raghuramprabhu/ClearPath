import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { gsiReady, handleCredentialResponse } = useAuth();

  useEffect(() => {
    if (gsiReady) {
      window.google.accounts.id.initialize({
        client_id: '998489824152-hn6ha7tj83l26c3v9lgcrmm7i7pk5cho.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });
      const btnEl = document.getElementById('google-signin-button');
      if (btnEl) {
        window.google.accounts.id.renderButton(btnEl, {
          theme: 'filled_black', size: 'large', text: 'signin_with', shape: 'rectangular', width: 280,
        });
      }
    }
  }, [gsiReady, handleCredentialResponse]);

  const features = [
    '✨ Pre-Meeting Genie — AI briefs before every meeting',
    '📋 Post-Meeting Intel — auto-extract action items',
    '📅 Smart Scheduling — natural language booking',
    '💛 Gentle Nudge — support, not surveillance',
    '🧩 Ippo — momentum-friendly task breakdown',
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-icon login-logo">CP</div>
        <h1>ClearPath</h1>
        <p className="tagline">You think. We coordinate.</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div id="google-signin-button"></div>
        </div>
        {!gsiReady && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>Loading sign-in...</p>}
        <div className="features-preview">
          <p>What you get</p>
          <ul>
            {features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
