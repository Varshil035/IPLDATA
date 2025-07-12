// API Base URL with fallback for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Debug environment variables
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  Final_API_URL: API_BASE_URL
});

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

export interface BasePlayerStats {
  player_name: string;
  image_url: string;
  role: string;
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
  match_venue?: string;
  avg_score?: number;
  avg_fantasy_points?: number;
  is_venue_view?: boolean;
}

export interface BowlerFormSummary extends BasePlayerStats {
  season_avg: number;
  season_eco: number;
  season_strike_rate: number;
  avg_wickets_per_match: number;
  total_wickets: number;
  count_3_plus_wickets: number;
  fantasy_points: number;
  last_5_figures: string;
  game_id?: string;
}

export interface AllRounderFormSummary {
  player_name: string;
  current_team: string;
  role: string;
  image_url: string;
  game_number: number;
  contest: string;
  fantasy_points: number;
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

export interface BatterVenueSummary {
  match_venue: string;
  player_name: string;
  current_team: string;
  role: string;
  image_url: string;
  game_number: number;
  games_played: number;
  total_runs: number;
  avg_score: number;
  avg_score_2025: number;
  avg_fantasy_points: number;
  last_10_scores: string;
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

export interface BowlerVenueSummary extends BasePlayerStats {
  match_venue: string;
  games_played: number;
  total_wickets: number;
  count_3_plus_wickets: number;
  wickets_per_game: number;
  avg_fantasy_points: number;
  fantasy_points_per_game: number;
  avg_economy: number;
  last_10_figures: string;
  game_id?: string;
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
  bowling_avg: number;
  bowling_economy: number;
  wickets_per_game: number;
  count_3_plus_wickets: number;
  last_5_figures: string;
  fantasy_points: number;
  fantasy_points_per_game: number;
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

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

export interface VisibleContest {
  match_id: string;
  match_date: string;
  match_time: string;
  contest: string;
  team1_abbr: string;
  team2_abbr: string;
  venue: string;
  game_number: number;
}

export const api = {
  players: {
    getByCategory: async (
      category: PlayerCategory,
      filter: FilterType,
      limit: number = 3
    ): Promise<BatterFormSummary[]> => {
      const params = new URLSearchParams({
        category,
        filter,
        limit: limit.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/players?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }

      return response.json();
    },
  },
  getBatsmenSeasonForm: async (gameId: string): Promise<BatterFormSummary[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/batsmen/season-form?gameId=${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch batsmen data');
      return response.json();
    } catch (error) {
      console.error('Error fetching batsmen data:', error);
      throw error;
    }
  },
  getBowlersSeasonForm: async (gameId: string): Promise<BowlerFormSummary[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/bowlers/season-form?gameId=${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch bowlers data');
      return response.json();
    } catch (error) {
      console.error('Error fetching bowlers data:', error);
      throw error;
    }
  },
  getAllRoundersSeasonForm: async (gameId: string): Promise<AllRounderFormSummary[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/allrounders/season-form?gameId=${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch all-rounders data');
      return response.json();
    } catch (error) {
      console.error('Error fetching all-rounders data:', error);
      throw error;
    }
  },
  getVisibleContests: async (): Promise<VisibleContest[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/games/visible`);
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching visible contests:', error);
      throw error;
    }
  },
  getBatsmenVenueForm: async (gameId: string): Promise<BatterVenueSummary[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/batsmen/venue-form?gameId=${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch batsmen venue data');
      return response.json();
    } catch (error) {
      console.error('Error fetching batsmen venue data:', error);
      throw error;
    }
  },
  getBatsmenOpponentForm: async (gameId: string): Promise<BatterOpponentSummary[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/batsmen/opponent-form?gameId=${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch batsmen opponent data');
      return response.json();
    } catch (error) {
      console.error('Error fetching batsmen opponent data:', error);
      throw error;
    }
  },
  getBowlersVenueForm: async (gameId: string): Promise<BowlerVenueSummary[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/bowlers/venue-form?gameId=${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch bowlers venue data');
      return response.json();
    } catch (error) {
      console.error('Error fetching bowlers venue data:', error);
      throw error;
    }
  },
  getBowlersOpponentForm: async (gameId: string): Promise<BowlerOpponentSummary[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/bowlers/opponent-form?gameId=${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch bowlers opponent data');
      return response.json();
    } catch (error) {
      console.error('Error fetching bowlers opponent data:', error);
      throw error;
    }
  },
  getAllRoundersVenueForm: async (gameId: string): Promise<AllRounderVenueSummary[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/allrounders/venue-form?gameId=${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch all-rounders venue data');
      return response.json();
    } catch (error) {
      console.error('Error fetching all-rounders venue data:', error);
      throw error;
    }
  },
  getAllRoundersOpponentForm: async (gameId: string): Promise<AllRounderOpponentSummary[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/allrounders/opponent-form?gameId=${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch all-rounders opponent data');
      return response.json();
    } catch (error) {
      console.error('Error fetching all-rounders opponent data:', error);
      throw error;
    }
  },
}; 