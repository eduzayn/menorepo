import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PageHeader from '../components/layout/PageHeader';

describe('PageHeader', () => {
  test('renders title correctly', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('renders subtitle when provided', () => {
    render(<PageHeader title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  test('renders back link when backUrl is provided', () => {
    render(<PageHeader title="Test Title" backUrl="/back" />);
    const backLink = screen.getByText('Voltar');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/back');
  });

  test('calls onBackClick when back link is clicked', () => {
    const handleBackClick = jest.fn();
    render(<PageHeader title="Test Title" onBackClick={handleBackClick} />);
    
    const backLink = screen.getByText('Voltar');
    fireEvent.click(backLink);
    
    expect(handleBackClick).toHaveBeenCalledTimes(1);
  });

  test('renders actions when provided', () => {
    render(
      <PageHeader 
        title="Test Title" 
        actions={<button>Test Action</button>} 
      />
    );
    
    expect(screen.getByRole('button', { name: 'Test Action' })).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <PageHeader title="Test Title" className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('renders custom back icon when provided', () => {
    render(
      <PageHeader 
        title="Test Title" 
        backUrl="/back" 
        backIcon={<span data-testid="custom-icon">←</span>} 
      />
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
}); 