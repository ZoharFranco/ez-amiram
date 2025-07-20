import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

type ActionButtonColor = 'emerald' | 'blue' | 'orange' | 'gray';  

interface ActionButtonPropsWithColor extends ActionButtonProps {
  color?: ActionButtonColor;
}

const colorClassMap: Record<ActionButtonColor, { base: string; hover: string; text: string }> = {
  emerald: {
    base: 'bg-emerald-500',
    hover: 'hover:bg-emerald-600',
    text: 'text-white',
  },
  blue: {
    base: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    text: 'text-white',
  },
  orange: {   
    base: 'bg-orange-500',
    hover: 'hover:bg-orange-600',
    text: 'text-white',
  },
  gray: {
    base: 'bg-gray-200',
    hover: 'hover:bg-gray-300',
    text: 'text-gray-800',
  },
};

const ActionButton: React.FC<ActionButtonPropsWithColor> = ({
  children,
  className = '',
  color = 'emerald',
  ...props
}) => {
  const colorClasses = colorClassMap[color] || colorClassMap.emerald;
  return (
    <button
      type="button"
      className={`w-fill py-3 px-8 rounded-lg ${colorClasses.base} ${colorClasses.hover} ${colorClasses.text} font-semibold text-sm sm:text-base transition-colors duration-200 shadow ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton; 