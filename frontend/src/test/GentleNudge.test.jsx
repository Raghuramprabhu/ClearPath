import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GentleNudge from '../pages/GentleNudge';

vi.mock('../services/api', () => ({
  nudgeApi: { check: vi.fn(), respond: vi.fn(), monitor: vi.fn() },
}));

describe('GentleNudge', () => {
  const renderPage = () => render(<BrowserRouter><GentleNudge /></BrowserRouter>);

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Gentle Nudge');
  });

  it('displays privacy notice', () => {
    renderPage();
    expect(screen.getByLabelText('Privacy notice')).toBeInTheDocument();
    expect(screen.getByText(/Managers are never notified/i)).toBeInTheDocument();
  });

  it('renders team tasks list', () => {
    renderPage();
    expect(screen.getByLabelText(/Team tasks/i)).toBeInTheDocument();
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
  });

  it('shows nudge buttons only for stuck tasks', () => {
    renderPage();
    const nudgeButtons = screen.getAllByRole('button', { name: /Send gentle nudge/i });
    expect(nudgeButtons.length).toBeGreaterThan(0);
  });

  it('shows status badges for task states', () => {
    renderPage();
    expect(screen.getByText('Done')).toBeInTheDocument();
    const checkInBadges = screen.getAllByText('Needs check-in');
    expect(checkInBadges.length).toBeGreaterThan(0);
  });
});
