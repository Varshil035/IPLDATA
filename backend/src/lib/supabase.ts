import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing required environment variables: SUPABASE_URL and/or SUPABASE_SERVICE_KEY');
}

// Create Supabase client with service key for full database access
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

if (!isProduction) {
  console.log('Supabase client initialized successfully');
}

// Database types based on your schema
export interface PlayerInformation {
  id: number;
  name: string;
  team: string;
  category: 'Batsmen' | 'Bowlers' | 'All Rounders';
  image_url: string;
  season_average: number;
  vs_opponent_average: number;
  venue_average: number;
  last_five_scores: number[];
  created_at: string;
  updated_at: string;
}

// Add other table interfaces as needed
export interface MatchData {
  id: number;
  match_id: string;
  venue: string;
  team1: string;
  team2: string;
  date: string;
  // Add other fields
}

export interface PlayerStats {
  id: number;
  player_id: number;
  match_id: string;
  runs: number;
  wickets: number;
  // Add other fields
}

export interface BatterFormThisSeason {
  player_name: string;
  image_url: string;
  role: string;
  season_avg: number;
  count_30_plus: number;
  count_50_plus: number;
  last_5_scores: number;
}

// Add to existing helper functions
export const batterApi = {
  getThisSeasonForm: async (): Promise<BatterFormThisSeason[]> => {
    const { data, error } = await supabase
      .from('batter_form_this_season')
      .select('*')
      .order('season_avg', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('player_information')
      .select('count(*)', { count: 'exact' });

    if (error) throw error;
    console.log('Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return false;
  }
}

export default supabase; 