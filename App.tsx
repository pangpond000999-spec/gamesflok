import React, { useState, useEffect } from 'react';
import { GAME_DATA } from './constants';
import { Placements } from './types';
import QuestionRow from './components/QuestionRow';
import AnswerTile from './components/AnswerTile';
import ResultModal from './components/ResultModal';

const App: React.FC = () => {
  // State
  const [hasStarted, setHasStarted] = useState(false);
  const [placements, setPlacements] = useState<Placements>({});
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState(() => 
    [...GAME_DATA].sort(() => Math.random() - 0.5).map(item => ({ id: item.id, content: item.answer }))
  );

  // Timer Logic
  useEffect(() => {
    let interval: number;
    if (hasStarted && isPlaying && !isFinished) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, isPlaying, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = () => {
    setHasStarted(true);
    setIsPlaying(true);
  };

  // Logic to place an answer
  const placeAnswer = (questionId: string, answerId: string) => {
    setPlacements(prev => {
      const newPlacements = { ...prev };
      
      // If this answer was already placed somewhere else, remove it from there
      const existingQuestionId = Object.keys(newPlacements).find(key => newPlacements[key] === answerId);
      if (existingQuestionId) {
        newPlacements[existingQuestionId] = null;
      }

      newPlacements[questionId] = answerId;
      return newPlacements;
    });
    setSelectedAnswerId(null); // Clear selection after placing
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, answerId: string) => {
    e.dataTransfer.setData("text/plain", answerId);
    e.dataTransfer.effectAllowed = "move";
    setSelectedAnswerId(answerId); // Also select it visually
  };

  const handleDropOnSlot = (e: React.DragEvent<HTMLDivElement>, questionId: string) => {
    e.preventDefault();
    const answerId = e.dataTransfer.getData("text/plain");
    if (answerId) {
      placeAnswer(questionId, answerId);
    }
  };

  // Click Handlers (Tap to Select / Tap to Place)
  const handleAnswerClick = (answerId: string) => {
    if (selectedAnswerId === answerId) {
      setSelectedAnswerId(null); // Deselect
    } else {
      setSelectedAnswerId(answerId);
    }
  };

  const handleSlotClick = (questionId: string) => {
    if (selectedAnswerId) {
      placeAnswer(questionId, selectedAnswerId);
    }
  };

  const handleRemoveFromSlot = (questionId: string) => {
    if (isFinished) return;
    setPlacements(prev => ({
      ...prev,
      [questionId]: null
    }));
  };

  const checkAnswers = () => {
    let currentScore = 0;
    GAME_DATA.forEach(item => {
      const placedAnswerId = placements[item.id];
      if (placedAnswerId === item.id) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setIsFinished(true);
  };

  const resetGame = () => {
    setPlacements({});
    setTimer(0);
    setIsFinished(false);
    setIsPlaying(true);
    setShuffledAnswers([...GAME_DATA].sort(() => Math.random() - 0.5).map(item => ({ id: item.id, content: item.answer })));
    setSelectedAnswerId(null);
  };

  // Derived state
  const placedAnswerIds = Object.values(placements).filter(Boolean) as string[];
  const availableAnswers = shuffledAnswers.filter(a => !placedAnswerIds.includes(a.id));

  // --- Start Screen View ---
  if (!hasStarted) {
    return (
      <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center flex flex-col items-center justify-center relative overflow-hidden">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-space-900/80"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center p-8 max-w-2xl w-full text-center">
          <div className="glass-panel p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(45,27,78,0.5)] border border-white/10 backdrop-blur-xl transform hover:scale-[1.02] transition-transform duration-500">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-pink mb-2 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
              เกมความน่าจะเป็น
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-neon-yellow to-transparent mx-auto mb-6"></div>
            
            <p className="text-xl md:text-2xl text-gray-300 font-light mb-8">
              โดย <span className="text-neon-yellow font-medium">รัฐศาสตร์ แซ่เติ๋น</span>
            </p>

            <button
              onClick={startGame}
              className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-blue to-neon-pink opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-blue to-neon-pink blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              <span className="relative text-white font-bold text-xl md:text-2xl tracking-wider flex items-center justify-center gap-2">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                เริ่มเกม
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Game View ---
  return (
    <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center flex flex-col overflow-hidden relative">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-space-900/80 pointer-events-none"></div>

      {/* Main Responsive Container (Force 16:9 on Desktop, Fill on Mobile) */}
      <div className="relative z-10 flex flex-col h-full w-full md:aspect-video md:max-h-screen md:max-w-[177vh] mx-auto md:shadow-2xl md:border-x md:border-white/10 bg-black/20">
        
        {/* Header - Fixed Height */}
        <header className="shrink-0 flex justify-between items-center px-4 py-2 glass-panel border-b border-white/10">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-400">
              Probability
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-xl font-mono text-neon-yellow">
               {formatTime(timer)}
             </div>
             {!isFinished && (
               <button 
                 onClick={checkAnswers}
                 className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-1.5 px-4 rounded shadow-lg transition-transform active:scale-95 border border-green-400"
               >
                 ส่งคำตอบ
               </button>
             )}
          </div>
        </header>

        {/* Game Body - Flex Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Panel: Questions List (Scrollable) */}
          <main className="flex-1 overflow-y-auto p-3 custom-scrollbar">
             <div className="space-y-1">
               {GAME_DATA.map((item) => (
                 <QuestionRow
                   key={item.id}
                   item={item}
                   placedAnswerId={placements[item.id] || null}
                   getAnswerContent={(id) => GAME_DATA.find(d => d.id === id)?.answer || ''}
                   onDrop={handleDropOnSlot}
                   onSlotClick={handleSlotClick}
                   onRemove={handleRemoveFromSlot}
                   isCorrect={isFinished ? (placements[item.id] === item.id) : null}
                   isHighlighted={!!selectedAnswerId}
                 />
               ))}
               {/* Spacer to allow scrolling past bottom */}
               <div className="h-20 md:h-0"></div>
             </div>
          </main>

          {/* Right Panel (Desktop) / Bottom Dock (Mobile): Answer Pool */}
          <aside className={`
            shrink-0 
            md:w-1/3 md:border-l md:border-white/10 md:bg-space-900/50 
            bg-space-900/90 border-t border-neon-blue/30
            flex flex-col
            transition-all duration-300
            ${availableAnswers.length === 0 ? 'h-0 md:h-full p-0 overflow-hidden' : 'h-auto max-h-[35%] md:h-full md:max-h-full p-3'}
          `}>
             <div className="flex justify-between items-center mb-2 md:mb-4 px-1">
                <h3 className="text-sm md:text-lg font-semibold text-yellow-200">
                  {selectedAnswerId ? 'เลือกช่องว่างเพื่อวางคำตอบ' : 'เลือกคำตอบ'}
                </h3>
                <span className="text-xs text-gray-400">{availableAnswers.length} เหลืออยู่</span>
             </div>
             
             <div className="overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 pb-safe">
                  {availableAnswers.map((answer) => (
                    <AnswerTile
                      key={answer.id}
                      id={answer.id}
                      text={answer.content}
                      isDragging={selectedAnswerId === answer.id} // Visual cue
                      isSelected={selectedAnswerId === answer.id}
                      onDragStart={handleDragStart}
                      onClick={() => handleAnswerClick(answer.id)}
                    />
                  ))}
                </div>
             </div>
          </aside>

        </div>
      </div>

      {isFinished && (
        <ResultModal 
          score={score} 
          total={GAME_DATA.length} 
          time={timer} 
          onReset={resetGame} 
        />
      )}
    </div>
  );
};

export default App;