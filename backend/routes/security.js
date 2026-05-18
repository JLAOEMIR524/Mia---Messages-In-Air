import express, { Router } from "express";
import crypto from "crypto";
import { sendNotification } from "../mail/sendMail.js";

const router = express.Router();

router.post("/check-password", async (req, res) => {
  const { password } = req.body;

  const hash = crypto
    .createHash("sha1")
    .update(password)
    .digest("hex")
    .toUpperCase();

  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const request = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`
  );
  const response = await request.text();

  const isPwned = response
  .split("\n")
  .some((line) => line.split(":")[0].trim() === suffix);

  res.json({isPwned});
});

export default router;