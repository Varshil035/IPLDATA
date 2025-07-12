export type PlayerCategory = 'Batsmen' | 'Bowlers' | 'All Rounders';
export type FilterType = 'This Season' | 'Vs. Opponent' | 'At Venue';

export interface PlayerStats {
  id: number;
  name: string;
  team: string;
  rank: number;
  lastScores: number[];
  vsRivalAvg: number;
  venueAvg: number;
  otherAvg: number;
}

export interface PlayerQueryParams {
  category: PlayerCategory;
  filter: FilterType;
  limit?: number;
}

export interface BatterFormThisSeason {
  player_name: string;
  image_url: string;
  role: string;
  season_avg: number;
  count_30_plus: number;
  count_50_plus: number;
  last_5_scores: string;
  updated_at: string;
}

export interface BowlerFormSummary {
  player_name: string;
  image_url: string;
  role: string;
  current_team: string;
  season_economy: number;
  strike_rate: number;
  bowling_avg: number;
  total_wickets: number;
  count_2_plus: number;
  count_3_plus: number;
  last_5_figures: string;
  updated_at: string;
}

export interface BowlerOpponentSummary {
  player_name: string;
  current_team: string;
  opponent_team: string;
  role: string;
  image_url: string;
  game_number: number;
  games_played: number;
  total_wickets: number;
  total_runs_conceded: number;
  total_overs: number;
  total_balls: number;
  bowling_avg: number;
  bowling_economy: number;
  count_3_plus_wickets: number;
  last_5_figures: string;
  fantasy_points: number;
  fantasy_points_per_game: number;
  updated_at: string;
}

export interface AllRounderFormSummary {
  player_name: string;
  image_url: string;
  current_team: string;
  batting_avg: number;
  batting_strike_rate: number;
  total_runs: number;
  count_30_plus: number;
  count_50_plus: number;
  last_5_scores: string;
  bowling_avg: number;
  economy: number;
  bowling_strike_rate: number;
  total_wickets: number;
  count_2_plus_wkts: number;
  count_3_plus_wkts: number;
  last_5_figures: string;
}

export interface BatterFormSummary {
  player_name: string;
  current_team: string;
  role: string;
  image_url: string;
  game_number: number;
  contest: string;
  fantasy_points: number;
  season_avg: number;
  count_30_plus: number;
  count_50_plus: number;
  last_5_scores: string;
  total_runs: number;
  updated_at: string;
}

export interface AllRounderVenueSummary {
  player_name: string;
  match_venue: string;
  current_team: string;
  role: string;
  image_url: string;
  game_number: number;
  games_played: number;
  total_fantasy_points: number;
  fantasy_points_per_game: number;
  batting_avg: number;
  batting_strike_rate: number;
  batting_total_runs: number;
  batting_count_30_plus: number;
  batting_last_5_scores: string;
  bowling_avg: number;
  bowling_economy: number;
  bowling_total_wickets: number;
  bowling_count_3_plus_wickets: number;
  bowling_last_5_figures: string;
  updated_at: string;
}

export interface AllRounderOpponentSummary {
  player_name: string;
  current_team: string;
  opponent_team: string;
  role: string;
  image_url: string;
  game_number: number;
  contest: string;
  games_played: number;
  total_fantasy_points: number;
  fantasy_points_per_game: number;
  batting_avg: number;
  batting_strike_rate: number;
  batting_total_runs: number;
  batting_count_30_plus: number;
  batting_last_5_scores: string;
  bowling_avg: number;
  bowling_economy: number;
  bowling_total_wickets: number;
  bowling_count_3_plus_wickets: number;
  bowling_last_5_figures: string;
  updated_at: string;
}

export interface BatterOpponentSummary {
  player_name: string;
  current_team: string;
  opponent_team: string;
  role: string;
  image_url: string;
  game_number: number;
  games_played: number;
  total_runs: number;
  batting_avg: number;
  batting_strike_rate: number;
  count_30_plus: number;
  count_50_plus: number;
  last_5_scores: string;
  fantasy_points: number;
  fantasy_points_per_game: number;
  updated_at: string;
} 