const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/api/stickers', async (req, res) => {
  try {
    const userXp = 1500; 

    const allStickers = await prisma.sticker.findMany({
      orderBy: { requiredXp: 'asc' } 
    });

    const processedStickers = allStickers.map(sticker => {
      const isLocked = userXp < sticker.requiredXp;

      return {
        id: sticker.id,
        name: sticker.name,
        stickerSrc: `./stickers/${sticker.fileName}`, 
        xpAmount: sticker.requiredXp,
        isLocked: isLocked,
        description: isLocked ? "Locked" : (sticker.description || sticker.name),
        iconSrc: isLocked ? "./icons/lock.svg" : "./icons/check.svg"
      };
    });

    res.json({
      userXp: userXp,
      stickers: processedStickers
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading stickers' });
  }
});

module.exports = router;