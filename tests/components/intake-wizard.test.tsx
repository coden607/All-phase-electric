import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IntakeWizard } from '@/features/intake/intake-wizard';

describe('IntakeWizard', () => {
  it('guides a customer forward and preserves values when navigating back', () => {
    render(<IntakeWizard />);

    expect(screen.getByRole('heading', { name: /what can we help with/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: /residential/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByRole('heading', { name: /tell us about the work/i })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/describe the project/i), { target: { value: 'Replace an outdated electrical panel safely.' } });
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(screen.getByRole('radio', { name: /residential/i })).toBeChecked();
  });

  it('exposes a stable embed marker without relying on host-site styles', () => {
    render(<IntakeWizard embedded />);
    expect(screen.getByTestId('intake-shell')).toHaveAttribute('data-embed', 'true');
  });
});
