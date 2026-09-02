import { render, screen } from '@testing-library/react';
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
});
