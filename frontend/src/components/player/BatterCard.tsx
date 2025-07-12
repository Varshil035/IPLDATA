import React from 'react';
import { BatterFormSummary, BatterVenueSummary, BatterOpponentSummary } from '@/lib/api';
import PlayerCardBase from './PlayerCardBase';
import PerformanceChart from './PerformanceChart';

interface BatterCardProps {
  player: BatterFormSummary | BatterVenueSummary | BatterOpponentSummary;
  viewType: 'season' | 'venue' | 'opponent';
  index?: number;
}

const BatterCard: React.FC<BatterCardProps> = ({ player, viewType = 'season', index = 0 }) => {
  // Parse last 5 scores for chart
  const scores = viewType === 'venue' 
    ? (player as BatterVenueSummary).last_10_scores?.split(',').map(Number) || []
    : (player as BatterFormSummary | BatterOpponentSummary).last_5_scores?.split(',').map(Number) || [];

  const mainStatValue = (() => {
    switch (viewType) {
      case 'season':
        return (player as BatterFormSummary).fantasy_points;
      case 'venue':
        return (player as BatterVenueSummary).avg_fantasy_points;
      case 'opponent':
        return (player as BatterOpponentSummary).fantasy_points_per_game;
      default:
        return 0;
    }
  })();

  const mainStatLabel = (() => {
    switch (viewType) {
      case 'season':
        return 'Fantasy Points';
      case 'venue':
        return 'Fantasy Points\nper Game';
      case 'opponent':
        return 'Fantasy Points\nper Game';
      default:
        return '';
    }
  })();

  const getStatsGrid = () => {
    switch (viewType) {
      case 'season':
        const seasonPlayer = player as BatterFormSummary;
        return [
          {
            label: 'Season Avg',
            value: seasonPlayer.season_avg,
            format: (value: number) => value?.toFixed(2),
            highlight: false,
          },
          {
            label: 'Total Runs',
            value: seasonPlayer.total_runs,
            highlight: false,
          },
          {
            label: '30+ Scores',
            value: seasonPlayer.count_30_plus,
            highlight: false,
          },
          {
            label: '50+ Scores',
            value: seasonPlayer.count_50_plus,
            highlight: false,
          },
        ];
      case 'venue':
        const venuePlayer = player as BatterVenueSummary;
        return [
          {
            label: 'Venue Avg',
            value: venuePlayer.avg_score,
            format: (value: number) => value?.toFixed(2),
            highlight: false,
          },
          {
            label: 'Games',
            value: venuePlayer.games_played,
            highlight: false,
          },
          {
            label: 'Total Runs',
            value: venuePlayer.total_runs,
            highlight: false,
          },
          {
            label: 'Recent Form',
            value: venuePlayer.avg_score_2025,
            format: (value: number) => value?.toFixed(2),
            highlight: false,
          },
        ];
      case 'opponent':
        const opponentPlayer = player as BatterOpponentSummary;
        return [
          {
            label: 'Batting Avg',
            value: opponentPlayer.batting_avg,
            format: (value: number) => value?.toFixed(2),
            highlight: false,
          },
          {
            label: 'Strike Rate',
            value: opponentPlayer.batting_strike_rate,
            format: (value: number) => value?.toFixed(2),
            highlight: false,
          },
          {
            label: '30+ Scores',
            value: opponentPlayer.count_30_plus,
            highlight: false,
          },
          {
            label: '50+ Scores',
            value: opponentPlayer.count_50_plus,
            highlight: false,
          },
        ];
      default:
        return [];
    }
  };

  return (
    <PlayerCardBase
      player={player}
      index={index}
      mainStat={{
        value: mainStatValue,
        label: mainStatLabel,
        format: (value: number) => value?.toFixed(1),
        highlight: true,
      }}
      statsGrid={getStatsGrid()}
    >
      <div className="mt-4">
        <p className="text-xs text-[#B0B8D1] mb-2">Recent Scores</p>
        <PerformanceChart
          data={scores}
          rawScores={viewType === 'venue' 
            ? (player as BatterVenueSummary).last_10_scores?.split(',')
            : (player as BatterFormSummary | BatterOpponentSummary).last_5_scores?.split(',')}
          label="Runs"
        />
      </div>
    </PlayerCardBase>
  );
};

export default BatterCard; 