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
    <div className="login-container" role="main" aria-label="Login page">
      <div className="login-card" role="region" aria-label="Sign in to ClearPath">
        <div className="logo-icon login-logo" aria-hidden="true">CP</div>
        <h1 id="login-heading">ClearPath</h1>
        <p className="tagline" id="login-description">You think. We coordinate.</p>
        <div style={{ display: 'flex', justifyContent: 'center' }} role="region" aria-label="Google Sign-In">
          <div id="google-signin-button" aria-describedby="login-description"></div>
        </div>
        {!gsiReady && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }} role="status" aria-live="polite">
            Loading sign-in...
          </p>
        )}
        <div className="features-preview" aria-labelledby="features-heading">
          <p id="features-heading">What you get</p>
          <ul role="list">
            {features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
