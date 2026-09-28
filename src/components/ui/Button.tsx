import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'luxury';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all rounded-xs select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  const sizeStyles = {
    sm: 'text-[11px] px-3.5 py-2 gap-1.5',
    md: 'text-xs px-5 py-3 gap-2',
    lg: 'text-sm px-8 py-4 gap-2.5 shadow-md',
  }[size];

  const variantStyles = {
    primary: 'bg-[#B12535] hover:bg-[#8E1D29] text-white shadow-sm',
    secondary: 'bg-[#1C2C24] hover:bg-[#121D18] text-white shadow-sm',
    luxury: 'bg-[#1A1F26] hover:bg-black text-white shadow-md border border-slate-700/50',
    outline: 'border border-slate-300 hover:border-slate-800 text-[#1A1F26] bg-transparent hover:bg-slate-50',
    ghost: 'text-slate-700 hover:text-black hover:bg-slate-100 bg-transparent',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span>{children}</span>
      {icon && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
