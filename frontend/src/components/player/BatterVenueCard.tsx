import React from 'react';
import { motion } from 'framer-motion';
import { BatterVenueSummary } from '@/lib/api';
import PlayerCardBase from './PlayerCardBase';
import PerformanceChart from './PerformanceChart';

interface BatterVenueCardProps {
  player: BatterVenueSummary;
  index?: number;
}

const BatterVenueCard: React.FC<BatterVenueCardProps> = ({ player, index = 0 }) => {
  // Parse last 10 scores for the venue performance chart
  const scores = (player.last_10_scores || '').split(',').map(score => {
    const parsed = parseInt(score.trim());
    return isNaN(parsed) ? 0 : parsed;
  });

  return (
    <PlayerCardBase
      player={{
        ...player,
        role: 'Batsman'
      }}
      index={index}
      mainStat={{
        value: player.avg_fantasy_points,
        label: 'Avg Fantasy Points',
        format: (value) => value?.toFixed(1),
        highlight: true,
      }}
      statsGrid={[
        {
          label: 'Average Score',
          value: player.avg_score,
          format: (value) => value?.toFixed(2),
          highlight: false,
          className: 'col-span-1',
        },
        {
          label: 'Total Runs',
          value: player.total_runs,
          highlight: false,
          className: 'col-span-1',
        },
        {
          label: 'Venue',
          value: player.match_venue,
          highlight: false,
          className: 'col-span-2',
        },
      ]}
    >
      {/* Venue Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-4"
      >
        <div className="mb-4">
          <p className="text-xs text-[#B0B8D1] mb-2">Last 10 Scores at Venue</p>
          <PerformanceChart
            data={scores}
            label="Runs"
          />
        </div>

        {/* Last 10 Scores Display */}
        <div>
          <p className="text-xs text-[#B0B8D1] mb-2">Scores Breakdown</p>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {scores.map((score, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9 + idx * 0.1 }}
                className={`flex-shrink-0 rounded-lg p-2 text-center min-w-[40px] ${
                  score >= 50 ? 'bg-[#1A2337] text-[#FFC93C]' :
                  score >= 30 ? 'bg-[#1A2337] text-[#5A8DEE]' :
                  'bg-[#1A2337] text-[#B0B8D1]'
                }`}
              >
                <p className="text-sm font-semibold">{score}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </PlayerCardBase>
  );
};

export default BatterVenueCard; 