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

  test('applies custom className to container', () => {
    const customClass = 'custom-field-class';
    const { container } = render(
      <FormField name="test" label="Test Label" className={customClass}>
        <input type="text" />
      </FormField>
    );
    
    const fieldContainer = container.firstChild;
    expect(fieldContainer).toHaveClass(customClass);
    expect(fieldContainer).toHaveClass('mb-4');
  });

  test('sets aria-invalid attribute on input when error is provided', () => {
    render(
      <FormField name="test" label="Test Label" error="Error message">
        <input type="text" data-testid="input" />
      </FormField>
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('sets aria-describedby to error ID when error is provided', () => {
    const fieldName = 'test-field';
    render(
      <FormField name={fieldName} label="Test Label" error="Error message" id={fieldName}>
        <input type="text" data-testid="input" />
      </FormField>
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-describedby', `${fieldName}-error`);
  });

  test('sets aria-describedby to help ID when help text is provided without error', () => {
    const fieldName = 'test-field';
    render(
      <FormField name={fieldName} label="Test Label" helpText="Help text" id={fieldName}>
        <input type="text" data-testid="input" />
      </FormField>
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-describedby', `${fieldName}-help`);
  });

  test('passes disabled attribute to child input', () => {
    render(
      <FormField name="test" label="Test Label" disabled>
        <input type="text" data-testid="input" />
      </FormField>
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('disabled');
  });

  test('passes name attribute to child input', () => {
    const fieldName = 'custom-name';
    render(
      <FormField name={fieldName} label="Test Label">
        <input type="text" data-testid="input" />
      </FormField>
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('name', fieldName);
  });

  test('handles multiple child elements correctly', () => {
    render(
      <FormField name="test" label="Test Label">
        <div data-testid="wrapper">
          <input type="text" data-testid="input" />
          <span>Addon</span>
        </div>
      </FormField>
    );
    
    const wrapper = screen.getByTestId('wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(screen.getByTestId('input')).toBeInTheDocument();
    expect(screen.getByText('Addon')).toBeInTheDocument();
  });
}); 