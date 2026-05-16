const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

async function main() {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../adress.json"), "utf8"),
  );
  const data2 = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../cities.json"), "utf8"),
  );

  const stickersData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../stickers.json"), "utf8"),
  );

  const questsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../quests.json"), "utf8"),
  );

  console.log("Importiere Länder...");
  for (const c of data2.countries) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: {
        name: c.name,
        code: c.code,
        longitude: c.location.longitude,
        latitude: c.location.latitude,
      },
    });
  }

  console.log("Importiere Städte...");
  await prisma.city.deleteMany({});

  for (const city of data2.cities) {
    const countryExists = await prisma.country.findUnique({
      where: { code: city.country },
    });

    if (countryExists) {
      await prisma.city.create({
        data: {
          name: city.name,
          countryCode: city.country,
          longitude: city.location.longitude,
          latitude: city.location.latitude,
        },
      });
    } else {
      console.warn(
        `Überspringe Stadt ${city.name}: Land ${city.country} fehlt!`,
      );
    }
  }

  console.log("Importiere Adressen...");
  await prisma.address.deleteMany({});

  for (const item of data.adress) {
    await prisma.address.create({
      data: {
        id: item.id,
        name: item.name,
        street: item.street,
        zip: item.zip,
        city: item.city,
        country: item.country,
      },
    });
  }

  console.log("Importiere Sticker...");
  await prisma.sticker.deleteMany({});

  for (const s of stickersData.stickers) {
    await prisma.sticker.create({
      data: {
        name: s.name,
        fileName: s.fileName,
        requiredXp: s.requiredXp,
        description: s.description || null,
      },
    });
  }

  console.log("Importiere Quests...");
  await prisma.quest.deleteMany({});

  for (const q of questsData.quests) {
    await prisma.quest.create({
      data: {
        title: q.title,
        description: q.description,
        xp: q.xp,
      },
    });
  }

  console.log("Finished");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
