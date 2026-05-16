const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/api/postcards', async (req, res) => {
  try {
    const { questId, image, text, location, receiverAddress } = req.body;

    if (typeof text !== 'string' || text.trim().length < 100 || text.length > 1000) {
      return res.status(400).json({ 
        error: "Invalid text! Text must be between 100 and 1000 characters." 
      });
    }

    if (typeof location !== 'string' || location.trim().length === 0 || location.length > 100) {
      return res.status(400).json({ 
        error: "Invalid location! Location must be a string up to 100 characters." 
      });
    }

    if (typeof image !== 'string' || image.length === 0) {
      return res.status(400).json({ error: "Invalid image data!" });
    }

    if (!receiverAddress || typeof receiverAddress !== 'object') {
      return res.status(400).json({ error: "Invalid receiver address!" });
    }

    if (questId) {
      const numericQuestId = Number(questId);
      if (isNaN(numericQuestId)) {
        return res.status(400).json({ error: "Quest ID must be a number!" });
      }

      const validQuest = await prisma.quest.findUnique({
        where: { id: numericQuestId }
      });
      
      if (!validQuest) {
        return res.status(400).json({ error: "Invalid quest ID!" });
      }
    }

    const newPostcard = await prisma.postcard.create({
      data: {
        questId: questId ? Number(questId) : null,
        // userId: userId ? Number(userId) : null,
        image: image,
        text: text.trim(),
        location: location.trim(),
        receiverAddress: receiverAddress
      }
    });

    res.status(201).json({ 
      success: true, 
      message: "Postcard successfully saved in the database!",
      postcard: newPostcard 
    });

  } catch (error) {
    console.error("Error saving postcard to DB:", error);
    res.status(500).json({ error: "Error saving the postcard" });
  }
});

module.exports = router;