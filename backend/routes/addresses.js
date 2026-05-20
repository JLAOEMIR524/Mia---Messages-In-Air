import express from "express";
import { prisma } from "../db.js";
const router = express.Router();
import { auth } from "../auth.js";

router.get("/api/addresses/random", async (req, res) => {
  try {
    // Authenticate user via session headers
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const count = await prisma.address.count();

    if (count === 0) {
      return res
        .status(404)
        .json({
          error: "There are no recipient addresses in the database.",
        });
    }

    // Get a random record by skipping a random number of rows
    const randomIndex = Math.floor(Math.random() * count);

    const randomAddress = await prisma.address.findFirst({
      skip: randomIndex,
    });

    res.json(randomAddress);
  } catch (error) {
    console.error("Error fetching random address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
