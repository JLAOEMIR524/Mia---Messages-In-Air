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

    const postcards = await prisma.postcard.findMany({
      where: {
        OR: [{ creatorId: userId }, { receiverId: userId }],
      },
      include: {
        creator: {
          select: { firstName: true, lastName: true },
        },
        receiver: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { id: "desc" },
    });

    const locationNames = [...new Set(postcards.map((p) => p.location))];

    const [citiesFromDb, countriesFromDb] = await Promise.all([
      prisma.city.findMany({
        where: { name: { in: locationNames, mode: "insensitive" } },
      }),
      prisma.country.findMany({
        where: { name: { in: locationNames, mode: "insensitive" } },
      }),
    ]);

    const postcardsWithCoordinates = postcards.map((postcard) => {
      const searchName = postcard.location.toLowerCase();

      const cityDetails = citiesFromDb.find(
        (c) => c.name.toLowerCase() === searchName,
      );

      const countryDetails = countriesFromDb.find(
        (c) => c.name.toLowerCase() === searchName,
      );

      return {
        ...postcard,
        latitude: cityDetails
          ? cityDetails.latitude
          : countryDetails
            ? countryDetails.latitude
            : null,
        longitude: cityDetails
          ? cityDetails.longitude
          : countryDetails
            ? countryDetails.longitude
            : null,
      };
    });

    res.json({ postcards: postcardsWithCoordinates });
  } catch (error) {
    console.error("Error retrieving user postcards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;