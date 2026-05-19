import { Router } from "express";
const router = Router();
import { PrismaClient } from "@prisma/client";
import { prisma } from "../db.js";
import { auth } from "../auth.js";

router.get("/api/locations", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const { q } = req.query;

    if (!q || q.trim().length < 1) {
      return res.json([]);
    }

    const [dbCities, dbCountries] = await Promise.all([
      prisma.city.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        take: 5,
        select: { name: true },
      }),
      prisma.country.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        take: 5,
        select: { name: true },
      }),
    ]);

    const cities = dbCities.map((c) => ({ name: c.name, type: "City" }));
    const countries = dbCountries.map((c) => ({
      name: c.name,
      type: "Country",
    }));

    const combinedResults = [...cities, ...countries].slice(0, 8);

    res.json(combinedResults);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
