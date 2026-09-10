import React from 'react';

interface BadgeProps {
  variant?: 'brand' | 'emerald' | 'amber' | 'sapphire' | 'violet' | 'neutral' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<NonNullable<BadgeProps['variant']>, React.CSSProperties> = {
  brand: {
    background: 'var(--brand-light)',
    color: 'var(--brand-deep)',
    borderColor: 'var(--brand-tint)',
  },
  emerald: {
    background: 'var(--emerald-bg)',
    color: 'var(--emerald)',
    borderColor: 'var(--emerald-border)',
  },
  amber: {
    background: 'var(--amber-bg)',
    color: 'var(--amber)',
    borderColor: 'var(--amber-border)',
  },
  sapphire: {
    background: 'var(--sapphire-bg)',
    color: 'var(--sapphire)',
    borderColor: 'var(--sapphire-border)',
  },
  violet: {
    background: 'var(--violet-bg)',
    color: 'var(--violet)',
    borderColor: 'var(--violet-border)',
  },
  neutral: {
    background: 'var(--surface-inset)',
    color: 'var(--ink-secondary)',
    borderColor: 'var(--border-subtle)',
  },
  dark: {
    background: 'var(--ink-primary)',
    color: '#ffffff',
    borderColor: 'transparent',
  },
};

const SIZE_CLASSES: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-[2px] text-[10px] gap-[5px] font-mono font-bold tracking-[0.12em]',
  md: 'px-2.5 py-[3px] text-[11px] gap-1.5 font-mono font-semibold tracking-[0.08em]',
  lg: 'px-3.5 py-1 text-xs gap-2 font-medium tracking-[0.04em]',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  icon,
  pulse = false,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border shrink-0 uppercase ${SIZE_CLASSES[size]} ${className}`}
      style={VARIANT_STYLES[variant]}
    >
      {pulse && (
        <span className="relative flex h-[6px] w-[6px] shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
          <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-current" />
        </span>
      )}
      {icon && <span className="shrink-0 opacity-80">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
