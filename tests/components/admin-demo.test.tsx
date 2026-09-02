import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AdminPage from '@/app/admin/page';

describe('admin demo dashboard', () => {
  it('shows pipeline, attention, contact, follow-up, and ROI features', () => {
    render(<AdminPage />);
    expect(screen.getByText(/sales pipeline/i)).toBeTruthy();
    expect(screen.getByText(/needs attention/i)).toBeTruthy();
    expect(screen.getAllByText(/call/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/automatic follow-up/i)).toBeTruthy();
    expect(screen.getByText(/starter build ROI/i)).toBeTruthy();
  });

  it('lets Scott mark a demo lead won and updates the dashboard', () => {
    render(<AdminPage />);
    const buttons = screen.getAllByRole('button', { name: /mark won/i });
    fireEvent.click(buttons[0]);
    expect(screen.getByText(/job marked won/i)).toBeTruthy();
  });
});
