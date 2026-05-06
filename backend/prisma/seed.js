const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

async function main() {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../adress.json"), "utf8"),
  );

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
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
