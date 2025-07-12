import { createClient } from '@supabase/supabase-js';
import { PlayerQueryParams, PlayerStats, BatterFormSummary, BowlerFormSummary, AllRounderFormSummary, BowlerOpponentSummary, AllRounderOpponentSummary } from '../types/player.types';

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

export interface BowlerVenueSummary {
  player_name: string;
  match_venue: string;
  games_played: number;
  avg_fantasy_points: number;
  fantasy_points_per_game: number;
  avg_wickets: number;
  wickets_per_game: number;
  total_wickets: number;
  count_3_plus_wickets: number;
  avg_economy: number;
  last_10_scores: string;
  game_id?: string;
}

export interface AllRounderVenueSummary {
  player_name: string;
  match_venue: string;
  games_played: number;
  avg_fantasy_points: number;
  fantasy_points_per_game: number;
  avg_wickets: number;
  wickets_per_game: number;
  total_wickets: number;
  count_3_plus_wickets: number;
  avg_economy: number;
  last_10_scores: string;
  game_id?: string;
}

export class PlayerService {
  private supabase;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('Missing required environment variables: SUPABASE_URL and/or SUPABASE_SERVICE_KEY');
    }

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Only run debug checks in development
    if (!this.isProduction) {
      this.debugCheckDatabase();
    }
  }

  private async debugCheckDatabase() {
    try {
      if (!this.isProduction) {
        console.log('Checking database connection...');
      }
      
      // Check batsmen tables
      const { data: batsmenData, error: batsmenError } = await this.supabase
        .from('batter_form_summary')
        .select('*')
        .limit(1);

      if (batsmenError) {
        console.error('Error fetching from batter_form_summary:', batsmenError);
      }

      const { data: batsmenVenueData, error: batsmenVenueError } = await this.supabase
        .from('batter_venue_summary')
        .select('*')
        .limit(1);

      if (batsmenVenueError) {
        console.error('Error fetching from batter_venue_summary:', batsmenVenueError);
      } else if (!this.isProduction) {
        console.log('Database connection successful');
      }

      // Check bowlers table
      const { data: bowlersData, error: bowlersError } = await this.supabase
        .from('bowler_form_summary')
        .select('*')
        .limit(1);

      if (bowlersError) {
        console.error('Error fetching from bowler_form_summary:', bowlersError);
      }

      // Check all-rounders table
      const { data: allRoundersData, error: allRoundersError } = await this.supabase
        .from('allrounder_form_summary')
        .select('*')
        .limit(1);

      if (allRoundersError) {
        console.error('Error fetching from allrounder_form_summary:', allRoundersError);
      } else if (!this.isProduction) {
        console.log('All-rounders table check successful');
      }
    } catch (error) {
      console.error('Database check error:', error);
    }
  }

  async getBatsmenSeasonForm(gameId?: string): Promise<BatterFormSummary[]> {
    try {
      console.log('Fetching batsmen form data with gameId:', gameId);
      
      let query = this.supabase
        .from('batter_form_summary')
        .select('*');

      if (gameId) {
        // First, get the game_number from visible_contests using match_id
        const { data: contestData, error: contestError } = await this.supabase
          .from('visible_contests')
          .select('game_number')
          .eq('match_id', gameId)
          .single();

        if (contestError) {
          console.error('Error fetching game_number:', contestError);
          return [];
        }

        if (contestData) {
          console.log('Found game_number:', contestData.game_number);
          query = query.eq('game_number', contestData.game_number);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching batsmen form:', error);
        return [];
      }

      console.log('Fetched batsmen data:', data?.length || 0, 'records');
      return data || [];
    } catch (error) {
      console.error('Error in getBatsmenSeasonForm:', error);
      return [];
    }
  }

  async getBowlersSeasonForm(gameId?: string): Promise<BowlerFormSummary[]> {
    try {
      console.log('Fetching bowlers form data with gameId:', gameId);
      
      let query = this.supabase
        .from('bowler_form_summary')
        .select('*')
        .order('fantasy_points', { ascending: false });

      if (gameId) {
        // First, get the game_number from visible_contests using match_id
        const { data: contestData, error: contestError } = await this.supabase
          .from('visible_contests')
          .select('game_number')
          .eq('match_id', gameId)
          .single();

        if (contestError) {
          console.error('Error fetching game_number:', contestError);
          return [];
        }

        if (contestData) {
          console.log('Found game_number:', contestData.game_number);
          query = query.eq('game_number', contestData.game_number);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        return [];
      }

      console.log('Fetched bowlers data:', {
        count: data?.length || 0,
        firstRecord: data?.[0],
        gameId,
        query: query.toString()
      });

      return data || [];
    } catch (error) {
      console.error('Error in getBowlersSeasonForm:', error);
      return [];
    }
  }

  async getAllRoundersSeasonForm(gameId?: string): Promise<AllRounderFormSummary[]> {
    try {
      let query = this.supabase
        .from('allrounder_form_summary')
        .select('*');

      if (gameId) {
        // First, get the game_number from visible_contests using match_id
        const { data: contestData, error: contestError } = await this.supabase
          .from('visible_contests')
          .select('game_number')
          .eq('match_id', gameId)
          .single();

        if (contestError) {
          console.error('Error fetching game_number:', contestError);
          return [];
        }

        if (contestData) {
          console.log('Found game_number:', contestData.game_number);
          query = query.eq('game_number', contestData.game_number);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching all-rounders data:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all-rounders data:', error);
      return [];
    }
  }

  async getPlayersByCategory({ category, filter, limit = 3 }: PlayerQueryParams): Promise<BatterFormSummary[]> {
    try {
      let query = this.supabase
        .from('batter_form_summary')
        .select('*');

      if (category !== 'Batsmen') {
        if (!this.isProduction) {
          console.log('Only Batsmen category is currently supported');
        }
        return [];
      }

      query = query.order('season_avg', { ascending: false });
      const { data, error } = await query.limit(limit);

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        if (!this.isProduction) {
          console.log('No data found for the given criteria');
        }
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error in getPlayersByCategory:', error);
      throw error;
    }
  }

  async getVisibleContests(): Promise<VisibleContest[]> {
    try {
      if (!this.isProduction) {
        console.log('Fetching visible contests');
      }

      const { data, error } = await this.supabase
        .from('visible_contests')
        .select('*')
        .order('game_number', { ascending: true });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        if (!this.isProduction) {
          console.log('No visible contests found');
        }
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error in getVisibleContests:', error);
      throw error;
    }
  }

  async getBatsmenVenueForm(gameId?: string): Promise<any[]> {
    try {
      console.log('Fetching batsmen venue data with gameId:', gameId);
      
      let query = this.supabase
        .from('batter_venue_summary')
        .select('*');

      if (gameId) {
        // First, get the game_number from visible_contests using match_id
        const { data: contestData, error: contestError } = await this.supabase
          .from('visible_contests')
          .select('game_number')
          .eq('match_id', gameId)
          .single();

        if (contestError) {
          console.error('Error fetching game_number:', contestError);
          return [];
        }

        if (contestData) {
          console.log('Found game_number:', contestData.game_number);
          query = query.eq('game_number', contestData.game_number);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching batsmen venue data:', error);
        return [];
      }

      console.log('Fetched batsmen venue data:', data?.length || 0, 'records');
      return data || [];
    } catch (error) {
      console.error('Error in getBatsmenVenueForm:', error);
      return [];
    }
  }

  async getBatsmenOpponentForm(gameId?: string): Promise<any[]> {
    try {
      console.log('Fetching batsmen opponent data with gameId:', gameId);
      
      let query = this.supabase
        .from('batter_opponent_summary')
        .select('*');

      if (gameId) {
        // First, get the game_number from visible_contests using match_id
        const { data: contestData, error: contestError } = await this.supabase
          .from('visible_contests')
          .select('game_number')
          .eq('match_id', gameId)
          .single();

        if (contestError) {
          console.error('Error fetching game_number:', contestError);
          return [];
        }

        if (contestData) {
          console.log('Found game_number:', contestData.game_number);
          query = query.eq('game_number', contestData.game_number);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching batsmen opponent data:', error);
        return [];
      }

      console.log('Fetched batsmen opponent data:', data?.length || 0, 'records');
      return data || [];
    } catch (error) {
      console.error('Error in getBatsmenOpponentForm:', error);
      return [];
    }
  }

  async getBowlersVenueForm(gameId?: string): Promise<BowlerVenueSummary[]> {
    try {
      console.log('Fetching bowlers venue data with gameId:', gameId);
      
      let query = this.supabase
        .from('bowler_venue_summary')
        .select();

      if (gameId) {
        // First, get the game_number from visible_contests using match_id
        const { data: contestData, error: contestError } = await this.supabase
          .from('visible_contests')
          .select('game_number')
          .eq('match_id', gameId)
          .single();

        if (contestError) {
          console.error('Error fetching game_number:', contestError);
          return [];
        }

        if (contestData) {
          console.log('Found game_number:', contestData.game_number);
          query = query.eq('game_number', contestData.game_number);
        }
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching bowlers venue data:', error);
        return [];
      }

      console.log('Fetched bowlers venue data:', data?.length || 0, 'records');
      return data || [];
    } catch (error) {
      console.error('Error in getBowlersVenueForm:', error);
      return [];
    }
  }

  async getBowlersOpponentForm(gameId?: string): Promise<BowlerOpponentSummary[]> {
    try {
      console.log('Fetching bowlers opponent data with gameId:', gameId);
      
      let query = this.supabase
        .from('bowler_opponent_summary')
        .select();

      if (gameId) {
        // First, get the game_number from visible_contests using match_id
        const { data: contestData, error: contestError } = await this.supabase
          .from('visible_contests')
          .select('game_number')
          .eq('match_id', gameId)
          .single();

        if (contestError) {
          console.error('Error fetching game_number:', contestError);
          return [];
        }

        if (contestData) {
          console.log('Found game_number:', contestData.game_number);
          query = query.eq('game_number', contestData.game_number);
        }
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching bowlers opponent data:', error);
        return [];
      }

      console.log('Fetched bowlers opponent data:', data?.length || 0, 'records');
      return data || [];
    } catch (error) {
      console.error('Error in getBowlersOpponentForm:', error);
      return [];
    }
  }

  async getAllRoundersVenueForm(gameId?: string): Promise<AllRounderVenueSummary[]> {
    try {
      console.log('Fetching all-rounders venue data with gameId:', gameId);
      
      let query = this.supabase
        .from('allrounder_venue_summary')
        .select();

      if (gameId) {
        // First, get the game_number from visible_contests using match_id
        const { data: contestData, error: contestError } = await this.supabase
          .from('visible_contests')
          .select('game_number')
          .eq('match_id', gameId)
          .single();

        if (contestError) {
          console.error('Error fetching game_number:', contestError);
          return [];
        }

        if (contestData) {
          console.log('Found game_number:', contestData.game_number);
          query = query.eq('game_number', contestData.game_number);
        }
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching all-rounders venue data:', error);
        return [];
      }

      console.log('Fetched all-rounders venue data:', data?.length || 0, 'records');
      return data || [];
    } catch (error) {
      console.error('Error in getAllRoundersVenueForm:', error);
      return [];
    }
  }

  async getAllRoundersOpponentForm(gameId?: string): Promise<AllRounderOpponentSummary[]> {
    try {
      console.log('Fetching all-rounders opponent data with gameId:', gameId);
      
      let query = this.supabase
        .from('allrounder_opponent_summary')
        .select();

      if (gameId) {
        // First, get the game_number from visible_contests using match_id
        const { data: contestData, error: contestError } = await this.supabase
          .from('visible_contests')
          .select('game_number')
          .eq('match_id', gameId)
          .single();

        if (contestError) {
          console.error('Error fetching game_number:', contestError);
          return [];
        }

        if (contestData) {
          console.log('Found game_number:', contestData.game_number);
          query = query.eq('game_number', contestData.game_number);
        }
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching all-rounders opponent data:', error);
        return [];
      }

      console.log('Fetched all-rounders opponent data:', data?.length || 0, 'records');
      return data || [];
    } catch (error) {
      console.error('Error in getAllRoundersOpponentForm:', error);
      return [];
    }
  }
} 