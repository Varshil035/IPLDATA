"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const player_controller_1 = require("../controllers/player.controller");
const router = (0, express_1.Router)();
const playerController = new player_controller_1.PlayerController();
// GET /api/players?category=Batsmen&filter=This%20Season&limit=3
router.get('/', playerController.getPlayers);
// GET /api/players/batsmen/season-form
router.get('/batsmen/season-form', playerController.getBatsmenSeasonForm);
// GET /api/players/bowlers/season-form
router.get('/bowlers/season-form', playerController.getBowlersSeasonForm);
// Test endpoint to verify database connection
router.get('/test', (req, res) => {
    res.json({
        status: 'success',
        message: 'API endpoint is working',
        env: {
            supabaseUrl: process.env.SUPABASE_URL ? 'configured' : 'missing',
            supabaseKey: process.env.SUPABASE_SERVICE_KEY ? 'configured' : 'missing'
        }
    });
});
exports.default = router;
