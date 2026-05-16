import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client';
import { prisma } from "../db.js";

router.get('/api/quests', async (req, res) => {
  try {
    const allQuests = await prisma.quest.findMany({
      orderBy: { id: 'asc' }
    });

    res.json({
      quests: allQuests
    });
  } catch (error) {
    console.error("Error loading quests from DB:", error);
    res.status(500).json({ error: 'Error loading quests' });
  }
});

export default router;