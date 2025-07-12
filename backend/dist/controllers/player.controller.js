"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const player_service_1 = require("../services/player.service");
class PlayerController {
    constructor() {
        this.getPlayers = async (req, res) => {
            try {
                const category = req.query.category;
                const filter = req.query.filter;
                const limit = req.query.limit ? parseInt(req.query.limit) : 3;
                if (!category || !filter) {
                    res.status(400).json({
                        error: 'Missing required parameters: category and filter are required'
                    });
                    return;
                }
                const players = await this.playerService.getPlayersByCategory({
                    category,
                    filter,
                    limit
                });
                res.json(players);
            }
            catch (error) {
                console.error('Error fetching players:', error);
                res.status(500).json({
                    error: 'Internal server error'
                });
            }
        };
        this.getBatsmenSeasonForm = async (req, res) => {
            try {
                const data = await this.playerService.getBatsmenSeasonForm();
                res.json(data);
            }
            catch (error) {
                console.error('Error fetching batsmen season form:', error);
                res.status(500).json({
                    error: 'Internal server error'
                });
            }
        };
        this.getBowlersSeasonForm = async (req, res) => {
            try {
                const data = await this.playerService.getBowlersSeasonForm();
                res.json(data);
            }
            catch (error) {
                console.error('Error fetching bowlers season form:', error);
                res.status(500).json({
                    error: 'Internal server error'
                });
            }
        };
        this.playerService = new player_service_1.PlayerService();
    }
}
exports.PlayerController = PlayerController;
