'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BowlerFormSummary, BowlerVenueSummary, BowlerOpponentSummary } from '@/lib/api';
import PlayerCardBase from './PlayerCardBase';
import PerformanceChart from './PerformanceChart';

interface BowlerCardProps {
  player: BowlerFormSummary | BowlerVenueSummary | BowlerOpponentSummary;
  viewType: 'season' | 'venue' | 'opponent';
  index?: number;
}

export const BowlerCard: React.FC<BowlerCardProps> = ({ player, viewType, index = 0 }) => {
  // Parse figures based on view type
  const parseWickets = (figure: string) => {
    const wickets = parseInt(figure.split('/')[0].trim());
    return isNaN(wickets) ? 0 : wickets;
  };

  const scores = viewType === 'season' 
    ? (player as BowlerFormSummary).last_5_figures?.split(',').map(parseWickets) || []
    : viewType === 'venue'
      ? (player as BowlerVenueSummary).last_10_figures?.split(',').map(parseWickets) || []
      : (player as BowlerOpponentSummary).last_5_figures?.split(',').map(parseWickets) || [];

  // Define stats grid based on view type
  const getStatsGrid = () => {
    if (viewType === 'season') {
      const seasonPlayer = player as BowlerFormSummary;
      return [
        { label: 'Average', value: seasonPlayer.season_avg?.toFixed(2) || '0.00' },
        { label: 'Economy', value: seasonPlayer.season_eco?.toFixed(2) || '0.00' },
        { label: 'Strike Rate', value: seasonPlayer.season_strike_rate?.toFixed(1) || '0.0' },
        { label: 'Wickets/Match', value: seasonPlayer.avg_wickets_per_match?.toFixed(1) || '0.0' },
        { label: '3+ Wickets', value: seasonPlayer.count_3_plus_wickets?.toString() || '0' },
        { label: 'Total Wickets', value: seasonPlayer.total_wickets?.toString() || '0' }
      ];
    } else if (viewType === 'venue') {
      const venuePlayer = player as BowlerVenueSummary;
      return [
        { label: 'Games', value: venuePlayer.games_played?.toString() || '0' },
        { label: 'Total Wickets', value: venuePlayer.total_wickets?.toString() || '0' },
        { label: '3+ Wickets', value: venuePlayer.count_3_plus_wickets?.toString() || '0' },
        { label: 'Wickets/Game', value: venuePlayer.wickets_per_game?.toFixed(1) || '0.0' },
        { label: 'Avg Fantasy', value: venuePlayer.avg_fantasy_points?.toFixed(1) || '0.0' },
        { label: 'Economy', value: venuePlayer.avg_economy?.toFixed(2) || '0.00' }
      ];
    } else {
      const opponentPlayer = player as BowlerOpponentSummary;
      return [
        { label: 'Games', value: opponentPlayer.games_played?.toString() || '0' },
        { label: 'Total Wickets', value: opponentPlayer.total_wickets?.toString() || '0' },
        { label: '3+ Wickets', value: opponentPlayer.count_3_plus_wickets?.toString() || '0' },
        { label: 'Wickets/Game', value: opponentPlayer.wickets_per_game?.toFixed(1) || '0.0' },
        { label: 'Economy', value: opponentPlayer.bowling_economy?.toFixed(2) || '0.00' },
        { label: 'Bowling Avg', value: opponentPlayer.bowling_avg?.toFixed(2) || '0.00' }
      ];
    }
  };

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
      player={player}
      index={index}
      mainStat={{
        value: viewType === 'season' 
          ? (player as BowlerFormSummary).fantasy_points
          : viewType === 'venue'
            ? (player as BowlerVenueSummary).fantasy_points_per_game
            : (player as BowlerOpponentSummary).fantasy_points_per_game,
        label: mainStatLabel,
        format: (value: number) => value?.toFixed(1),
        highlight: true,
      }}
      statsGrid={getStatsGrid()}
    >
      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-3"
      >
        <p className="text-xs text-[#B0B8D1] mb-2">
          {viewType === 'season' ? 'Last 5 Figures' : viewType === 'venue' ? 'Last 10 Figures at Venue' : 'Last 5 Figures vs Opponent'}
        </p>
        <PerformanceChart
          data={scores}
          rawScores={viewType === 'season'
            ? (player as BowlerFormSummary).last_5_figures?.split(',')
            : viewType === 'venue'
              ? (player as BowlerVenueSummary).last_10_figures?.split(',')
              : (player as BowlerOpponentSummary).last_5_figures?.split(',')}
          label="Wickets"
          height={120}
        />
      </motion.div>
    </PlayerCardBase>
  );
}; 