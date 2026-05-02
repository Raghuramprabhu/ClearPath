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
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">CP</div>
        <div>
          <div className="logo-text">ClearPath</div>
          <div className="logo-tagline">You think. We coordinate.</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <item.icon className="nav-icon" size={20} />
            {item.label}
          </NavLink>
        ))}

        <div className="nav-section-label">Features</div>
        {featureItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <item.icon className="nav-icon" size={20} />
            {item.label}
          </NavLink>
        ))}

        <div className="nav-section-label">System</div>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings className="nav-icon" size={20} />
          Settings
        </NavLink>
      </nav>

      {user && (
        <div className="sidebar-user">
          {user.picture && <img src={user.picture} alt={user.name} />}
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}
