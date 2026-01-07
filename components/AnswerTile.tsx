import React from 'react';

interface AnswerTileProps {
  id: string;
  text: string;
  isDragging?: boolean;
  isSelected?: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onClick?: () => void;
}

const AnswerTile: React.FC<AnswerTileProps> = ({ 
  id, 
  text, 
  isDragging = false, 
  isSelected = false,
  onDragStart, 
  onClick 
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      onClick={onClick}
      className={`
        cursor-grab active:cursor-grabbing 
        font-bold 
        py-2 px-2 rounded-lg shadow-md
        transform transition-all duration-200 
        flex items-center justify-center text-center text-xs md:text-sm leading-tight select-none
        min-h-[40px] border-2
        ${isSelected 
          ? 'bg-neon-yellow text-space-900 border-white scale-105 ring-2 ring-neon-blue z-10' 
          : 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-space-900 border-yellow-200 hover:brightness-110'
        }
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
    >
      {text}
    </div>
  );
};

export default AnswerTile;