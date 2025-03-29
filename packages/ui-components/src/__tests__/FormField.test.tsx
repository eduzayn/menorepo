import React from 'react';
import { render, screen } from '@testing-library/react';
import FormField from '../components/forms/FormField';

describe('FormField', () => {
  test('renders with label and children', () => {
    render(
      <FormField name="test" label="Test Label">
        <input type="text" />
      </FormField>
    );
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('shows required indicator when field is required', () => {
    render(
      <FormField name="test" label="Test Label" required>
        <input type="text" />
      </FormField>
    );
    
    const label = screen.getByText('Test Label');
    expect(label.parentElement).toHaveTextContent('*');
  });

  test('renders help text when provided', () => {
    const helpText = 'This is a helpful message';
    render(
      <FormField name="test" label="Test Label" helpText={helpText}>
        <input type="text" />
      </FormField>
    );
    
    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  test('renders error message when provided', () => {
    const errorMessage = 'This field is required';
    render(
      <FormField name="test" label="Test Label" error={errorMessage}>
        <input type="text" />
      </FormField>
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('prioritizes error message over help text', () => {
    const helpText = 'This is a helpful message';
    const errorMessage = 'This field is required';
    
    render(
      <FormField 
        name="test" 
        label="Test Label" 
        helpText={helpText}
        error={errorMessage}
      >
        <input type="text" />
      </FormField>
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByText(helpText)).not.toBeInTheDocument();
  });

  test('applies disabled state to label', () => {
    render(
      <FormField name="test" label="Test Label" disabled>
        <input type="text" />
      </FormField>
    );
    
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('text-gray-400');
  });

  test('passes id to child input element', () => {
    const testId = 'custom-id';
    render(
      <FormField name="test" label="Test Label" id={testId}>
        <input type="text" data-testid="input" />
      </FormField>
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('id', testId);
  });
}); 