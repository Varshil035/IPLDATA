import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AllRounderFormSummary, AllRounderVenueSummary, AllRounderOpponentSummary } from '@/lib/api';
import PlayerCardBase from './PlayerCardBase';
import PerformanceChart from './PerformanceChart';
import { ChevronDown } from 'lucide-react';

interface AllRounderCardProps {
  player: AllRounderFormSummary | AllRounderVenueSummary | AllRounderOpponentSummary;
  viewType?: 'season' | 'venue' | 'opponent';
  index?: number;
}

const AllRounderCard: React.FC<AllRounderCardProps> = ({ player, viewType = 'season', index = 0 }) => {
  const [isBattingExpanded, setIsBattingExpanded] = useState(false);
  const [isBowlingExpanded, setIsBowlingExpanded] = useState(false);

  // Parse last 5 scores for batting chart with null check
  const scores = (player.batting_last_5_scores || '').split(',').map(score => {
    const parsed = parseInt(score.trim());
    return isNaN(parsed) ? 0 : parsed;
  });
  
  // Parse last 5 figures for bowling chart with null check
  const figures = (player.bowling_last_5_figures || '').split(',').map(figure => {
    const [wickets] = figure.trim().split('/').map(Number);
    return isNaN(wickets) ? 0 : wickets;
  });

  const mainStatValue = viewType === 'season' 
    ? (player as AllRounderFormSummary).fantasy_points
    : (player as AllRounderVenueSummary | AllRounderOpponentSummary).fantasy_points_per_game;

  const mainStatLabel = (() => {
    switch (viewType) {
      case 'season':
        return 'Fantasy Points';
      case 'venue':
      case 'opponent':
        return 'Fantasy Points\nper Game';
      default:
        return '';
    }
  })();

  return (
    <PlayerCardBase
      player={{
        ...player,
        role: 'All Rounder'
      }}
      index={index}
      mainStat={{
        value: mainStatValue,
        label: mainStatLabel,
        format: (value: number) => value?.toFixed(1),
        highlight: true,
      }}
      statsGrid={[
        {
          label: viewType === 'season' ? 'Batting Avg' : 'Venue Batting Avg',
          value: player.batting_avg,
          format: (value) => value?.toFixed(2),
          highlight: false,
          className: 'col-span-1',
        },
        {
          label: viewType === 'season' ? 'Bowling Avg' : 'Venue Bowling Avg',
          value: player.bowling_avg,
          format: (value) => value?.toFixed(2),
          highlight: false,
          className: 'col-span-1',
        },
        {
          label: viewType === 'season' ? 'Total Runs' : 'Venue Runs',
          value: player.batting_total_runs,
          highlight: false,
          className: 'col-span-1',
        },
        {
          label: viewType === 'season' ? 'Total Wickets' : 'Venue Wickets',
          value: player.bowling_total_wickets,
          highlight: false,
          className: 'col-span-1',
        },
      ]}
    >
      {/* Batting Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-4"
      >
        <button
          onClick={() => setIsBattingExpanded(!isBattingExpanded)}
          className="w-full flex justify-between items-center mb-3 p-2 rounded-lg bg-[#1A2337] hover:bg-[#1A2337]/80 transition-colors"
        >
          <h3 className="text-sm font-semibold text-white">Batting Performance</h3>
          <motion.div
            animate={{ rotate: isBattingExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-5 w-5 text-[#B0B8D1]" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isBattingExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Additional Batting Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[#B0B8D1]">Strike Rate</p>
                  <p className="text-sm font-semibold text-white">{player.batting_strike_rate?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#B0B8D1]">30+ Scores</p>
                  <p className="text-sm font-semibold text-white">{player.batting_count_30_plus}</p>
                </div>
              </div>

              {/* Batting Performance Chart */}
              <div className="mb-4">
                <p className="text-xs text-[#B0B8D1] mb-2">Recent Scores</p>
                <PerformanceChart
                  data={scores}
                  rawScores={player.batting_last_5_scores?.split(',')}
                  label="Runs"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bowling Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 border-t border-[#1A2337] pt-3"
      >
        <button
          onClick={() => setIsBowlingExpanded(!isBowlingExpanded)}
          className="w-full flex justify-between items-center mb-3 p-2 rounded-lg bg-[#1A2337] hover:bg-[#1A2337]/80 transition-colors"
        >
          <h3 className="text-sm font-semibold text-white">Bowling Performance</h3>
          <motion.div
            animate={{ rotate: isBowlingExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-5 w-5 text-[#B0B8D1]" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isBowlingExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Additional Bowling Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[#B0B8D1]">Economy</p>
                  <p className="text-sm font-semibold text-white">{player.bowling_economy?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#B0B8D1]">3+ Wickets</p>
                  <p className="text-sm font-semibold text-white">{player.bowling_count_3_plus_wickets}</p>
                </div>
              </div>

              {/* Bowling Performance Chart */}
              <div className="mb-4">
                <p className="text-xs text-[#B0B8D1] mb-2">Recent Wickets</p>
                <PerformanceChart
                  data={figures}
                  rawScores={player.bowling_last_5_figures?.split(',')}
                  label="Wickets"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PlayerCardBase>
  );
};

export default AllRounderCard; 