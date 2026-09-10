import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'brand' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  children,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'brand':
        return 'bg-[#DF421A] text-white hover:bg-[#C83812] border border-[#DF421A] shadow-[0_2px_8px_rgba(223,66,26,0.25)] active:translate-y-0.5';
      
      case 'secondary':
        return 'bg-white text-[#14161B] hover:bg-[#FAF7F2] border border-[#D8D0C3] shadow-[0_1px_3px_rgba(20,22,27,0.06)] active:translate-y-0.5';
      
      case 'outline':
        return 'bg-transparent text-[#14161B] hover:bg-white border border-[#D8D0C3] active:translate-y-0.5';
      
      case 'ghost':
        return 'bg-transparent text-[#4A4E5B] hover:text-[#14161B] hover:bg-[#F0E9DF] border border-transparent';

      case 'primary':
      default:
        return 'bg-[#14161B] text-white hover:bg-[#2A2C34] border border-[#14161B] shadow-[0_2px_8px_rgba(20,22,27,0.15)] active:translate-y-0.5';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs rounded-lg gap-1.5 font-medium';
      case 'lg':
        return 'px-6 py-3 text-sm sm:text-base rounded-xl gap-2.5 font-semibold';
      case 'md':
      default:
        return 'px-4 py-2 text-xs sm:text-sm rounded-lg gap-2 font-medium';
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
