const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const stickerRouter = require('./routes/stickers'); 

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use(stickerRouter); 

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});