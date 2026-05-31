import { Router } from "express";
const router = Router();
import { prisma } from "../db.js";
import { auth } from "../auth.js";
import { filter } from "../utils/wordFilter.js";
import { analyzePostcard } from "../utils/postcardAnalyzer.js";
import crypto from "node:crypto";
import LanguageDetect from "languagedetect";
import { sendPostcardNotification } from "../mail/sendMail.js";
const lngDetector = new LanguageDetect();

// Quest IDs that allow shorter messages
const SHORT_QUEST_IDS = [8, 10, 14, 16, 20, 24, 30, 36, 49, 59, 62, 68];

router.post("/api/postcards", async (req, res) => {
  try {
    const { questId, image, text, greeting, location, receiverAddress } =
      req.body;

    if (typeof image !== "string" || image.length === 0) {
      return res.status(400).json({ ok: false, error: "no_image" });
    }

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const creatorId = session.user.id;
    const numericQuestId = questId ? Number(questId) : null;

    // Set dynamic minimum text length based on the specific quest type
    const isShortQuest = SHORT_QUEST_IDS.includes(numericQuestId);
    const minLength = isShortQuest ? 10 : 99;

    if (
      typeof greeting !== "string" ||
      greeting.trim().length < 2 ||
      greeting.length > 50
    ) {
      return res.status(400).json({
        error:
          "Invalid greeting! Greeting must be between 2 and 50 characters.",
      });
    }

    if (filter.isProfane(greeting)) {
      return res.status(400).json({
        error:
          "Inappropriate content detected in your greeting! Please keep it polite.",
      });
    }

    if (
      typeof text !== "string" ||
      text.trim().length < minLength ||
      text.length > 1000
    ) {
      return res.status(400).json({
        error: `Invalid text! Text must be between ${minLength} and 1000 characters.`,
      });
    }

    // Detect language of the postcard text
    const scores = lngDetector.detect(text, 2);
    const bestMatch = scores[0] ? scores[0][0] : null;

    let isEnglish = bestMatch === "english";

    // Fallback for short texts where automated language detection often fails
    if (!isEnglish && isShortQuest) {
      const commonEnglishWords = [
        "i",
        "my",
        "is",
        "am",
        "and",
        "like",
        "hello",
        "hi",
        "cats",
        "dog",
        "the",
        "you",
        "to",
        "I",
        "You",
      ];

      const wordsInText = text
        .toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        .split(/\s+/);

      const englishWordCount = wordsInText.filter((word) =>
        commonEnglishWords.includes(word),
      ).length;

      // Force english to true if at least two basic english words are found
      if (englishWordCount >= 2) {
        isEnglish = true;
      }
    }

    if (!isEnglish) {
      return res.status(400).json({
        error:
          "Language validation failed! Your message must be written in English.",
      });
    }

    if (filter.isProfane(text)) {
      return res.status(400).json({
        error:
          "Inappropriate content detected! Please keep your message polite.",
      });
    }

    if (
      typeof location !== "string" ||
      location.trim().length === 0 ||
      location.length > 100
    ) {
      return res.status(400).json({
        error:
          "Invalid location! Location must be a string up to 100 characters.",
      });
    }

    if (typeof image !== "string" || image.length === 0) {
      return res.status(400).json({ error: "Invalid image data!" });
    }

    if (!receiverAddress || typeof receiverAddress !== "object") {
      return res.status(400).json({ error: "Invalid receiver address!" });
    }

    let maxTotalXP = 30;
    let questTitle = "Standard submission";

    if (numericQuestId) {
      if (isNaN(numericQuestId)) {
        return res.status(400).json({ error: "Quest ID must be a number!" });
      }

      const validQuest = await prisma.quest.findUnique({
        where: { id: numericQuestId },
      });

      if (!validQuest) {
        return res.status(400).json({ error: "Invalid quest ID!" });
      }

      maxTotalXP = validQuest.xp;
      questTitle = validQuest.title;
    }

    const analysis = analyzePostcard(
      text,
      numericQuestId,
      maxTotalXP,
      questTitle,
    );
    const calculatedXP = analysis.xpCalculation.totalXP;

    // Verify if the image was successfully checked by the sightengine
    const hash = crypto.createHash("sha256").update(image).digest("hex");

    const moderated = await prisma.moderatedImage.findUnique({
      where: { hash },
    });

    if (!moderated || moderated.userId !== creatorId) {
      return res.status(403).json({
        error: "Image has not been verified yet. Please go back and try again.",
      });
    }

    // Select a random user to receive the message (excluding the creator)
    const userCount = await prisma.user.count({
      where: {
        NOT: { id: creatorId },
      },
    });

    let receiverId = null;
    let receiverEmail = null;
    let receiverName = null;

    if (userCount > 0) {
      const randomIndex = Math.floor(Math.random() * userCount);
      const randomUser = await prisma.user.findMany({
        where: {
          NOT: { id: creatorId },
        },
        skip: randomIndex,
        take: 1,
        select: { id: true, name: true, email: true },
      });

      if (randomUser.length > 0) {
        receiverId = randomUser[0].id;
        receiverEmail = randomUser[0].email;
        receiverName = randomUser[0].name;
      }
    }

    // Run as transaction to guarantee data consistency across tables
    const result = await prisma.$transaction(async (tx) => {
      const postcard = await tx.postcard.create({
        data: {
          questId: numericQuestId,
          image: image,
          greeting: greeting,
          text: text.trim(),
          location: location.trim(),
          receiverAddress: receiverAddress,
          xp: calculatedXP,
          creatorId: creatorId,
          receiverId: receiverId,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: creatorId },
        data: {
          xp: {
            increment: calculatedXP,
          },
        },
        select: { id: true, name: true, xp: true },
      });

      // Delete image from moderation table
      await tx.moderatedImage.delete({ where: { hash } });

      return { postcard, updatedUser };
    });

    res.status(201).json({
      success: true,
      message: "Postcard successfully sent and XP granted!",
      postcard: result.postcard,
      userXp: result.updatedUser.xp,
      analysis: analysis,
    });

    // Notifies the Receiver of the Postcard per email(only the postcard is sent)
    if (receiverEmail && receiverName) {
      sendPostcardNotification(
        receiverEmail,
        receiverId,
        receiverName,
      );
    }
  } catch (error) {
    console.error("Error saving postcard to DB:", error);
    res.status(500).json({ error: "Error saving the postcard" });
  }
});

export default router;
