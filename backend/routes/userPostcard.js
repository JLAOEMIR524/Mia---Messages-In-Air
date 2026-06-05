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

    // get all cards where the user is sender or the receiver
    const postcards = await prisma.postcard.findMany({
      where: {
        OR: [{ creatorId: userId }, { receiverId: userId }],
      },
      select: {
        id: true,
        createdAt: true,
        image: true,
        location: true,
        questId: true,
        greeting: true,
        text: true,
        xp: true,
        creatorId: true,
      },
      orderBy: { id: "desc" },
    });

    // extract unique locations
    const locationNames = [...new Set(postcards.map((p) => p.location))];

    // look up coordinates for all unique cities and countries at the same time
    const [citiesFromDb, countriesFromDb] = await Promise.all([
      prisma.city.findMany({
        where: { name: { in: locationNames, mode: "insensitive" } }, // case-insensitive search (matches 'Berlin' even if typed 'berlin')
        include: { country: true },
      }),
      prisma.country.findMany({
        where: { name: { in: locationNames, mode: "insensitive" } },
      }),
    ]);

    // attach coordinates and normalized country names to each postcard
    const postcardsWithCoordinates = postcards.map((postcard) => {
      const { creatorId, ...safeFields } = postcard;

      const searchName = postcard.location.toLowerCase();

      const cityDetails = citiesFromDb.find(
        (c) => c.name.toLowerCase() === searchName,
      );

      const countryDetails = countriesFromDb.find(
        (c) => c.name.toLowerCase() === searchName,
      );

      let dynamicCountryName = null;
      if (cityDetails && cityDetails.country) {
        dynamicCountryName = cityDetails.country.name;
      } else if (countryDetails) {
        dynamicCountryName = countryDetails.name;
      } else {
        dynamicCountryName = postcard.location;
      }

      return {
        ...safeFields,
        sentByMe: creatorId === userId,
        countryName: dynamicCountryName,
        latitude: cityDetails?.latitude ?? countryDetails?.latitude ?? null,
        longitude: cityDetails?.longitude ?? countryDetails?.longitude ?? null,
      };
    });

    res.json({ postcards: postcardsWithCoordinates });
  } catch (error) {
    console.error("Error retrieving user postcards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
