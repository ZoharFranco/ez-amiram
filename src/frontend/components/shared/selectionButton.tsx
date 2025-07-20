import React from 'react';

type SelectionButtonProps = {
  selected: boolean;
  onClick: () => void;
  text: string;
  className?: string;
};

const SelectionButton: React.FC<SelectionButtonProps> = ({
  selected,
  onClick,
  text,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-full font-medium transition ${
        selected
          ? 'bg-blue-600 text-white'
          : 'bg-white border text-blue-600'
      } ${className}`}
      type="button"
    >
      {text}
    </button>
  );
};

export default SelectionButton;
