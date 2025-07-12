import { Request, Response } from 'express';
import { PlayerService } from '../services/player.service';
import { PlayerCategory, FilterType } from '../types/player.types';

export class PlayerController {
  private playerService: PlayerService;

  constructor() {
    this.playerService = new PlayerService();
  }

  getPlayers = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = req.query.category as PlayerCategory;
      const filter = req.query.filter as FilterType;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;

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
    } catch (error) {
      console.error('Error fetching players:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  };

  getBatsmenSeasonForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const gameId = req.query.gameId as string;
      const data = await this.playerService.getBatsmenSeasonForm(gameId);
      res.json(data);
    } catch (error) {
      console.error('Error fetching batsmen season form:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  };

  getBatsmenVenueForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const gameId = req.query.gameId as string;
      const data = await this.playerService.getBatsmenVenueForm(gameId);
      res.json(data);
    } catch (error) {
      console.error('Error in getBatsmenVenueForm:', error);
      res.status(500).json({ error: 'Failed to fetch batsmen venue form data' });
    }
  };

  getBatsmenOpponentForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const gameId = req.query.gameId as string;
      const data = await this.playerService.getBatsmenOpponentForm(gameId);
      res.json(data);
    } catch (error) {
      console.error('Error in getBatsmenOpponentForm:', error);
      res.status(500).json({ error: 'Failed to fetch batsmen opponent form data' });
    }
  };

  getBowlersSeasonForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const gameId = req.query.gameId as string;
      const data = await this.playerService.getBowlersSeasonForm(gameId);
      res.json(data);
    } catch (error) {
      console.error('Error fetching bowlers season form:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  };

  getAllRoundersSeasonForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const gameId = req.query.gameId as string;
      const allrounders = await this.playerService.getAllRoundersSeasonForm(gameId);
      res.json(allrounders);
    } catch (error) {
      console.error('Error fetching allrounders season form:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  };

  getVisibleContests = async (req: Request, res: Response): Promise<void> => {
    try {
      const contests = await this.playerService.getVisibleContests();
      res.json(contests);
    } catch (error) {
      console.error('Error fetching visible contests:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  };

  getBowlersVenueForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gameId } = req.query;
      const data = await this.playerService.getBowlersVenueForm(gameId as string);
      res.json(data);
    } catch (error) {
      console.error('Error in getBowlersVenueForm:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getBowlersOpponentForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gameId } = req.query;
      const data = await this.playerService.getBowlersOpponentForm(gameId as string);
      res.json(data);
    } catch (error) {
      console.error('Error in getBowlersOpponentForm:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getAllRoundersVenueForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const gameId = req.query.gameId as string;
      const data = await this.playerService.getAllRoundersVenueForm(gameId);
      res.json(data);
    } catch (error) {
      console.error('Error in getAllRoundersVenueForm:', error);
      res.status(500).json({ error: 'Failed to fetch all-rounders venue form data' });
    }
  };

  getAllRoundersOpponentForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const gameId = req.query.gameId as string;
      const data = await this.playerService.getAllRoundersOpponentForm(gameId);
      res.json(data);
    } catch (error) {
      console.error('Error in getAllRoundersOpponentForm:', error);
      res.status(500).json({ error: 'Failed to fetch all-rounders opponent form data' });
    }
  };
} 