"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batterApi = exports.supabase = void 0;
exports.checkDatabaseConnection = checkDatabaseConnection;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase environment variables');
}
// Create Supabase client with service key for full database access
exports.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: false
    },
    db: {
        schema: 'public'
    }
});
// Add to existing helper functions
exports.batterApi = {
    getThisSeasonForm: async () => {
        const { data, error } = await exports.supabase
            .from('batter_form_this_season')
            .select('*')
            .order('season_avg', { ascending: false });
        if (error)
            throw error;
        return data;
    }
};
// Helper function to check database connection
async function checkDatabaseConnection() {
    try {
        const { data, error } = await exports.supabase
            .from('player_information')
            .select('count(*)', { count: 'exact' });
        if (error)
            throw error;
        console.log('Successfully connected to Supabase');
        return true;
    }
    catch (error) {
        console.error('Failed to connect to Supabase:', error);
        return false;
    }
}
