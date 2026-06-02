import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2 select-none';

  const variantStyles = {
    primary:
      'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-surface-tertiary text-text-secondary hover:bg-accent-50 active:bg-surface-secondary hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'border border-border text-text-secondary hover:bg-accent-50 hover:border-accent-200 active:bg-surface-secondary hover:-translate-y-0.5 active:translate-y-0',
    ghost: 'text-text-secondary hover:bg-accent-50 active:bg-surface-secondary',
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
