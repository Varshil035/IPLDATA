import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with anon key for limited access
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true
    }
  }
);

// Player information type
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
}

// Helper functions for frontend data access
export const playerApi = {
  // Get player information with filters
  getPlayers: async (
    category: PlayerInformation['category'],
    sortBy: 'season_average' | 'vs_opponent_average' | 'venue_average' = 'season_average',
    limit: number = 3
  ) => {
    const { data, error } = await supabase
      .from('player_information')
      .select('*')
      .eq('category', category)
      .order(sortBy, { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as PlayerInformation[];
  },

  // Get player image URL from storage
  getPlayerImageUrl: (imagePath: string) => {
    const { data } = supabase
      .storage
      .from('player-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  }
}; 