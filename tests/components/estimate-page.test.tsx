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

  it('reflects All Phase credibility and service coverage in the customer experience', () => {
    render(<EstimatePage />);
    expect(screen.getByText(/over 50 years/i)).toBeTruthy();
    expect(screen.getByText(/within 60 miles/i)).toBeTruthy();
    expect(screen.getByText(/607-797-6535/)).toBeTruthy();
    expect(screen.getByRole('option', { name: /data \/ lan wiring/i })).toBeTruthy();
    expect(screen.getByRole('option', { name: /surge protection/i })).toBeTruthy();
  });
});
