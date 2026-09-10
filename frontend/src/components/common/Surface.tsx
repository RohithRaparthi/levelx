import React from 'react';

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'interactive' | 'accent' | 'inset' | 'dark' | 'elevated';
  children: React.ReactNode;
  className?: string;
}

export const Surface: React.FC<SurfaceProps> = ({
  variant = 'base',
  children,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'interactive':
        return 'bg-white border border-[#E8E2D7] shadow-[0_2px_8px_rgba(20,22,27,0.04),0_1px_2px_rgba(20,22,27,0.02)] hover:shadow-[0_8px_24px_-4px_rgba(20,22,27,0.08),0_2px_6px_rgba(20,22,27,0.03)] hover:border-[#D6CEC0] hover:-translate-y-0.5 transition-all duration-200';
      
      case 'accent':
        return 'bg-white border border-[#F6CBBF] shadow-[0_4px_20px_-2px_rgba(223,66,26,0.08),0_1px_3px_rgba(20,22,27,0.03)]';
      
      case 'inset':
        return 'bg-[#F2ECE1] border border-[#E5DECة] shadow-[inset_0_2px_4px_rgba(20,22,27,0.03)]';
      
      case 'dark':
        return 'bg-[#14161B] text-white border border-[#14161B] shadow-[0_8px_30px_rgba(20,22,27,0.12)]';

      case 'elevated':
        return 'bg-white border border-[#E0D8CB] shadow-[0_12px_32px_-4px_rgba(20,22,27,0.08),0_2px_6px_rgba(20,22,27,0.03)]';
      
      case 'base':
      default:
        return 'bg-white border border-[#E8E2D7] shadow-[0_1px_3px_rgba(20,22,27,0.04),0_1px_2px_rgba(20,22,27,0.02)]';
    }
  };

  return (
    <div
      className={`rounded-2xl ${getVariantStyles()} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
