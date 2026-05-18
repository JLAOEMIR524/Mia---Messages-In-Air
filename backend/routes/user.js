import { Router } from "express";
import { prisma } from "../db.js";
import { auth } from "../auth.js"; 
const router = Router();

router.get("/api/user/stats", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, name: true }
    });

    const sentPostcardsCount = await prisma.postcard.count({
      where: { creatorId: userId }
    });

    const receivedPostcardsCount = await prisma.postcard.count({
      where: { receiverId: userId }
    });

    res.status(200).json({
      success: true,
      name: user?.name || "Guest",
      xp: user?.xp || 0,
      sentCount: sentPostcardsCount,
      receivedCount: receivedPostcardsCount
    });

  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;