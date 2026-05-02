import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PreMeetingGenie from './pages/PreMeetingGenie';
import PostMeetingIntelligence from './pages/PostMeetingIntelligence';
import SmartHelpScheduler from './pages/SmartHelpScheduler';
import DailyCognitiveOffload from './pages/DailyCognitiveOffload';
import GentleNudge from './pages/GentleNudge';
import IppoTasks from './pages/IppoTasks';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pre-meeting" element={<PreMeetingGenie />} />
          <Route path="/post-meeting" element={<PostMeetingIntelligence />} />
          <Route path="/smart-help" element={<SmartHelpScheduler />} />
          <Route path="/daily-offload" element={<DailyCognitiveOffload />} />
          <Route path="/gentle-nudge" element={<GentleNudge />} />
          <Route path="/ippo" element={<IppoTasks />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
