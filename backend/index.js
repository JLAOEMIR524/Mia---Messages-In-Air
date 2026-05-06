const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors()); // Erlaubt deinem Vite-Frontend den Zugriff
app.use(express.json()); // Erlaubt Express, JSON-Daten zu lesen


app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});