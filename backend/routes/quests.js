const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

module.exports = router;