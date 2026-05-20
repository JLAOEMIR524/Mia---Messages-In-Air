import { Router } from "express";
const router = Router();
import { prisma } from "../db.js"; 
import { auth } from "../auth.js"; 

router.get("/api/quests", async (req, res) => {
  try {
    const allQuests = await prisma.quest.findMany({
      orderBy: { id: "asc" },
    });
    res.json({ quests: allQuests });
  } catch (error) {
    console.error("Error loading quests from DB:", error);
    res.status(500).json({ error: "Error loading quests" });
  }
});

router.get("/api/user/quests", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const userEmail = session.user.email;

    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!dbUser) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const userId = dbUser.id;

    // get postcards created by the user that are linked to a specific quest
    const completedPostcards = await prisma.postcard.findMany({
      where: {
        creatorId: userId,
        NOT: {
          questId: null,
        },
      },
      include: {
        quest: true,
      },
      orderBy: { 
        createdAt: "asc" 
      },
    });

    // Map postcard data into a quest list format for frontend
    const formattedQuests = completedPostcards.map((postcard) => ({
      id: postcard.id,
      title: postcard.quest?.title || "Unbekannte Quest",
      description: postcard.quest?.description || "",
      earnedXp: postcard.xp, 
    }));

    res.json({
      quests: formattedQuests,
    });
  } catch (error) {
    console.error("Error loading user quests from DB:", error);
    res.status(500).json({ error: "Error loading user quests" });
  }
});

export default router;