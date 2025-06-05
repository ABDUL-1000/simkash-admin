// components/QuickActions.tsx
import Image from 'next/image';
import React from 'react';

interface QuickActionItem {
  icon: string;
  label: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  actions: QuickActionItem[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="lg:mb-8 mb-2">
      <h3 className="lg:text-lg font-sm font-medium mb-4">Quick Actions</h3>
      <div className="grid lg:grid-cols-5 grid-cols-3 gap-4">
        {actions.map((action, index) => (
            <div key={index} className="flex items-center flex-col cursor-pointer" onClick={action.onClick}>
            <div className="flex  flex-col items-center  justify-center rounded-full lg:h-20 lg:w-30 h-3 w-3 hover:border-2 hover:border-[#132939]   lg:bg-[#FAFAFA]">
              <Image 
                src={action.icon} 
                alt={action.label} 
                width={20} 
                height={20} 
              />
            </div>
            <span className='mt-1 font-semibold lg:text-lg text-[0.6rem]'>{action.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;