"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
class PlayerService {
    constructor() {
        console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
        console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY);
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
            throw new Error('Missing required environment variables: SUPABASE_URL and/or SUPABASE_SERVICE_KEY');
        }
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
        // Debug: Check if we can connect to the database and get table info
        this.debugCheckDatabase();
    }
    async debugCheckDatabase() {
        try {
            console.log('Checking database connection...');
            // Check batsmen table
            console.log('Checking batter_form_this_season table...');
            const { data: batsmenData, error: batsmenError } = await this.supabase
                .from('batter_form_this_season')
                .select('*')
                .limit(1);
            if (batsmenError) {
                console.error('Error fetching from batter_form_this_season:', batsmenError);
            }
            else {
                console.log('batter_form_this_season sample data:', batsmenData);
            }
            // Check bowlers table
            console.log('Checking bowler_form_summary table...');
            const { data: bowlersData, error: bowlersError } = await this.supabase
                .from('bowler_form_summary')
                .select('*')
                .limit(1);
            if (bowlersError) {
                console.error('Error fetching from bowler_form_summary:', bowlersError);
            }
            else {
                console.log('bowler_form_summary sample data:', bowlersData);
            }
        }
        catch (error) {
            console.error('Database check error:', error);
        }
    }
    async getBatsmenSeasonForm() {
        try {
            console.log('Fetching batsmen season form data');
            const { data, error } = await this.supabase
                .from('batter_form_this_season')
                .select('*')
                .order('season_avg', { ascending: false });
            if (error) {
                console.error('Supabase query error:', error);
                throw error;
            }
            console.log('Raw data from database:', data);
            if (!data || data.length === 0) {
                console.log('No data found in batter_form_this_season');
                return [];
            }
            return data;
        }
        catch (error) {
            console.error('Error in getBatsmenSeasonForm:', error);
            throw error;
        }
    }
    async getBowlersSeasonForm() {
        try {
            console.log('Fetching bowlers season form data');
            const { data, error } = await this.supabase
                .from('bowler_form_summary')
                .select('*')
                .order('season_economy', { ascending: true }); // Lower economy is better for bowlers
            if (error) {
                console.error('Supabase query error:', error);
                if (error.code === 'PGRST116') {
                    console.error('Table bowler_form_summary does not exist');
                    // For now, return empty array until table is created
                    return [];
                }
                throw error;
            }
            console.log('Raw data from database:', data);
            if (!data || data.length === 0) {
                console.log('No data found in bowler_form_summary');
                return [];
            }
            return data;
        }
        catch (error) {
            console.error('Error in getBowlersSeasonForm:', error);
            throw error;
        }
    }
    async getPlayersByCategory({ category, filter, limit = 3 }) {
        try {
            console.log('Fetching players with params:', { category, filter, limit });
            let query = this.supabase
                .from('batter_form_this_season')
                .select('*');
            // For now, we're only handling batsmen data
            if (category !== 'Batsmen') {
                console.log('Only Batsmen category is currently supported');
                return [];
            }
            // For this season's form, we'll order by season_avg
            query = query.order('season_avg', { ascending: false });
            console.log('Executing query with limit:', limit);
            const { data, error } = await query.limit(limit);
            if (error) {
                console.error('Supabase query error:', error);
                throw error;
            }
            console.log('Raw data from database:', data);
            if (!data || data.length === 0) {
                console.log('No data found for the given criteria');
                return [];
            }
            return data;
        }
        catch (error) {
            console.error('Error in getPlayersByCategory:', error);
            throw error;
        }
    }
}
exports.PlayerService = PlayerService;
