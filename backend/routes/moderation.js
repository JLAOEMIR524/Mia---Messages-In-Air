import { Router } from "express";
import axios from "axios";
import multer from "multer";
import { prisma } from "../db.js";
import crypto from "node:crypto";
import FormData from "form-data";
import { auth } from "../auth.js";

// Maximum allowed probability (0.0 to 1.0) for each category before it gets blocked
const THRESHOLDS = {
  nudity: 0.5,
  weapon: 0.5,
  drugs: 0.5,
  medical: 0.7,
  offensive: 0.5,
  gore: 0.4,
  tobacco: 0.6,
  violence: 0.5,
  selfHarm: 0.4,
};

const router = Router();
const isTesting = process.env.TEST;

// temporarily sets the data on the server memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

// check if the API values exceed our allowed limits
function evaluate(data) {
  const violations = [];

  if (1 - data.nudity.none > THRESHOLDS.nudity) violations.push("nudity");
  const weaponMax = Math.max(...Object.values(data.weapon.classes));
  if (weaponMax > THRESHOLDS.weapon) violations.push("weapon");

  if (data.recreational_drug.prob > THRESHOLDS.drugs) violations.push("drugs");
  if (data.medical.prob > THRESHOLDS.medical) violations.push("medical");

  const offensiveMax = Math.max(...Object.values(data.offensive));
  if (offensiveMax > THRESHOLDS.offensive) violations.push("offensive");

  if (data.gore.prob > THRESHOLDS.gore) violations.push("gore");
  if (data.tobacco.prob > THRESHOLDS.tobacco) violations.push("tobacco");
  if (data.violence.prob > THRESHOLDS.violence) violations.push("violence");
  if (data["self-harm"].prob > THRESHOLDS.selfHarm)
    violations.push("self-harm");

  return violations;
}

router.post("/moderate", upload.single("image"), async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const { image } = req.body;

    if (typeof image !== "string" || image.length === 0) {
      return res.status(400).json({ ok: false, error: "no_image" });
    }

    // Convert Base64 string into a binary Buffer so we can send it as a file
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Skip the external API call during automated tests to save credits
    if (isTesting === "false") {
      const form = new FormData();
      form.append("media", imageBuffer, {
        filename: "postcard.jpeg",
        contentType: "image/jpeg",
      });
      form.append(
        "models",
        "nudity-2.1,weapon,recreational_drug,medical,offensive-2.0,gore-2.0,tobacco,violence,self-harm",
      );
      form.append("api_user", process.env.SIGHTENGINE_API_USER);
      form.append("api_secret", process.env.SIGHTENGINE_API_SECRET);

      const { data } = await axios.post(
        "https://api.sightengine.com/1.0/check.json",
        form,
        { headers: form.getHeaders(), timeout: 15_000 },
      );

      if (data.status !== "success") {
        return res.status(502).json({ ok: false, error: "sightengine_failed" });
      }

      //Evaluate response
      const violations = evaluate(data);

      if (violations.length > 0) {
        return res.json({ ok: false, reason: "content_violation", violations });
      }
    }

    // Create a unique SHA256 hash of the image to save and recognize it later
    const hash = crypto.createHash("sha256").update(image).digest("hex");

    await prisma.moderatedImage.upsert({
      where: { hash },
      update: { createdAt: new Date(), userId: session.user.id },
      create: { hash, userId: session.user.id },
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("moderation error", err);
    return res.status(500).json({ ok: false, error: "internal" });
  }
});

export default router;
