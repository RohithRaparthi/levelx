import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading LEVELX data...',
  className = 'py-16',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-2.5 text-[#7E8290] font-mono text-xs ${className}`}>
      <Loader2 className="w-5 h-5 animate-spin text-[#DF421A]" />
      <span className="tracking-tight text-[#5D616F]">{label}</span>
    </div>
  );
};
