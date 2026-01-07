import React from 'react';
import { GameItem } from '../types';
import AnswerTile from './AnswerTile';

interface QuestionRowProps {
  item: GameItem;
  placedAnswerId: string | null;
  getAnswerContent: (id: string) => string;
  onDrop: (e: React.DragEvent<HTMLDivElement>, questionId: string) => void;
  onSlotClick: (questionId: string) => void;
  onRemove: (questionId: string) => void;
  isCorrect?: boolean | null;
  isHighlighted?: boolean; // Highlight when an answer is selected and waiting to be placed
}

const QuestionRow: React.FC<QuestionRowProps> = ({ 
  item, 
  placedAnswerId, 
  getAnswerContent, 
  onDrop, 
  onSlotClick,
  onRemove,
  isCorrect,
  isHighlighted
}) => {
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-white/20', 'border-neon-blue');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-white/20', 'border-neon-blue');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-white/20', 'border-neon-blue');
    onDrop(e, item.id);
  };

  let borderColor = "border-white/20";
  let bgClass = "bg-black/20";
  
  if (isCorrect === true) {
    borderColor = "border-green-500";
    bgClass = "bg-green-500/20";
  } else if (isCorrect === false) {
    borderColor = "border-red-500";
    bgClass = "bg-red-500/20";
  } else if (isHighlighted && !placedAnswerId) {
    borderColor = "border-neon-yellow animate-pulse";
    bgClass = "bg-neon-yellow/10";
  }

  return (
    <div className="flex items-center gap-3 mb-2 bg-space-800/80 p-2 rounded-lg border border-white/5 shadow-sm">
      {/* Drop Zone */}
      <div 
        className={`
          relative w-[120px] md:w-[160px] shrink-0 min-h-[50px]
          border-2 border-dashed ${borderColor} rounded-lg 
          flex items-center justify-center 
          ${bgClass} transition-all duration-300
          cursor-pointer
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => onSlotClick(item.id)}
      >
        {placedAnswerId ? (
           <div className="w-full p-1">
             <AnswerTile 
               id={placedAnswerId} 
               text={getAnswerContent(placedAnswerId)} 
               onDragStart={(e) => {
                 e.dataTransfer.setData("text/plain", placedAnswerId);
                 e.dataTransfer.effectAllowed = "move";
               }}
               onClick={(e) => {
                 e.stopPropagation(); // Prevent triggering slot click
                 onRemove(item.id);
               }}
             />
           </div>
        ) : (
          <span className={`text-[10px] md:text-xs text-center px-1 pointer-events-none ${isHighlighted ? 'text-neon-yellow' : 'text-white/30'}`}>
            {isHighlighted ? 'แตะเพื่อวาง' : 'วางคำตอบ'}
          </span>
        )}
      </div>

      {/* Question Text */}
      <div className="flex-1 text-white text-sm font-light leading-snug">
        {item.question}
      </div>
      
      {/* Status Icon */}
      {isCorrect !== null && (
         <div className="flex items-center justify-center w-6 shrink-0">
            {isCorrect ? (
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
         </div>
      )}
    </div>
  );
};

export default QuestionRow;