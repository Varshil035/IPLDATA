'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BatterFormSummary } from '@/lib/api';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: BatterFormSummary;
  className?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, className }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={cn(
      'relative bg-gradient-to-br from-[#1A2337] to-[#0E1323] rounded-xl overflow-hidden',
      'border border-[#5A8DEE]/30 shadow-lg transform-gpu transition-all duration-300',
      'hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(90,141,238,0.2)]',
      className
    )}>
      <div className="p-4">
        {/* Header Section */}
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 bg-gradient-to-br from-[#1A2337] to-[#0E1323] rounded-full flex-shrink-0 shadow-lg border border-[#5A8DEE]/30">
            {!imageError ? (
              <Image
                src={player.image_url}
                alt={player.player_name}
                fill
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
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">
              {player.player_name}
            </h3>
            <p className="text-sm text-[#B0B8D1]">
              {player.role}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-[#1A2337] to-[#0E1323] rounded-xl p-3 shadow-lg border border-[#5A8DEE]/30">
            <span className="text-xs text-[#B0B8D1] block">Season Average</span>
            <span className="text-lg font-semibold text-white">
              {player.season_avg?.toFixed(2)}
            </span>
          </div>
          <div className="bg-gradient-to-br from-[#1A2337] to-[#0E1323] rounded-xl p-3 shadow-lg border border-[#5A8DEE]/30">
            <span className="text-xs text-[#B0B8D1] block">30+ Scores</span>
            <span className="text-lg font-semibold text-white">
              {player.count_30_plus}
            </span>
          </div>
        </div>

        {/* Last 5 Scores */}
        <div className="mt-6">
          <p className="text-xs text-[#B0B8D1] mb-2">Last 5 Scores</p>
          <div className="flex space-x-2">
            {(player.last_5_scores || '').split(',').map((score, index) => {
              const parsedScore = parseInt(score.trim());
              const scoreValue = isNaN(parsedScore) ? 0 : parsedScore;
              return (
                <div
                  key={index}
                  className={`flex-1 rounded-lg p-2 text-center ${
                    scoreValue >= 50 ? 'bg-[#1A2337] text-[#FFC93C]' :
                    scoreValue >= 30 ? 'bg-[#1A2337] text-[#5A8DEE]' :
                    'bg-[#1A2337] text-[#B0B8D1]'
                  }`}
                >
                  <span className="text-sm font-semibold">{scoreValue}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard; 