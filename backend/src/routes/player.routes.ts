import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller';
import { Request, Response } from 'express';

const router = Router();
const playerController = new PlayerController();

// GET /api/players?category=Batsmen&filter=This%20Season&limit=3
router.get('/', playerController.getPlayers);

// GET /api/players/batsmen/season-form
router.get('/batsmen/season-form', playerController.getBatsmenSeasonForm);

// GET /api/players/batsmen/venue-form
router.get('/batsmen/venue-form', playerController.getBatsmenVenueForm);

// GET /api/players/batsmen/opponent-form
router.get('/batsmen/opponent-form', playerController.getBatsmenOpponentForm);

// GET /api/players/bowlers/season-form
router.get('/bowlers/season-form', playerController.getBowlersSeasonForm);

// GET /api/players/bowlers/venue-form
router.get('/bowlers/venue-form', playerController.getBowlersVenueForm);

// GET /api/players/bowlers/opponent-form
router.get('/bowlers/opponent-form', playerController.getBowlersOpponentForm);

// GET /api/players/allrounders/season-form
router.get('/allrounders/season-form', playerController.getAllRoundersSeasonForm);

// GET /api/players/allrounders/venue-form
router.get('/allrounders/venue-form', playerController.getAllRoundersVenueForm);

// GET /api/players/allrounders/opponent-form
router.get('/allrounders/opponent-form', playerController.getAllRoundersOpponentForm);

// Test endpoint to verify database connection
router.get('/test', (req: Request, res: Response) => {
  res.json({ 
    status: 'success',
    message: 'API endpoint is working',
    env: {
      supabaseUrl: process.env.SUPABASE_URL ? 'configured' : 'missing',
      supabaseKey: process.env.SUPABASE_SERVICE_KEY ? 'configured' : 'missing'
    }
  });
});

router.get('/games/visible', playerController.getVisibleContests);

export default router; 