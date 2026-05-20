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
import updateUserRouter from "./routes/updateUser.js";
import userPostcardRouter from "./routes/userPostcard.js"; 
import { unsubscribeMail } from "./mail/unsubscribeMail.js";
import moderationRoutes from "./routes/moderation.js";

const app = express();
const PORT = 3001;
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/api/security", securityRouter);
app.use("/api", moderationRoutes);
app.use(stickersRouter);
app.use(questsRouter);
app.use(postcardsRouter);
app.use(addressesRouter);
app.use(locationsRouter);
app.use(userRouter);
app.use(updateUserRouter);
app.use("/api/user", userPostcardRouter);

//Mail Unsubscribe routes
app.get("/unsubscribe", (req, res) => {
  const token = req.query.token;
  unsubscribeMail(token);
  res.redirect(frontendUrl)
});

app.post("/unsubscribe", (req, res) => {
  const token = req.query.token;
  unsubscribeMail(token);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://api.mia.jlaoemir with port ${PORT}`);
});
