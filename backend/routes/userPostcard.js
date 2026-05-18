import express from "express";
import { prisma } from "../db.js";
import { auth } from "../auth.js";
const router = express.Router();

router.get("/postcards", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Not authorized. Please log in" });
    }

    const userId = session.user.id;

    const userPostcards = await prisma.postcard.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        receiver: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json({ postcards: userPostcards });

  } catch (error) {
    console.error("Error retrieving user postcards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;