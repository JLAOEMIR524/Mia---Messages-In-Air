import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client';
import { prisma } from "../db.js";
import { auth } from "../auth.js";

router.get('/api/stickers', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers 
    });

    let userXp = 0;

    if (session && session.user) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { xp: true }
      });

      if (dbUser) {
        userXp = dbUser.xp;
      }
    }

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

export default router;