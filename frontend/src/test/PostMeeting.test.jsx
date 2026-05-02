import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostMeetingIntelligence from '../pages/PostMeetingIntelligence';

vi.mock('../services/api', () => ({
  meetingsApi: {
    postIntelligence: vi.fn(),
  },
}));

describe('PostMeetingIntelligence', () => {
  const renderPage = () => render(<BrowserRouter><PostMeetingIntelligence /></BrowserRouter>);

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Post-Meeting Intelligence');
  });

  it('renders textarea with accessible label', () => {
    renderPage();
    const textarea = screen.getByLabelText('Meeting Notes');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('aria-required', 'true');
  });

  it('disables submit button when textarea is empty', () => {
    renderPage();
    const button = screen.getByRole('button', { name: /Extract Action Items/i });
    expect(button).toBeDisabled();
  });

  it('enables submit button when notes are entered', () => {
    renderPage();
    const textarea = screen.getByLabelText('Meeting Notes');
    fireEvent.change(textarea, { target: { value: 'Some meeting notes' } });
    const button = screen.getByRole('button', { name: /Extract Action Items/i });
    expect(button).not.toBeDisabled();
  });

  it('loads sample notes when Load Sample is clicked', () => {
    renderPage();
    const loadBtn = screen.getByRole('button', { name: /Load sample/i });
    fireEvent.click(loadBtn);
    const textarea = screen.getByLabelText('Meeting Notes');
    expect(textarea.value).toContain('Raghu');
  });

  it('has an accessible form', () => {
    renderPage();
    expect(screen.getByRole('form', { name: /Extract action items/i })).toBeInTheDocument();
  });
});
