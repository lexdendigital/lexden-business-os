import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { BusinessStoreProvider } from '@/state/businessStore';
import { ToastProvider } from '@/components/common/Toast';
import { Onboarding } from './Onboarding';

function renderOnboarding() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <BusinessStoreProvider>
          <ToastProvider>
            <Onboarding />
          </ToastProvider>
        </BusinessStoreProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Onboarding', () => {
  it('shows validation errors when submitted empty', () => {
    renderOnboarding();
    fireEvent.click(screen.getByRole('button', { name: /start hustling/i }));
    expect(screen.getByText(/enter at least 2 characters/i)).toBeInTheDocument();
  });

  it('accepts valid input without showing errors', () => {
    renderOnboarding();
    fireEvent.change(screen.getByPlaceholderText(/chioma okafor/i), { target: { value: 'Tunde Bakare' } });
    fireEvent.change(screen.getByPlaceholderText(/thrift corner/i), { target: { value: "Tunde's Store" } });
    fireEvent.click(screen.getByRole('button', { name: /start hustling/i }));
    expect(screen.queryByText(/enter at least 2 characters/i)).not.toBeInTheDocument();
  });
});
