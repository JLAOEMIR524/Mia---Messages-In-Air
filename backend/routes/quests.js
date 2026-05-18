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
    // 1. Session auslesen
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const userEmail = session.user.email;

    // 2. Den User aus der DB holen
    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!dbUser) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const userId = dbUser.id;

    // 3. Fehlerbehebung in der Abfrage:
    // Wenn die Liste leer bleibt, hat der User in der DB noch keine Postkarte erstellt,
    // die mit einer Quest verknüpft ist. 
    // Zum Testen, ob die Verbindung klappt, kannst du das 'where' testweise auskommentieren.
    const userQuests = await prisma.quest.findMany({
      where: {
        postcards: {
          some: {
            creatorId: userId,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    res.json({
      quests: userQuests,
    });
  } catch (error) {
    console.error("Error loading user quests from DB:", error);
    res.status(500).json({ error: "Error loading user quests" });
  }
});

export default router;