import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardCard } from '../components/data-display/DashboardCard';

describe('DashboardCard', () => {
  test('renders title correctly', () => {
    render(<DashboardCard title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('renders value when provided', () => {
    render(<DashboardCard title="Test Title" value={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('renders description when provided', () => {
    render(<DashboardCard title="Test Title" description="Test Description" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('renders trend information when provided', () => {
    render(
      <DashboardCard 
        title="Test Title" 
        trend={{ value: 10, isPositive: true, text: "vs. anterior" }} 
      />
    );
    expect(screen.getByText('↑ 10%')).toBeInTheDocument();
    expect(screen.getByText('vs. anterior')).toBeInTheDocument();
  });

  test('renders negative trend correctly', () => {
    render(
      <DashboardCard 
        title="Test Title" 
        trend={{ value: 10, isPositive: false, text: "vs. anterior" }} 
      />
    );
    expect(screen.getByText('↓ 10%')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    const { container } = render(
      <DashboardCard title="Test Title" className="custom-class" />
    );
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement.className).toContain('custom-class');
    expect(cardElement.className).toContain('bg-white');
  });

  test('renders loading state correctly', () => {
    const { container } = render(
      <DashboardCard title="Test Title" isLoading={true} />
    );
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('calls onClick when card is clicked', () => {
    const handleClick = jest.fn();
    render(<DashboardCard title="Test Title" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Test Title').parentElement?.parentElement as HTMLElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders children content', () => {
    render(
      <DashboardCard title="Test Title">
        <div data-testid="child-content">Child Content</div>
      </DashboardCard>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });
}); 