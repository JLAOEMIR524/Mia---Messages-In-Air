import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import questsRouter from "./routes/quests.js";
import postcardsRouter from "./routes/postcards.js";
import addressesRouter from "./routes/addresses.js";
import locationsRouter from "./routes/locations.js";
import stickersRouter from "./routes/stickers.js";
import securityRouter from "./routes/security.js";
import userRouter from "./routes/user.js";
import userPostcardRouter from "./routes/userPostcard.js"; 
import { unsubscribeMail } from "./mail/unsubscribeMail.js";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/api/security", securityRouter);
app.use(stickersRouter);
app.use(questsRouter);
app.use(postcardsRouter);
app.use(addressesRouter);
app.use(locationsRouter);
app.use(userRouter);
app.use("/api/user", userPostcardRouter);

//Mail Unsubscribe routes
app.get("/unsubscribe", (req, res) => {
  const token = req.query.token;
  unsubscribeMail(token);
  res.sendStatus(200);
});

app.post("/unsubscribe", (req, res) => {
  const token = req.query.token;
  unsubscribeMail(token);
  res.redirect("/login")
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
