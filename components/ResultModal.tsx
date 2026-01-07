import React from 'react';

interface ResultModalProps {
  score: number;
  total: number;
  time: number;
  onReset: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ score, total, time, onReset }) => {
  const percentage = (score / total) * 100;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-space-800 border-2 border-neon-pink rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(255,0,255,0.3)] relative overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink mb-4">
            {percentage >= 80 ? 'ยอดเยี่ยม!' : percentage >= 50 ? 'ทำได้ดี!' : 'พยายามอีกนิด!'}
          </h2>
          
          <div className="mb-6">
            <div className="text-6xl font-black text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {score}/{total}
            </div>
            <p className="text-gray-300">คะแนนของคุณ</p>
          </div>

          <div className="bg-space-900/50 rounded-lg p-3 mb-6 border border-white/10">
            <p className="text-neon-yellow">ใช้เวลาไป: {formatTime(time)}</p>
          </div>

          <button
            onClick={onReset}
            className="w-full bg-gradient-to-r from-neon-blue to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            เล่นอีกครั้ง
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;