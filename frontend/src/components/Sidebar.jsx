import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard, Sparkles, FileText, CalendarClock,
  Sun, Heart, Puzzle, Settings, LogOut
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
];

const featureItems = [
  { path: '/pre-meeting', icon: Sparkles, label: 'Pre-Meeting Genie' },
  { path: '/post-meeting', icon: FileText, label: 'Post-Meeting Intel' },
  { path: '/smart-help', icon: CalendarClock, label: 'Smart Help' },
  { path: '/daily-offload', icon: Sun, label: 'Daily Offload' },
  { path: '/gentle-nudge', icon: Heart, label: 'Gentle Nudge' },
  { path: '/ippo', icon: Puzzle, label: 'Ippo Tasks' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="sidebar-logo">
        <div className="logo-icon" aria-hidden="true">CP</div>
        <div>
          <div className="logo-text">ClearPath</div>
          <div className="logo-tagline">You think. We coordinate.</div>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        <ul role="list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} aria-current={({ isActive }) => isActive ? 'page' : undefined}>
                <item.icon className="nav-icon" size={20} aria-hidden="true" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-section-label" id="features-label" role="heading" aria-level="2">Features</div>
        <ul role="list" aria-labelledby="features-label" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {featureItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} aria-current={({ isActive }) => isActive ? 'page' : undefined}>
                <item.icon className="nav-icon" size={20} aria-hidden="true" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-section-label" id="system-label" role="heading" aria-level="2">System</div>
        <ul role="list" aria-labelledby="system-label" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li>
            <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Settings className="nav-icon" size={20} aria-hidden="true" />
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>

      {user && (
        <div className="sidebar-user" role="region" aria-label="User profile">
          {user.picture && <img src={user.picture} alt={`${user.name}'s profile photo`} />}
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Sign out" aria-label={`Sign out ${user.name}`}>
            <LogOut size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </aside>
  );
}
