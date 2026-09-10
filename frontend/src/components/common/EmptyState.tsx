import React from 'react';
import { Database, Inbox, Search } from 'lucide-react';
import { Surface } from './Surface';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'database' | 'inbox' | 'search';
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are no active records in this section yet. Data will appear once results are processed.',
  icon = 'database',
  action,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'inbox':
        return <Inbox className="w-6 h-6 text-[#7E8290]" />;
      case 'search':
        return <Search className="w-6 h-6 text-[#7E8290]" />;
      default:
        return <Database className="w-6 h-6 text-[#7E8290]" />;
    }
  };

  return (
    <Surface variant="base" className="text-center py-14 px-6 max-w-lg mx-auto my-8 border-dashed border-[#D6CDBF] bg-[#FAF7F2]">
      <div className="p-3.5 rounded-xl bg-white border border-[#E2DBD0] w-fit mx-auto mb-3.5 shadow-[0_1px_3px_rgba(20,22,27,0.04)]">
        {renderIcon()}
      </div>
      <h3 className="font-display font-bold text-base text-[#14161B] mb-1.5 tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#5D616F] leading-relaxed max-w-sm mx-auto mb-5">
        {description}
      </p>
      {action && <div className="flex justify-center">{action}</div>}
    </Surface>
  );
};
