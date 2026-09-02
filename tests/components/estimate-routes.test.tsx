import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EstimatePage from '@/app/estimate/page';
import EmbedEstimatePage from '@/app/estimate/embed/page';

describe('estimate routes', () => {
  it('renders the standalone estimate experience', () => {
    render(<EstimatePage />);
    expect(screen.getByTestId('intake-shell')).toHaveAttribute('data-embed', 'false');
    expect(screen.getByRole('heading', { name: /tell us what you need/i })).toBeInTheDocument();
  });

  it('renders an isolated embed experience for host websites', () => {
    render(<EmbedEstimatePage />);
    expect(screen.getByTestId('intake-shell')).toHaveAttribute('data-embed', 'true');
  });
});
