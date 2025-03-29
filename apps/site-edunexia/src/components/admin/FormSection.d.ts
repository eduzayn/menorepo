import React from 'react';
interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}
export declare const FormSection: React.FC<FormSectionProps>;
interface FormRowProps {
    label: string;
    htmlFor?: string;
    required?: boolean;
    error?: string;
    className?: string;
    children: React.ReactNode;
    helpText?: string;
}
export declare const FormRow: React.FC<FormRowProps>;
interface ActionButtonProps {
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}
export declare const ActionButton: React.FC<ActionButtonProps>;
interface ActionBarProps {
    children: React.ReactNode;
    className?: string;
    alignment?: 'left' | 'center' | 'right' | 'between';
}
export declare const ActionBar: React.FC<ActionBarProps>;
export {};
//# sourceMappingURL=FormSection.d.ts.map