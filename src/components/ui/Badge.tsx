import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'guarantee' | 'tour' | 'sale' | 'tracer' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  icon,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase tracking-wider select-none';

  const variantStyles = {
    guarantee: 'bg-[#1C2C24]/90 text-white backdrop-blur-md border border-white/10 shadow-xs',
    tour: 'bg-[#1C2C24]/10 text-[#1C2C24] border border-[#1C2C24]/15',
    sale: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    tracer: 'bg-white/15 text-slate-100 backdrop-blur-md border border-white/20 shadow-xs',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  }[variant];

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
