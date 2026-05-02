import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

describe('Dashboard', () => {
  const renderDashboard = () => render(<BrowserRouter><Dashboard /></BrowserRouter>);

  it('renders the welcome heading', () => {
    renderDashboard();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome to ClearPath');
  });

  it('renders all 6 feature cards', () => {
    renderDashboard();
    const cards = screen.getAllByRole('link');
    expect(cards.length).toBe(6);
  });

  it('renders feature cards with accessible labels', () => {
    renderDashboard();
    expect(screen.getByRole('link', { name: /Pre-Meeting Genie/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Gentle Nudge/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ippo Tasks/i })).toBeInTheDocument();
  });

  it('has a keyboard-accessible feature grid', () => {
    renderDashboard();
    const cards = screen.getAllByRole('link');
    cards.forEach((card) => {
      expect(card).toHaveAttribute('tabindex', '0');
    });
  });

  it('renders stats section with metrics', () => {
    renderDashboard();
    expect(screen.getByText('87%')).toBeInTheDocument();
    expect(screen.getByText('12+')).toBeInTheDocument();
    expect(screen.getByText('Less meeting prep time')).toBeInTheDocument();
  });

  it('has proper ARIA landmark for stats', () => {
    renderDashboard();
    expect(screen.getByLabelText('Key metrics')).toBeInTheDocument();
  });

  it('has proper ARIA landmark for features', () => {
    renderDashboard();
    expect(screen.getByLabelText('Features')).toBeInTheDocument();
  });
});
