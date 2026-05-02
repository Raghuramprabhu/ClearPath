import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SettingsPage from '../pages/SettingsPage';

describe('SettingsPage', () => {
  const renderPage = () => render(<BrowserRouter><SettingsPage /></BrowserRouter>);

  it('renders the settings heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Settings');
  });

  it('has an accessible role selector', () => {
    renderPage();
    const select = screen.getByLabelText('Select your role');
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe('SELECT');
  });

  it('has a neurodivergent mode toggle', () => {
    renderPage();
    const checkbox = screen.getByLabelText(/neurodivergent support mode/i);
    expect(checkbox).toBeInTheDocument();
  });

  it('shows privacy description for ND mode', () => {
    renderPage();
    expect(screen.getByText(/team and managers never see/i)).toBeInTheDocument();
  });

  it('lists all connected Google services', () => {
    renderPage();
    expect(screen.getByText('Google Calendar')).toBeInTheDocument();
    expect(screen.getByText('Google Docs')).toBeInTheDocument();
    expect(screen.getByText('Google Sheets')).toBeInTheDocument();
    expect(screen.getByText('Google Slides')).toBeInTheDocument();
    expect(screen.getByText('Google Tasks')).toBeInTheDocument();
  });

  it('has accessible nudge threshold input', () => {
    renderPage();
    const input = screen.getByLabelText(/Nudge threshold/i);
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('number');
  });

  it('has proper section headings', () => {
    renderPage();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Ippo Preferences')).toBeInTheDocument();
    expect(screen.getByText('Connected Services')).toBeInTheDocument();
    expect(screen.getByText('Gentle Nudge')).toBeInTheDocument();
  });
});
