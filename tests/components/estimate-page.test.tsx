import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EstimatePage from '@/app/estimate/page';

describe('estimate page', () => {
  it('shows the three job types and a no-account message', () => {
    render(<EstimatePage />);
    expect(screen.getByText('Residential')).toBeTruthy();
    expect(screen.getByText('Commercial')).toBeTruthy();
    expect(screen.getByText('Industrial')).toBeTruthy();
    expect(screen.getByText(/no account required/i)).toBeTruthy();
  });
});
