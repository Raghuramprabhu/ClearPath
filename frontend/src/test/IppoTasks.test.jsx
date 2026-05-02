import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IppoTasks from '../pages/IppoTasks';

vi.mock('../services/api', () => ({
  ippoApi: {
    breakdown: vi.fn(),
    recovery: vi.fn(),
    complete: vi.fn(),
  },
}));

describe('IppoTasks', () => {
  const renderPage = () => render(<BrowserRouter><IppoTasks /></BrowserRouter>);

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ippo');
  });

  it('renders task description input with accessible label', () => {
    renderPage();
    const textarea = screen.getByLabelText('Describe your task');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('aria-required', 'true');
  });

  it('has a neurodivergent mode checkbox', () => {
    renderPage();
    const checkbox = screen.getByLabelText('Supportive mode');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.type).toBe('checkbox');
  });

  it('toggles neurodivergent mode', () => {
    renderPage();
    const checkbox = screen.getByLabelText('Supportive mode');
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it('disables submit when task is empty', () => {
    renderPage();
    const button = screen.getByRole('button', { name: /Break It Down/i });
    expect(button).toBeDisabled();
  });

  it('enables submit when task is entered', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText('Describe your task'), { target: { value: 'Refactor auth' } });
    expect(screen.getByRole('button', { name: /Break It Down/i })).not.toBeDisabled();
  });

  it('has a recovery protocol button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /recovery protocol/i })).toBeInTheDocument();
  });

  it('has proper form labeling', () => {
    renderPage();
    expect(screen.getByRole('form', { name: /Break down a task/i })).toBeInTheDocument();
  });
});
