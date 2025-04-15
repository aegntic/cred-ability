import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PopupContainer from '../../../src/browser-integration/popup/components/PopupContainer';
import Navigation from '../../../src/browser-integration/popup/components/Navigation';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect'; // Import directly to extend expect
// Mock matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('PopupContainer', () => {
  it('renders without errors', () => {
    render(<PopupContainer />);
    expect(screen.getByText(/CRED-ABILITY/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the credential manager extension/i)).toBeInTheDocument();
  });

  it('renders navigation with all sections', () => {
    render(<PopupContainer />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Credentials/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Settings/i })).toBeInTheDocument();
  });

  it('navigates to Credentials section when button is clicked', () => {
    render(<PopupContainer />);
    fireEvent.click(screen.getByRole('button', { name: /Credentials/i }));
    expect(screen.getByRole('heading', { name: /Credentials/i })).toBeInTheDocument();
    expect(screen.getByText(/Credential list view coming soon/i)).toBeInTheDocument();
  });

  it('navigates to Settings section when button is clicked', () => {
    render(<PopupContainer />);
    fireEvent.click(screen.getByRole('button', { name: /Settings/i }));
    expect(screen.getByRole('heading', { name: /Settings/i })).toBeInTheDocument();
    expect(screen.getByText(/Settings panel coming soon/i)).toBeInTheDocument();
  });

  it('navigates back to Home section', () => {
    render(<PopupContainer />);
    fireEvent.click(screen.getByRole('button', { name: /Credentials/i }));
    fireEvent.click(screen.getByRole('button', { name: /Home/i }));
    expect(screen.getByRole('heading', { name: /CRED-ABILITY/i })).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the credential manager extension/i)).toBeInTheDocument();
  });

  it('navigation buttons have aria-current set correctly', () => {
    render(<PopupContainer />);
    expect(screen.getByRole('button', { name: /Home/i })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('button', { name: /Credentials/i }));
    expect(screen.getByRole('button', { name: /Credentials/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
    fireEvent.click(screen.getByRole('button', { name: /Settings/i }));
    expect(screen.getByRole('button', { name: /Settings/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('main content area is focusable and has aria-live', () => {
    render(<PopupContainer />);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('tabindex', '0');
    expect(main).toHaveAttribute('aria-live', 'polite');
  });
});

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<PopupContainer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Navigation', () => {
  it('renders without errors', () => {
    render(<Navigation currentSection="home" onSectionChange={() => null} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all navigation buttons', () => {
    render(<Navigation currentSection="home" onSectionChange={() => null} />);
    expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Credentials/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Settings/i })).toBeInTheDocument();
  });

  it('updates aria-current when button is clicked', () => {
    render(<Navigation currentSection="home" onSectionChange={() => null} />);
    fireEvent.click(screen.getByRole('button', { name: /Credentials/i }));
    expect(screen.getByRole('button', { name: /Credentials/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('calls onSectionChange with "credentials" when Credentials button is clicked', () => {
    const mockOnSectionChange = jest.fn<void, [string]>();
    render(<Navigation currentSection="home" onSectionChange={mockOnSectionChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Credentials/i }));
    expect(mockOnSectionChange).toHaveBeenCalledWith('credentials');
  });

  it('calls onSectionChange with "settings" when Settings button is clicked', () => {
    const mockOnSectionChange = jest.fn<void, [string]>();
    render(<Navigation currentSection="home" onSectionChange={mockOnSectionChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Settings/i }));
    expect(mockOnSectionChange).toHaveBeenCalledWith('settings');
  });

  it('calls onSectionChange with "home" when Home button is clicked', () => {
    const mockOnSectionChange = jest.fn<void, [string]>();
    render(<Navigation currentSection="settings" onSectionChange={mockOnSectionChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Home/i }));
    expect(mockOnSectionChange).toHaveBeenCalledWith('home');
  });

  it('sets initial aria-current based on currentSection prop', () => {
    render(<Navigation currentSection="credentials" onSectionChange={() => null} />);
    expect(screen.getByRole('button', { name: /Home/i })).not.toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('button', { name: /Credentials/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('button', { name: /Settings/i })).not.toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('restores aria-current when different button is clicked', () => {
    render(<Navigation currentSection="home" onSectionChange={() => null} />);
    fireEvent.click(screen.getByRole('button', { name: /Credentials/i }));
    fireEvent.click(screen.getByRole('button', { name: /Settings/i }));
    expect(screen.getByRole('button', { name: /Settings/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});
