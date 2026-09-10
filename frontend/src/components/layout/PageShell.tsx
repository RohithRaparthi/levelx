import React from 'react';

interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#14161B] relative selection:bg-[#DF421A] selection:text-white overflow-x-hidden">
      {/* Subtle paper print grid backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-editorial-grid opacity-60" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};
