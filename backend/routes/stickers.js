import { Router } from "express";
const router = Router();
import { prisma } from "../db.js";
import { auth } from "../auth.js";

router.get("/api/stickers", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    let userXp = 0;

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { xp: true },
    });

    if (dbUser) {
      userXp = dbUser.xp;
    }

    const allStickers = await prisma.sticker.findMany({
      orderBy: { requiredXp: "asc" },
    });

    // check who actually unlocked what based on current XP
    const processedStickers = allStickers.map((sticker) => {
      const isLocked = userXp < sticker.requiredXp;

      return {
        id: sticker.id,
        name: sticker.name,
        stickerSrc: `./stickers/${sticker.fileName}`,
        xpAmount: sticker.requiredXp,
        isLocked: isLocked,
        // hide text and swap to lock icon if it's still locked
        description: isLocked ? "Locked" : sticker.description || sticker.name,
        iconSrc: isLocked ? "./icons/lock.svg" : "./icons/check.svg",
      };
    });

    res.json({
      userXp: userXp,
      stickers: processedStickers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error loading stickers" });
  }
});

export default router;
