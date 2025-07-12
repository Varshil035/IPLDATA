import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface BasePlayerStats {
  player_name: string;
  image_url: string;
  role: string;
  current_team?: string;
}

interface PlayerCardBaseProps<T extends BasePlayerStats> {
  player: T;
  mainStat: {
    value: number;
    label: string;
    format?: (value: number) => string;
    highlight?: boolean;
  };
  statsGrid: Array<{
    label: string;
    value: number | string;
    format?: (value: number) => string;
    highlight?: boolean;
    className?: string;
  }>;
  children?: React.ReactNode;
  index?: number;
}

const PlayerCardBase = <T extends BasePlayerStats>({
  player,
  mainStat,
  statsGrid,
  children,
  index = 0,
}: PlayerCardBaseProps<T>) => {
  const [imageError, setImageError] = useState(false);

  const formatStatValue = (stat: PlayerCardBaseProps<T>['statsGrid'][0]) => {
    if (stat.format && typeof stat.value === 'number') {
      return stat.format(stat.value);
    }
    return stat.value;
  };

  // Calculate offset based on index
  const yOffset = index % 2 === 0 ? -4 : 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: yOffset,
        transition: { duration: 0.3 }
      }}
      whileHover={{ 
        y: 0,
        transition: { duration: 0.2 }
      }}
      className="relative bg-[#0E1323] rounded-2xl overflow-hidden w-full max-w-[400px] border-2 border-[#1A2337] group transform-gpu"
      style={{
        boxShadow: `0 ${Math.abs(yOffset) * 2}px 30px rgba(90,141,238,0.25), 
                    0 4px 12px rgba(0,0,0,0.2)`
      }}
    >
      {/* Permanent backlit effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#5A8DEE]/10 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#5A8DEE]/20 via-[#5A8DEE]/10 to-transparent" />
      </div>
      
      {/* Card inner glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
      
      <div className="p-4 relative">
        {/* Header Section */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative w-16 h-16 bg-gradient-to-br from-[#1A2337] to-[#0E1323] rounded-full flex-shrink-0 shadow-[0_4px_12px_rgb(0,0,0,0.2)] border border-[#5A8DEE]/30"
          >
            {!imageError ? (
              <Image
                src={player.image_url}
                alt={player.player_name}
                fill
                priority
                className="rounded-full object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 64px) 100vw, 64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-[#5A8DEE] to-[#2B4C8C]">
                <span className="text-2xl font-bold text-white">
                  {player.player_name.charAt(0)}
                </span>
              </div>
            )}
          </motion.div>
          
          <div className="flex-1 min-w-0 mr-2">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base font-bold text-white truncate"
            >
              {player.player_name}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-[#B0B8D1]"
            >
              {player.role} {player.current_team ? `• ${player.current_team}` : ''}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-shrink-0"
          >
            <div className={`bg-gradient-to-br ${mainStat.highlight ? 'from-[#5A8DEE]/20 to-[#0E1323] ring-2 ring-[#5A8DEE]' : 'from-[#1A2337] to-[#0E1323]'} rounded-xl px-3 py-2 shadow-[0_4px_12px_rgb(0,0,0,0.2)] border border-[#5A8DEE]/30`}>
              <span className={`text-lg font-bold ${mainStat.highlight ? 'text-[#FFC93C]' : 'text-white'} block text-center`}>
                {mainStat.format ? mainStat.format(mainStat.value) : mainStat.value}
              </span>
              <span className="text-[10px] text-[#B0B8D1] block text-center whitespace-pre-line leading-tight">
                {mainStat.label}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {statsGrid.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`bg-gradient-to-br from-[#1A2337] to-[#0E1323] rounded-xl p-2 shadow-[0_4px_12px_rgb(0,0,0,0.2)] border border-[#5A8DEE]/30 ${
                stat.highlight ? 'ring-2 ring-[#5A8DEE]/30' : ''
              } ${stat.className || ''}`}
            >
              <span className="text-xs text-[#B0B8D1] block">{stat.label}</span>
              <span className={`text-sm font-semibold ${stat.highlight ? 'text-[#FFC93C]' : 'text-white'}`}>
                {formatStatValue(stat)}
              </span>
            </motion.div>
          ))}
        </div>

        {children}
      </div>
    </motion.div>
  );
};

export default PlayerCardBase; 