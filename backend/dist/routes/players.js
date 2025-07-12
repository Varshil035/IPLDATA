"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_1 = require("../lib/supabase");
const router = express_1.default.Router();
router.get('/batsmen/season-form', async (req, res) => {
    try {
        const data = await supabase_1.batterApi.getThisSeasonForm();
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching batsmen form:', error);
        res.status(500).json({ error: 'Failed to fetch batsmen data' });
    }
});
exports.default = router;
