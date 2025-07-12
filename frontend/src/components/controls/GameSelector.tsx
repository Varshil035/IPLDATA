import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface Game {
  id: string;
  team1: string;
  team2: string;
  venue: string;
  time: string;
  isLive?: boolean;
}

interface GameSelectorProps {
  games: Game[];
  selectedGameId: string;
  onGameChange: (gameId: string) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({
  games,
  selectedGameId,
  onGameChange,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  // Check if scroll indicators should be shown
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      // Check on window resize
      window.addEventListener('resize', checkScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Scroll Indicators */}
      {showLeftScroll && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0E1323] to-transparent z-10 pointer-events-none" />
      )}
      {showRightScroll && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0E1323] to-transparent z-10 pointer-events-none" />
      )}

      {/* Games Container */}
      <div 
        ref={scrollContainerRef}
        className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2 px-1 -mx-1 snap-x snap-mandatory"
      >
        {games.map((game) => (
          <motion.button
            key={game.id}
            onClick={() => onGameChange(game.id)}
            className={`flex-shrink-0 relative group snap-center ${
              selectedGameId === game.id 
                ? 'bg-gradient-to-br from-[#5A8DEE]/20 to-[#0E1323] ring-2 ring-[#5A8DEE]' 
                : 'bg-[#1A2337] hover:bg-[#1A2337]/80'
            } rounded-xl p-3 md:p-4 w-[260px] md:w-[280px] transition-all duration-300`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Game Status Indicator */}
            {game.isLive && (
              <div className="absolute top-3 right-3 flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-red-500 font-medium">LIVE</span>
              </div>
            )}

            {/* Teams */}
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="text-base md:text-lg font-bold text-white truncate pr-2">{game.team1}</div>
              <div className="text-sm text-[#B0B8D1] px-2">vs</div>
              <div className="text-base md:text-lg font-bold text-white truncate pl-2">{game.team2}</div>
            </div>

            {/* Venue & Time */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="text-xs md:text-sm text-[#B0B8D1] truncate mb-1 md:mb-0">{game.venue}</div>
              <div className="text-xs md:text-sm text-[#B0B8D1] font-medium">{game.time}</div>
            </div>

            {/* Selection Indicator */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-[#5A8DEE] rounded-b-xl"
              initial={false}
              animate={{
                opacity: selectedGameId === game.id ? 1 : 0,
                scale: selectedGameId === game.id ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default GameSelector; 