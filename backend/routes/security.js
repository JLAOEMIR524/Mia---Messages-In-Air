import express from "express";
import crypto from "crypto";

const router = express.Router();

router.post("/check-password", async (req, res) => {
  const { password } = req.body;

  // Have I Been Pwned API
  const hash = crypto
    .createHash("sha1")
    .update(password)
    .digest("hex")
    .toUpperCase();

  // Split hash: send only the first 5 chars to the API for anonymity
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  // Fetch all leaked hashes that match the 5-character prefix
  const request = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const response = await request.text();

  // Check if the remaining part of our hash exists in the API response
  const isPwned = response
    .split("\n")
    .some((line) => line.split(":")[0].trim() === suffix);

  res.json({ isPwned });
});

export default router;
