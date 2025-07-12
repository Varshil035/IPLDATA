import express from 'express';
import { batterApi } from '../lib/supabase';

const router = express.Router();

router.get('/batsmen/season-form', async (req, res) => {
  try {
    const data = await batterApi.getThisSeasonForm();
    res.json(data);
  } catch (error) {
    console.error('Error fetching batsmen form:', error);
    res.status(500).json({ error: 'Failed to fetch batsmen data' });
  }
});

export default router; 