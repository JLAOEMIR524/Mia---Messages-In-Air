import LanguageDetect from "languagedetect";
const lngDetector = new LanguageDetect();

export function analyzePostcard(text, questId, maxTotalXP, questTitle) {
  const trimmedText = text.trim();
  const words = trimmedText.split(/\s+/).filter((w) => w.length > 0);

  const SHORT_QUEST_IDS = [8, 10, 14, 16, 20, 24, 30, 36, 49, 59, 62, 68];

  // automatically give max length score if selected quest is a short-text quest
  let lengthRating = 1;
  if (SHORT_QUEST_IDS.includes(questId)) {
    lengthRating = 5;
  } else {
    if (trimmedText.length >= 300) lengthRating = 5;
    else if (trimmedText.length >= 200) lengthRating = 4;
    else if (trimmedText.length >= 100) lengthRating = 3;
    else if (trimmedText.length >= 40) lengthRating = 2;
    else lengthRating = 1;
  }

  let badWordsRating = 5;

  // check if sentences start with a capital letter
  let capitalizationRating = 5;
  const sentencesForCaps = trimmedText.split(/[.!?]+\s+/);
  let capsErrors = 0;

  sentencesForCaps.forEach((s) => {
    if (s.length > 0 && s[0] !== s[0].toUpperCase() && /[a-zA-Z]/.test(s[0])) {
      capsErrors++;
    }
  });

  // count lowercase i as a grammar error since it's English
  const smallIErrors = (trimmedText.match(/\bi\b/g) || []).length;
  capsErrors += smallIErrors;

  if (capsErrors > 3) capitalizationRating = 1;
  else if (capsErrors > 2) capitalizationRating = 2;
  else if (capsErrors > 1) capitalizationRating = 3;
  else if (capsErrors > 0) capitalizationRating = 4;

  // rate the text quality based on punctuation count and proper endings
  let punctuationRating = 1;
  const totalPunctuation = (trimmedText.match(/[.,!?]/g) || []).length;
  const endsWithPunctuation = /[.!?]$/.test(trimmedText);

  if (totalPunctuation >= 4 && endsWithPunctuation) punctuationRating = 5;
  else if (totalPunctuation >= 2 && endsWithPunctuation) punctuationRating = 4;
  else if (totalPunctuation >= 1 || endsWithPunctuation) punctuationRating = 2;
  else if (totalPunctuation === 0 && !endsWithPunctuation)
    punctuationRating = 0;

  let questDetails = [];
  const qId = questId;

  // handle specific logic and requirements for each quest
  switch (Number(qId)) {
    case 1: {
      const hasSun = /\bsun\b/i.test(trimmedText);
      const hasWindow = /\bwindow\b/i.test(trimmedText);
      const hasTrain = /\brain\b/i.test(trimmedText);

      questDetails = [
        { name: "Inclusion of the word 'sun'", score: hasSun ? 5 : 0 },
        { name: "Inclusion of the word 'window'", score: hasWindow ? 5 : 0 },
        { name: "Inclusion of the word 'rain'", score: hasTrain ? 5 : 0 },
      ];
      break;
    }
    case 2: {
      const hasTree = /\btree\b/i.test(trimmedText);
      const hasRiver = /\briver\b/i.test(trimmedText);
      const hasMountain = /\bmountain\b/i.test(trimmedText);

      questDetails = [
        { name: "Inclusion of the word 'tree'", score: hasTree ? 5 : 0 },
        { name: "Inclusion of the word 'river'", score: hasRiver ? 5 : 0 },
        {
          name: "Inclusion of the word 'mountain'",
          score: hasMountain ? 5 : 0,
        },
      ];
      break;
    }
    case 3: {
      const hasStreet = /\bstreet\b/i.test(trimmedText);
      const hasCoffee = /\bcoffee\b/i.test(trimmedText);
      const hasCrowd = /\bcrowd\b/i.test(trimmedText);

      questDetails = [
        { name: "Inclusion of the word 'street'", score: hasStreet ? 5 : 0 },
        { name: "Inclusion of the word 'coffee'", score: hasCoffee ? 5 : 0 },
        { name: "Inclusion of the word 'crowd'", score: hasCrowd ? 5 : 0 },
      ];
      break;
    }
    case 4: {
      const fruitsList = [
        "apple",
        "pear",
        "peach",
        "plum",
        "cherry",
        "cherries",
        "apricot",
        "nectarine",
        "plumcot",
        "orange",
        "lemon",
        "lime",
        "grapefruit",
        "mandarin",
        "clementine",
        "tangerine",
        "strawberry",
        "strawberries",
        "raspberry",
        "raspberries",
        "blueberry",
        "blueberries",
        "blackberry",
        "blackberries",
        "cranberry",
        "cranberries",
        "gooseberry",
        "gooseberries",
        "currant",
        "grape",
        "banana",
        "mango",
        "pineapple",
        "kiwi",
        "passionfruit",
        "papaya",
        "guava",
        "pomegranate",
        "fig",
        "date",
        "watermelon",
        "melon",
        "cantaloupe",
        "honeydew",
        "avocado",
        "coconut",
        "persimmon",
        "lychee",
        "dragonfruit",
      ];

      const foundFruits = fruitsList.filter((fruit) => {
        const regex = new RegExp(`\\b${fruit}\\b`, "i");
        return regex.test(trimmedText);
      });

      const uniqueFoundFruits = [
        ...new Set(
          foundFruits.map((f) => {
            if (f.endsWith("berries")) return f.replace("berries", "berry");
            if (f === "cherries") return "cherry";
            if (f.endsWith("s") && f !== "citrus") return f.slice(0, -1);
            return f;
          }),
        ),
      ];

      questDetails = [
        {
          name: "First unique fruit found",
          score: uniqueFoundFruits.length >= 1 ? 5 : 0,
        },
        {
          name: "Second unique fruit found",
          score: uniqueFoundFruits.length >= 2 ? 5 : 0,
        },
        {
          name: "Fruit variety bonus (3+ different fruits)",
          score:
            uniqueFoundFruits.length >= 3
              ? 5
              : uniqueFoundFruits.length === 2
                ? 3
                : 0,
        },
      ];
      break;
    }

    case 5: {
      const colorsList = [
        "red",
        "blue",
        "green",
        "yellow",
        "black",
        "white",
        "pink",
        "purple",
        "orange",
        "brown",
        "grey",
        "gray",
        "charcoal",
        "navy",
        "turquoise",
        "teal",
        "cyan",
        "indigo",
        "lime",
        "olive",
        "emerald",
        "mint",
        "maroon",
        "crimson",
        "scarlet",
        "ruby",
        "magenta",
        "fuchsia",
        "lavender",
        "violet",
        "plum",
        "gold",
        "silver",
        "bronze",
        "beige",
        "ivory",
        "cream",
        "tan",
        "khaki",
        "mustard",
        "amber",
        "coral",
        "peach",
        "lilac",
        "salmon",
        "turquoise",
        "aqua",
      ];

      const foundColors = colorsList.filter((color) => {
        const regex = new RegExp(`\\b${color}\\b`, "i");
        return regex.test(trimmedText);
      });

      const uniqueFoundColors = [
        ...new Set(
          foundColors.map((c) => {
            if (c === "gray") return "grey";
            return c;
          }),
        ),
      ];

      questDetails = [
        {
          name: "First unique color found",
          score: uniqueFoundColors.length >= 1 ? 5 : 0,
        },
        {
          name: "Second unique color found",
          score: uniqueFoundColors.length >= 2 ? 5 : 0,
        },
        {
          name: "Third unique color found",
          score: uniqueFoundColors.length >= 3 ? 5 : 0,
        },
      ];
      break;
    }

    case 6: {
      const hasCloud = /\bcloud(s|y)?\b/i.test(trimmedText);

      const hasWeatherWord = /\b(wind(s|y)?|rain(s|y)?|sun(s|ny)?)\b/i.test(
        trimmedText,
      );

      const hasWarmth = /\bwarmth\b/i.test(trimmedText);

      questDetails = [
        { name: "Inclusion of 'cloud' or 'cloudy'", score: hasCloud ? 5 : 0 },
        {
          name: "Inclusion of weather (wind, rain, sun...)",
          score: hasWeatherWord ? 5 : 0,
        },
        { name: "Inclusion of 'warmth'", score: hasWarmth ? 5 : 0 },
      ];
      break;
    }

    case 7: {
      const hasYesterday = /\byesterday\b/i.test(trimmedText);
      const hasToday = /\btoday\b/i.test(trimmedText);
      const hasTomorrow = /\btomorrow\b/i.test(trimmedText);

      questDetails = [
        { name: "Past reference ('yesterday')", score: hasYesterday ? 5 : 0 },
        { name: "Present reference ('today')", score: hasToday ? 5 : 0 },
        { name: "Future reference ('tomorrow')", score: hasTomorrow ? 5 : 0 },
      ];
      break;
    }

    case 8: {
      const actualSentences = (trimmedText.match(/[.!?]/g) || []).length;
      const isExactly4 = actualSentences === 4;

      if (isExactly4) {
        lengthRating = 5;
      } else if (actualSentences >= 2 && actualSentences <= 5) {
        lengthRating = 3;
      }

      questDetails = [
        {
          name: "Has structural formatting (at least 2 sentences)",
          score: actualSentences >= 2 ? 5 : 0,
        },
        {
          name: "Story arc (at least 3 sentences)",
          score: actualSentences >= 3 ? 5 : 0,
        },
        {
          name: "Exact precision (exactly 4 sentences)",
          score: isExactly4
            ? 5
            : Math.max(1, 5 - Math.abs(4 - actualSentences)),
        },
      ];
      break;
    }

    case 9: {
      const questionCount = (trimmedText.match(/\?/g) || []).length;

      questDetails = [
        {
          name: "First question marker ('?') found",
          score: questionCount >= 1 ? 5 : 0,
        },
        {
          name: "Second question marker ('?') found",
          score: questionCount >= 2 ? 5 : 0,
        },
        {
          name: "Curiosity bonus (3 or more questions)",
          score: questionCount >= 3 ? 5 : questionCount === 2 ? 3 : 0,
        },
      ];
      break;
    }

    case 10: {
      const totalWords = words.length;
      const isExactly10 = totalWords === 10;

      if (isExactly10) {
        lengthRating = 5;
      } else if (totalWords >= 8 && totalWords <= 12) {
        lengthRating = 3;
      }

      questDetails = [
        { name: "Sentence length limitation", score: totalWords <= 15 ? 5 : 0 },
        {
          name: "Word count proximity",
          score: totalWords >= 8 && totalWords <= 12 ? 5 : 0,
        },
        {
          name: "Exact precision (exactly 10 words)",
          score: isExactly10 ? 5 : 0,
        },
      ];
      break;
    }
    case 11: {
      // The Enthusiast: End at least 3 sentences with an exclamation mark (!)
      const exclamationCount = (trimmedText.match(/!/g) || []).length;

      questDetails = [
        {
          name: "First exclamation mark found",
          score: exclamationCount >= 1 ? 5 : 0,
        },
        {
          name: "Second exclamation mark found",
          score: exclamationCount >= 2 ? 5 : 0,
        },
        {
          name: "Third exclamation mark found",
          score: exclamationCount >= 3 ? 5 : 0,
        },
      ];
      break;
    }

    case 12: {
      // List Maker: Include a list of 3 items separated by commas
      const listRegex = /\b\w+,\s*\w+,\s*(?:and\s+)?\w+\b/i;
      const hasList = listRegex.test(trimmedText);

      questDetails = [
        {
          name: "Comma usage detected",
          score: (trimmedText.match(/,/g) || []).length >= 2 ? 5 : 0,
        },
        { name: "Three-item list structure", score: hasList ? 5 : 0 },
        { name: "Grammatical flow", score: hasList ? 5 : 2 },
      ];
      break;
    }

    case 13: {
      // The Essayist: Write a long message with more than 50 words
      const totalWords = words.length;

      questDetails = [
        {
          name: "Short text barrier passed (>20 words)",
          score: totalWords > 20 ? 5 : 0,
        },
        {
          name: "Medium text barrier passed (>35 words)",
          score: totalWords > 35 ? 5 : 0,
        },
        {
          name: "Target length achieved (>50 words)",
          score: totalWords > 50 ? 5 : 0,
        },
      ];
      break;
    }

    case 14: {
      // One Breath: Write entire postcard in just one single sentence
      const totalSentences = (trimmedText.match(/[.!?]/g) || []).length;
      const isOneSentence = totalSentences === 1;

      // ÜBERSCHREIBEN: Länge und Punctuation anpassen, da ein Satz oft kurz ist
      // und absichtlich nur ein einziges Satzzeichen am Ende hat!
      if (isOneSentence) {
        punctuationRating = 5;
        lengthRating = 5;
      }

      questDetails = [
        {
          name: "Sentence closure found (Ends with . ! ?)",
          score: totalSentences >= 1 ? 5 : 0,
        },
        {
          name: "No early sentence breaks",
          score: totalSentences <= 1 ? 5 : 0,
        },
        {
          name: "Exact precision (Exactly 1 sentence)",
          score: isOneSentence ? 5 : 0,
        },
      ];
      break;
    }

    case 15: {
      // Shouting from Afar: ONLY CAPITAL LETTERS
      const isAllCaps =
        trimmedText === trimmedText.toUpperCase() && /[A-Z]/.test(trimmedText);

      // ÜBERSCHREIBEN: Da hier ALLES groß sein MUSS, belohnen wir das Einhalten der Regel
      // mit der vollen Punktzahl bei der allgemeinen Capitalization-Bewertung.
      if (isAllCaps) {
        capitalizationRating = 5;
      }

      questDetails = [
        {
          name: "No lowercase letters used",
          score: trimmedText === trimmedText.toUpperCase() ? 5 : 0,
        },
        {
          name: "Contains actual alphabetic characters",
          score: /[A-Z]/.test(trimmedText) ? 5 : 0,
        },
        { name: "Shouting impact achieved", score: isAllCaps ? 5 : 0 },
      ];
      break;
    }
    case 16: {
      // Quiet Whispers: Only lowercase letters
      const isAllLower =
        trimmedText === trimmedText.toLowerCase() && /[a-z]/.test(trimmedText);

      // ÜBERSCHREIBEN: Wer nur klein schreibt, verstößt absichtlich gegen die Großschreibung.
      // Wenn die Quest erfüllt ist, setzen wir das Capitalization-Rating auf 5.
      if (isAllLower) {
        capitalizationRating = 5;
      }

      questDetails = [
        {
          name: "No capital letters used",
          score: trimmedText === trimmedText.toLowerCase() ? 5 : 0,
        },
        {
          name: "Contains actual alphabetic characters",
          score: /[a-z]/.test(trimmedText) ? 5 : 0,
        },
        { name: "Whisper aesthetic achieved", score: isAllLower ? 5 : 0 },
      ];
      break;
    }

    case 17: {
      // Numerical Order: Start every sentence with a number (1., 2., 3., etc.)
      const sentenceArray = trimmedText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      // Prüft, wie viele Sätze mit einer Ziffer (0-9) beginnen
      const startsWithNumberCount = sentenceArray.filter((s) =>
        /^\d/.test(s),
      ).length;
      const allStartWithNumber =
        sentenceArray.length > 0 &&
        startsWithNumberCount === sentenceArray.length;

      // ÜBERSCHREIBEN: Da Sätze hier mit Nummern statt Buchstaben beginnen,
      // könnte eine paranoide Capitalization-Prüfung meckern. Wir sichern sie ab.
      if (allStartWithNumber) {
        capitalizationRating = 5;
      }

      questDetails = [
        {
          name: "Structure contains valid sentences",
          score: sentenceArray.length > 0 ? 5 : 0,
        },
        {
          name: "Chronological numbering consistency",
          score:
            startsWithNumberCount >= Math.min(2, sentenceArray.length) ? 5 : 0,
        },
        {
          name: "Exact precision (Every sentence starts with a digit)",
          score: allStartWithNumber ? 5 : 0,
        },
      ];
      break;
    }

    case 18: {
      // First Impressions: Every sentence must start with the same letter
      const sentenceArray = trimmedText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      let allMatch = false;
      let firstLetter = "";

      if (sentenceArray.length > 0) {
        const firstMatch = sentenceArray[0].match(/[a-zA-Z]/);
        if (firstMatch) {
          firstLetter = firstMatch[0].toLowerCase();
          allMatch = sentenceArray.every((s) => {
            const m = s.match(/[a-zA-Z]/);
            return m && m[0].toLowerCase() === firstLetter;
          });
        }
      }

      questDetails = [
        {
          name: "At least multiple sentences written",
          score: sentenceArray.length >= 2 ? 5 : 2,
        },
        {
          name: "Identified starting letter rule",
          score: firstLetter !== "" ? 5 : 0,
        },
        {
          name: "Exact precision (All sentences share the same first letter)",
          score: allMatch ? 5 : 0,
        },
      ];
      break;
    }

    case 19: {
      // No E-Zone: Write a message without using the letter 'e' at all
      const hasNoE = !/e/i.test(trimmedText);

      // ÜBERSCHREIBEN: Ohne den Buchstaben 'e' (den häufigsten im Englischen)
      // wird der Text automatisch kürzer und grammatikalisch wilder.
      // Wir sind bei der Länge etwas nachsichtiger, wenn der User es durchzieht.
      if (hasNoE && trimmedText.length >= 40) {
        lengthRating = 5;
      }

      questDetails = [
        {
          name: "Absence of lowercase 'e'",
          score: !/e/.test(trimmedText) ? 5 : 0,
        },
        {
          name: "Absence of uppercase 'E'",
          score: !/E/.test(trimmedText) ? 5 : 0,
        },
        {
          name: "Complete Lipogram protection (No 'e' at all)",
          score: hasNoE ? 5 : 0,
        },
      ];
      break;
    }

    case 20: {
      // Lucky Seven: Use exactly 7 words that have 7 letters or more
      // Wir entfernen Satzzeichen von den Wörtern, um nur die reine Buchstabenlänge zu zählen
      const longWords = words.filter(
        (w) => w.replace(/[.,!?]/g, "").length >= 7,
      );
      const isExactly7 = longWords.length === 7;

      questDetails = [
        {
          name: "Minimum long words threshold (At least 4 words)",
          score: longWords.length >= 4 ? 5 : 0,
        },
        {
          name: "High vocabulary density (5-8 long words)",
          score: longWords.length >= 5 && longWords.length <= 8 ? 5 : 2,
        },
        {
          name: "Exact precision (Exactly 7 long words)",
          score: isExactly7
            ? 5
            : Math.max(1, 5 - Math.abs(7 - longWords.length)),
        },
      ];
      break;
    }
    case 21: {
      // Alpha & Omega: First sentence starts with 'A', last with 'Z'
      const sentenceArray = trimmedText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const startsWithA =
        sentenceArray.length > 0 && /^a/i.test(sentenceArray[0]);
      const endsWithZ =
        sentenceArray.length > 0 &&
        /^z/i.test(sentenceArray[sentenceArray.length - 1]);

      questDetails = [
        {
          name: "First sentence starts with 'A'/'a'",
          score: startsWithA ? 5 : 0,
        },
        { name: "Last sentence starts with 'Z'/'z'", score: endsWithZ ? 5 : 0 },
        {
          name: "Structural completeness",
          score: sentenceArray.length >= 2 ? 5 : 2,
        },
      ];
      break;
    }

    case 22: {
      // Rhyme Time: Last words of 1st and 2nd sentence rhyme
      const sentenceArray = trimmedText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      let rhymes = false;
      let word1 = "",
        word2 = "";

      if (sentenceArray.length >= 2) {
        // Bereinige die letzten Wörter von Satzzeichen
        const words1 = sentenceArray[0].split(/\s+/);
        const words2 = sentenceArray[1].split(/\s+/);
        word1 = words1[words1.length - 1]
          .replace(/[^a-zA-Z]/g, "")
          .toLowerCase();
        word2 = words2[words2.length - 1]
          .replace(/[^a-zA-Z]/g, "")
          .toLowerCase();

        if (word1 && word2 && word1 !== word2) {
          // Einfacher, aber effektiver Code-Reim-Check: Vergleiche die letzten 2-3 Buchstaben
          const tail1 = word1.slice(-3);
          const tail2 = word2.slice(-3);
          const shortTail1 = word1.slice(-2);
          const shortTail2 = word2.slice(-2);

          if (tail1 === tail2 || shortTail1 === shortTail2) rhymes = true;
        }
      }

      questDetails = [
        {
          name: "At least two sentences detected",
          score: sentenceArray.length >= 2 ? 5 : 0,
        },
        {
          name: "Unique ending words used",
          score: word1 && word2 && word1 !== word2 ? 5 : 0,
        },
        { name: "Phonetic rhyming match", score: rhymes ? 5 : 0 },
      ];
      break;
    }

    case 23: {
      // Lipogrammatic: Do not use the word 'and'
      const hasAnd = /\band\b/i.test(trimmedText);

      questDetails = [
        {
          name: "Avoidance of standard 'and'",
          score: !/\band\b/.test(trimmedText) ? 5 : 0,
        },
        {
          name: "Avoidance of uppercase 'AND'",
          score: !/\bAND\b/.test(trimmedText) ? 5 : 0,
        },
        { name: "Pure sentence connection", score: !hasAnd ? 5 : 0 },
      ];
      break;
    }

    case 24: {
      // The Haiku Spirit: 3 sentences with roughly 5, 7, and 5 words
      const sentenceArray = trimmedText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      let s1Count = sentenceArray[0]
        ? sentenceArray[0].split(/\s+/).filter((w) => w.length > 0).length
        : 0;
      let s2Count = sentenceArray[1]
        ? sentenceArray[1].split(/\s+/).filter((w) => w.length > 0).length
        : 0;
      let s3Count = sentenceArray[2]
        ? sentenceArray[2].split(/\s+/).filter((w) => w.length > 0).length
        : 0;

      // "Roughly" erlaubt eine Abweichung von +/- 1 Wort für Teilpunkte
      const s1Score = s1Count === 5 ? 5 : Math.abs(5 - s1Count) <= 1 ? 3 : 0;
      const s2Score = s2Count === 7 ? 5 : Math.abs(7 - s2Count) <= 1 ? 3 : 0;
      const s3Score = s3Count === 5 ? 5 : Math.abs(5 - s3Count) <= 1 ? 3 : 0;

      questDetails = [
        { name: "First sentence (Target: 5 words)", score: s1Score },
        { name: "Second sentence (Target: 7 words)", score: s2Score },
        { name: "Third sentence (Target: 5 words)", score: s3Score },
      ];
      break;
    }

    case 25: {
      // Action Packed: At least 5 different verbs ending in '-ing'
      // Findet alle Wörter, die auf 'ing' enden (ohne Satzzeichen)
      const ingWords = words
        .map((w) => w.replace(/[^a-zA-Z]/g, "").toLowerCase())
        .filter((w) => w.endsWith("ing") && w.length > 3);

      const uniqueIngWords = [...new Set(ingWords)];

      questDetails = [
        {
          name: "Presence of dynamic actions (-ing)",
          score: uniqueIngWords.length >= 2 ? 5 : 0,
        },
        {
          name: "High density of verbs (3-4 words)",
          score:
            uniqueIngWords.length >= 4 ? 5 : uniqueIngWords.length >= 3 ? 3 : 0,
        },
        {
          name: "Exact target reached (5+ unique -ing words)",
          score: uniqueIngWords.length >= 5 ? 5 : 0,
        },
      ];
      break;
    }

    case 26: {
      // Vowel Hunter: Word with at least 3 vowels in a row
      // Matcht 3 Vokale hintereinander (a, e, i, o, u)
      const hasThreeVowelsInRow = /[aeiou]{3,}/i.test(trimmedText);

      questDetails = [
        {
          name: "Vowel cluster detection",
          score: /[aeiou]{2,}/i.test(trimmedText) ? 5 : 0,
        },
        {
          name: "Advanced spelling complexity",
          score: hasThreeVowelsInRow ? 5 : 2,
        },
        {
          name: "Target word included (3+ vowels in a row)",
          score: hasThreeVowelsInRow ? 5 : 0,
        },
      ];
      break;
    }

    case 27: {
      // Double Trouble: At least 3 words with double letters
      // Matcht Wörter, die zwei identische Buchstaben hintereinander haben (z.B. oo, ll, ee)
      const doubleLetterWords = words.filter((w) =>
        /([a-zA-Z])\1/.test(w.replace(/[^a-zA-Z]/g, "")),
      );
      const uniqueDoubleWords = [
        ...new Set(doubleLetterWords.map((w) => w.toLowerCase())),
      ];

      questDetails = [
        {
          name: "First double-letter word found",
          score: uniqueDoubleWords.length >= 1 ? 5 : 0,
        },
        {
          name: "Second double-letter word found",
          score: uniqueDoubleWords.length >= 2 ? 5 : 0,
        },
        {
          name: "Third double-letter word found",
          score: uniqueDoubleWords.length >= 3 ? 5 : 0,
        },
      ];
      break;
    }

    case 28: {
      // Mirror World: Start and end with the exact same word
      const cleanWords = words.map((w) =>
        w.replace(/[^a-zA-Z]/g, "").toLowerCase(),
      );
      const firstWord = cleanWords[0] || "";
      const lastWord = cleanWords[cleanWords.length - 1] || "";
      const isMirrored = firstWord !== "" && firstWord === lastWord;

      questDetails = [
        {
          name: "Valid boundary words detected",
          score: firstWord && lastWord ? 5 : 0,
        },
        { name: "Symmetric phrasing match", score: isMirrored ? 5 : 0 },
        { name: "Perfect reflection score", score: isMirrored ? 5 : 0 },
      ];
      break;
    }

    case 29: {
      // Foreign Flair: Include one word in a language other than English
      // Wir nutzen hier dein bereits geladenes 'languagedetect' Paket für einzelne Wörter!
      let foreignWordCount = 0;

      for (const word of words) {
        const cleanWord = word.replace(/[^a-zA-Z]/g, "");
        if (cleanWord.length > 3) {
          const scores = lngDetector.detect(cleanWord, 1);
          if (scores[0] && scores[0][0] !== "english" && scores[0][1] > 0.4) {
            foreignWordCount++;

            // OPTIMIERUNG: Wenn wir 2 fremde Wörter haben, reichen die Punkte eh für alles aus.
            // Wir brechen ab, damit der Server bei langen Texten nicht einfriert.
            if (foreignWordCount >= 2) {
              break;
            }
          }
        }
      }

      questDetails = [
        {
          name: "Multilingual token detection",
          score: foreignWordCount >= 1 ? 5 : 0,
        },
        {
          name: "Exotic vocabulary balance",
          score: foreignWordCount === 1 ? 5 : foreignWordCount > 1 ? 3 : 0,
        },
        {
          name: "International flair factor",
          score: foreignWordCount >= 1 ? 5 : 0,
        },
      ];
      break;
    }

    case 30: {
      // The Minimalist: Only words with 4 letters or less
      const longWords = words.filter(
        (w) => w.replace(/[^a-zA-Z]/g, "").length > 4,
      );
      const isMinimalist = longWords.length === 0;

      // ÜBERSCHREIBEN: Durch lauter kurze Wörter wird der Text automatisch kürzer.
      if (isMinimalist) {
        lengthRating = 5;
      }

      questDetails = [
        {
          name: "Constraint check (No words > 6 letters)",
          score:
            words.filter((w) => w.replace(/[^a-zA-Z]/g, "").length > 6)
              .length === 0
              ? 5
              : 0,
        },
        {
          name: "Strict limitation (No words > 4 letters)",
          score: isMinimalist ? 5 : 0,
        },
        {
          name: "Vocabulary compression quality",
          score: isMinimalist ? 5 : Math.max(1, 5 - longWords.length),
        },
      ];
      break;
    }
    case 31: {
      // Triple Letter: At least 3 words starting with the same letter
      const cleanWords = words
        .map((w) => w.replace(/[^a-zA-Z]/g, "").toLowerCase())
        .filter((w) => w.length > 0);

      // Zähle die Anfangsbuchstaben
      const letterCounts = {};
      cleanWords.forEach((w) => {
        const firstLetter = w[0];
        letterCounts[firstLetter] = (letterCounts[firstLetter] || 0) + 1;
      });

      const maxMatchingLetters =
        Object.keys(letterCounts).length > 0
          ? Math.max(...Object.values(letterCounts))
          : 0;

      questDetails = [
        {
          name: "First matching pair found",
          score: maxMatchingLetters >= 2 ? 5 : 0,
        },
        {
          name: "Alliteration effect (3+ matching words)",
          score: maxMatchingLetters >= 3 ? 5 : 0,
        },
        {
          name: "Vocabulary uniformity",
          score: maxMatchingLetters >= 4 ? 5 : maxMatchingLetters === 3 ? 3 : 0,
        },
      ];
      break;
    }

    case 32: {
      // Animal Kingdom: Mention at least 2 animals
      const animalsList = [
        "dog",
        "cat",
        "bird",
        "fish",
        "horse",
        "cow",
        "pig",
        "sheep",
        "chicken",
        "duck",
        "lion",
        "tiger",
        "bear",
        "elephant",
        "giraffe",
        "monkey",
        "deer",
        "rabbit",
        "mouse",
        "snake",
        "frog",
        "turtle",
        "whale",
        "dolphin",
        "shark",
        "eagle",
        "owl",
        "wolf",
        "fox",
        "zebra",
      ];
      const foundAnimals = animalsList.filter((animal) =>
        new RegExp(`\\b${animal}s?\\b`, "i").test(trimmedText),
      );
      const uniqueAnimals = [...new Set(foundAnimals)];

      questDetails = [
        {
          name: "First animal species spotted",
          score: uniqueAnimals.length >= 1 ? 5 : 0,
        },
        {
          name: "Second animal species spotted",
          score: uniqueAnimals.length >= 2 ? 5 : 0,
        },
        {
          name: "Fauna diversity bonus",
          score:
            uniqueAnimals.length >= 3 ? 5 : uniqueAnimals.length === 2 ? 3 : 0,
        },
      ];
      break;
    }

    case 33: {
      // Question Master: Start postcard with a question mark sentence
      const sentenceArray = trimmedText.split(/(?<=[.!?])\s+/); // Splittet Sätze, behält aber das Satzzeichen am Satzende
      const firstSentence = sentenceArray[0] || "";
      const startsWithQuestion = firstSentence.trim().endsWith("?");

      questDetails = [
        {
          name: "Text contains a question",
          score: trimmedText.includes("?") ? 5 : 0,
        },
        {
          name: "Opening hook is interactive",
          score: startsWithQuestion ? 5 : 0,
        },
        { name: "Grammatical sequence", score: startsWithQuestion ? 5 : 2 },
      ];
      break;
    }

    case 34: {
      // Emoji Energy: Include at least 3 emojis
      // Matcht die allermeisten Unicode-Emojis
      const emojiRegex =
        /[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/gu;
      const emojiMatch = trimmedText.match(emojiRegex) || [];

      questDetails = [
        {
          name: "First emoji expression found",
          score: emojiMatch.length >= 1 ? 5 : 0,
        },
        {
          name: "Second emoji expression found",
          score: emojiMatch.length >= 2 ? 5 : 0,
        },
        {
          name: "Third emoji expression found",
          score: emojiMatch.length >= 3 ? 5 : 0,
        },
      ];
      break;
    }

    case 35: {
      // Weekend Mood: Use both words 'Saturday' and 'Sunday'
      const hasSaturday = /\bSaturday\b/i.test(trimmedText);
      const hasSunday = /\bSunday\b/i.test(trimmedText);

      questDetails = [
        { name: "Inclusion of 'Saturday'", score: hasSaturday ? 5 : 0 },
        { name: "Inclusion of 'Sunday'", score: hasSunday ? 5 : 0 },
        {
          name: "Full weekend coverage",
          score: hasSaturday && hasSunday ? 5 : 0,
        },
      ];
      break;
    }

    case 36: {
      // Fast Counter: Exactly 20 words
      const totalWords = words.length;
      const isExactly20 = totalWords === 20;

      // ÜBERSCHREIBEN: 20 Wörter sind meistens kürzer als 100 Zeichen.
      // Wenn der User die 20 Wörter perfekt trifft, schenken wir ihm die 5 für das Längen-Rating.
      if (isExactly20) {
        lengthRating = 5;
      } else if (totalWords >= 15 && totalWords <= 25) {
        lengthRating = 3;
      }

      questDetails = [
        {
          name: "Word count limit constraint",
          score: totalWords <= 25 ? 5 : 0,
        },
        {
          name: "Proximity to target (15-25 words)",
          score: totalWords >= 15 && totalWords <= 25 ? 5 : 0,
        },
        {
          name: "Exact precision (Exactly 20 words)",
          score: isExactly20 ? 5 : Math.max(1, 5 - Math.abs(20 - totalWords)),
        },
      ];
      break;
    }

    case 37: {
      // Tiny Words: At least 10 words with only 3 letters
      const threeLetterWords = words.filter(
        (w) => w.replace(/[^a-zA-Z]/g, "").length === 3,
      );

      questDetails = [
        {
          name: "Micro-vocabulary usage (At least 4 words)",
          score: threeLetterWords.length >= 4 ? 5 : 0,
        },
        {
          name: "High density of small words (7-9 words)",
          score:
            threeLetterWords.length >= 7
              ? 5
              : threeLetterWords.length >= 4
                ? 3
                : 0,
        },
        {
          name: "Target threshold reached (10+ three-letter words)",
          score: threeLetterWords.length >= 10 ? 5 : 0,
        },
      ];
      break;
    }

    case 38: {
      // Travel Bag: Mention 'passport', 'ticket', and 'hotel'
      const hasPassport = /\bpassport\b/i.test(trimmedText);
      const hasTicket = /\bticket\b/i.test(trimmedText);
      const hasHotel = /\bhotel\b/i.test(trimmedText);

      questDetails = [
        { name: "Luggage item: 'passport'", score: hasPassport ? 5 : 0 },
        { name: "Transit item: 'ticket'", score: hasTicket ? 5 : 0 },
        { name: "Lodging item: 'hotel'", score: hasHotel ? 5 : 0 },
      ];
      break;
    }

    case 39: {
      // Morning Routine: Use 'coffee', 'breakfast', and 'alarm'
      const hasCoffee = /\bcoffee\b/i.test(trimmedText);
      const hasBreakfast = /\bbreakfast\b/i.test(trimmedText);
      const hasAlarm = /\balarm\b/i.test(trimmedText);

      questDetails = [
        { name: "Routine step: 'coffee'", score: hasCoffee ? 5 : 0 },
        { name: "Routine step: 'breakfast'", score: hasBreakfast ? 5 : 0 },
        { name: "Routine step: 'alarm'", score: hasAlarm ? 5 : 0 },
      ];
      break;
    }

    case 40: {
      // Ocean Life: Mention 'fish', 'wave', and 'boat'
      const hasFish = /\bfish\b/i.test(trimmedText);
      const hasWave = /\bwave(s)?\b/i.test(trimmedText);
      const hasBoat = /\bboat(s)?\b/i.test(trimmedText);

      questDetails = [
        { name: "Marine life: 'fish'", score: hasFish ? 5 : 0 },
        { name: "Environment: 'wave'", score: hasWave ? 5 : 0 },
        { name: "Vessel: 'boat'", score: hasBoat ? 5 : 0 },
      ];
      break;
    }
    case 41: {
      // Countdown: Include numbers 1, 2, and 3
      // Prüft sowohl Ziffern als auch ausgeschriebene Zahlen
      const hasOne = /\b(1|one)\b/i.test(trimmedText);
      const hasTwo = /\b(2|two)\b/i.test(trimmedText);
      const hasThree = /\b(3|three)\b/i.test(trimmedText);

      questDetails = [
        { name: "Inclusion of number 1 / 'one'", score: hasOne ? 5 : 0 },
        { name: "Inclusion of number 2 / 'two'", score: hasTwo ? 5 : 0 },
        { name: "Inclusion of number 3 / 'three'", score: hasThree ? 5 : 0 },
      ];
      break;
    }

    case 42: {
      // Symmetry: Write 2 sentences with the same number of words
      const sentenceArray = trimmedText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      let hasSymmetry = false;
      // Wir prüfen alle Kombinationen, falls der User mehr als 2 Sätze schreibt
      if (sentenceArray.length >= 2) {
        const wordCounts = sentenceArray.map(
          (s) => s.split(/\s+/).filter((w) => w.length > 0).length,
        );

        for (let i = 0; i < wordCounts.length; i++) {
          for (let j = i + 1; j < wordCounts.length; j++) {
            if (wordCounts[i] === wordCounts[j] && wordCounts[i] > 0) {
              hasSymmetry = true;
              break;
            }
          }
          if (hasSymmetry) break;
        }
      }

      questDetails = [
        {
          name: "Sentence count validation (2+ sentences)",
          score: sentenceArray.length >= 2 ? 5 : 0,
        },
        { name: "Symmetric structural match", score: hasSymmetry ? 5 : 0 },
        { name: "Word count balance precision", score: hasSymmetry ? 5 : 2 },
      ];
      break;
    }

    case 43: {
      // Food Lover: Mention at least 3 different foods
      const foodList = [
        "pizza",
        "pasta",
        "burger",
        "salad",
        "soup",
        "bread",
        "cheese",
        "rice",
        "cake",
        "cookie",
        "chocolate",
        "sandwich",
        "steak",
        "sushi",
        "taco",
        "egg",
        "butter",
        "milk",
        "ice",
        "cream",
        "fish",
        "chicken",
        "meat",
        "potato",
        "tomato",
        "onion",
        "garlic",
        "bacon",
        "sausage",
        "honey",
        "curry",
        "waffle",
        "pancake",
        "donut",
        "muffin",
        "croissant",
        "bagel",
        "toast",
        "noodle",
        "ramen",
        "burrito",
        "nachos",
        "kebab",
        "lasagna",
        "omelet",
        "popcorn",
        "chips",
        "fries",
        "sauce",
        "pepper",
        "salt",
        "sugar",
        "oil",
        "vinegar",
        "apple",
        "banana",
        "orange",
        "berry",
        "lemon",
        "lime",
        "grape",
        "carrot",
        "broccoli",
        "spinach",
        "cucumber",
        "shrimp",
        "lobster",
        "tofu",
        "yogurt",
        "pudding",
        "jam",
        "mustard",
        "ketchup",
        "mayo",
        "wurst",
        "schinken",
        "kaffee",
        "tee",
        "saft",
        "wasser",
        "wein",
        "bier",
        "suppe",
        "brötchen",
        "brezel",
        "baguette",
        "nudeln",
        "spaghetti",
        "ravioli",
        "gnocchi",
        "risotto",
        "pommes",
        "püree",
        "grill",
        "barbecue",
        "braten",
        "schnitzel",
        "gulasch",
        "rabe",
        "lachs",
        "thunfisch",
        "forelle",
        "garnele",
        "tintenfisch",
        "avocado",
        "pilze",
        "champignon",
        "knoblauch",
        "ingwer",
        "zitrone",
        "erdbeere",
        "himbeere",
        "kirsche",
        "pfirsich",
        "melone",
        "ananas",
        "nuss",
        "mandel",
        "erdnuss",
        "walnuss",
        "müsli",
        "haferflocken",
        "cornflakes",
        "quark",
        "sahne",
        "dip",
        "pesto",
        "dressing",
        "pancake",
        "waffle",
        "donut",
        "muffin",
        "cupcake",
        "brownie",
        "pie",
        "croissant",
        "bagel",
        "toast",
        "pastry",
        "fries",
        "nuggets",
        "hotdog",
        "pizza",
        "burrito",
        "taco",
        "kebab",
        "nachos",
        "wings",
        "noodle",
        "ramen",
        "curry",
        "dumpling",
        "lasagna",
        "pasta",
        "risotto",
        "stew",
        "omelet",
        "shrimp",
        "lobster",
        "crab",
        "salmon",
        "tuna",
        "turkey",
        "pork",
        "beef",
        "ribs",
        "ham",
        "yogurt",
        "tofu",
        "pudding",
        "cream",
      ];
      const foundFood = foodList.filter((food) =>
        new RegExp(`\\b${food}s?\\b`, "i").test(trimmedText),
      );
      const uniqueFood = [...new Set(foundFood)];

      questDetails = [
        {
          name: "First food item identified",
          score: uniqueFood.length >= 1 ? 5 : 0,
        },
        {
          name: "Second food item identified",
          score: uniqueFood.length >= 2 ? 5 : 0,
        },
        {
          name: "Third food item identified",
          score: uniqueFood.length >= 3 ? 5 : 0,
        },
      ];
      break;
    }

    case 44: {
      // Night Owl: Use 'moon', 'star', and 'dark'
      const hasMoon = /\bmoon(s)?\b/i.test(trimmedText);
      const hasStar = /\bstar(s)?\b/i.test(trimmedText);
      const hasDark = /\bdark\b/i.test(trimmedText);

      questDetails = [
        { name: "Celestial object: 'moon'", score: hasMoon ? 5 : 0 },
        { name: "Celestial object: 'star'", score: hasStar ? 5 : 0 },
        { name: "Atmosphere: 'dark'", score: hasDark ? 5 : 0 },
      ];
      break;
    }

    case 45: {
      // The Repeater: Use the same word 5 times
      const cleanWords = words
        .map((w) => w.replace(/[^a-zA-Z]/g, "").toLowerCase())
        .filter((w) => w.length > 1);

      const wordCounts = {};
      cleanWords.forEach((w) => {
        wordCounts[w] = (wordCounts[w] || 0) + 1;
      });

      const maxRepetitions =
        Object.keys(wordCounts).length > 0
          ? Math.max(...Object.values(wordCounts))
          : 0;

      questDetails = [
        {
          name: "Word repetition rhythm (At least 3 times)",
          score: maxRepetitions >= 3 ? 5 : 0,
        },
        {
          name: "Advanced repetition rhythm (At least 4 times)",
          score: maxRepetitions >= 4 ? 5 : 0,
        },
        {
          name: "Target frequency reached (5+ times)",
          score: maxRepetitions >= 5 ? 5 : 0,
        },
      ];
      break;
    }

    case 46: {
      // ABC: Include words starting with A, B, and C
      const cleanWords = words.map((w) =>
        w.replace(/[^a-zA-Z]/g, "").toLowerCase(),
      );
      const hasA = cleanWords.some((w) => w.startsWith("a"));
      const hasB = cleanWords.some((w) => w.startsWith("b"));
      const hasC = cleanWords.some((w) => w.startsWith("c"));

      questDetails = [
        { name: "Word starting with 'A'", score: hasA ? 5 : 0 },
        { name: "Word starting with 'B'", score: hasB ? 5 : 0 },
        { name: "Word starting with 'C'", score: hasC ? 5 : 0 },
      ];
      break;
    }

    case 47: {
      // Punctuation Party: Use ?, , and !
      const hasQuestion = trimmedText.includes("?");
      const hasComma = trimmedText.includes(",");
      const hasExclamation = trimmedText.includes("!");

      questDetails = [
        { name: "Inclusion of a comma (',')", score: hasComma ? 5 : 0 },
        {
          name: "Inclusion of a question mark ('?')",
          score: hasQuestion ? 5 : 0,
        },
        {
          name: "Inclusion of an exclamation mark ('!')",
          score: hasExclamation ? 5 : 0,
        },
      ];
      break;
    }

    case 48: {
      // Long Journey: Write at least 5 sentences
      const sentenceCount = (trimmedText.match(/[.!?]/g) || []).length;

      questDetails = [
        {
          name: "Structural depth (At least 3 sentences)",
          score: sentenceCount >= 3 ? 5 : 0,
        },
        {
          name: "Structural depth (At least 4 sentences)",
          score: sentenceCount >= 4 ? 5 : 0,
        },
        {
          name: "Target length achieved (5+ sentences)",
          score: sentenceCount >= 5 ? 5 : 0,
        },
      ];
      break;
    }

    case 49: {
      // Mini Journey: Write only 2 sentences
      const sentenceCount = (trimmedText.match(/[.!?]/g) || []).length;
      const isExactly2 = sentenceCount === 2;

      // ÜBERSCHREIBEN: Genau 2 Sätze sind oft kürzer als 100 Zeichen.
      if (isExactly2) {
        lengthRating = 5;
      }

      questDetails = [
        {
          name: "Sentence boundary closure",
          score: sentenceCount >= 1 ? 5 : 0,
        },
        {
          name: "No extra sentence clutter",
          score: sentenceCount <= 2 ? 5 : 0,
        },
        {
          name: "Exact precision (Exactly 2 sentences)",
          score: isExactly2 ? 5 : 0,
        },
      ];
      break;
    }

    case 50: {
      // Mirror Numbers: Include the same number twice
      // Sucht nach einzelnen Ziffern/Zahlen im Text
      const numbersFound = trimmedText.match(/\d+/g) || [];

      let hasDuplicateNumber = false;
      const numCounts = {};
      numbersFound.forEach((n) => {
        numCounts[n] = (numCounts[n] || 0) + 1;
        if (numCounts[n] >= 2) hasDuplicateNumber = true;
      });

      questDetails = [
        {
          name: "Numeric token detected",
          score: numbersFound.length >= 1 ? 5 : 0,
        },
        {
          name: "Numeric counterpart found",
          score: numbersFound.length >= 2 ? 5 : 0,
        },
        {
          name: "Exact matching pair duplication",
          score: hasDuplicateNumber ? 5 : 0,
        },
      ];
      break;
    }
    case 51: {
      // Frozen World: Use 'snow', 'ice', and 'cold'
      const hasSnow = /\bsnow\b/i.test(trimmedText);
      const hasIce = /\bice\b/i.test(trimmedText);
      const hasCold = /\bcold\b/i.test(trimmedText);

      questDetails = [
        { name: "Winter element: 'snow'", score: hasSnow ? 5 : 0 },
        { name: "Winter element: 'ice'", score: hasIce ? 5 : 0 },
        { name: "Atmosphere: 'cold'", score: hasCold ? 5 : 0 },
      ];
      break;
    }

    case 52: {
      // Happy Ending: End postcard with an exclamation mark (!)
      const endsWithExclamation = trimmedText.endsWith("!");

      questDetails = [
        {
          name: "Text contains punctuation",
          score: /[.!?]$/.test(trimmedText) ? 5 : 0,
        },
        {
          name: "Enthusiastic tone detected",
          score: trimmedText.includes("!") ? 5 : 0,
        },
        {
          name: "Exact final character matches '!'",
          score: endsWithExclamation ? 5 : 0,
        },
      ];
      break;
    }

    case 53: {
      // Starting Strong: Start postcard with the word 'Today'
      const startsWithToday = /^today\b/i.test(trimmedText);

      questDetails = [
        { name: "Valid opening token found", score: words.length > 0 ? 5 : 0 },
        {
          name: "Chronological hook applied",
          score: /today/i.test(words[0]) ? 5 : 0,
        },
        {
          name: "Exact precision (Starts with 'Today')",
          score: startsWithToday ? 5 : 0,
        },
      ];
      break;
    }

    case 54: {
      // Capital Start: Every sentence must start with a capital letter
      const sentenceArray = trimmedText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      // Prüft, ob der allererste Buchstabe jedes Satzes ein Großbuchstabe ist
      const capitalStarts = sentenceArray.filter((s) => {
        const firstLetter = s.match(/[a-zA-Z]/);
        return firstLetter && firstLetter[0] === firstLetter[0].toUpperCase();
      }).length;

      const allValid =
        sentenceArray.length > 0 && capitalStarts === sentenceArray.length;

      // ÜBERSCHREIBEN: Wenn diese Quest perfekt gelöst ist, stellen wir sicher,
      // dass auch das globale Capitalization-Rating auf 5 steht.
      if (allValid) {
        capitalizationRating = 5;
      }

      questDetails = [
        {
          name: "Structural validation (Valid sentences)",
          score: sentenceArray.length > 0 ? 5 : 0,
        },
        {
          name: "Grammatical starting standard",
          score: capitalStarts >= Math.min(1, sentenceArray.length) ? 5 : 0,
        },
        {
          name: "Exact precision (All sentences capitalized)",
          score: allValid ? 5 : 0,
        },
      ];
      break;
    }

    case 55: {
      // Double Question: Exactly 2 question marks
      const questionCount = (trimmedText.match(/\?/g) || []).length;
      const isExactly2 = questionCount === 2;

      questDetails = [
        {
          name: "Inquiry formatting detected",
          score: questionCount >= 1 ? 5 : 0,
        },
        {
          name: "Interactive content balance",
          score: questionCount <= 3 ? 5 : 0,
        },
        {
          name: "Exact precision (Exactly 2 question marks)",
          score: isExactly2 ? 5 : Math.max(1, 5 - Math.abs(2 - questionCount)),
        },
      ];
      break;
    }

    case 56: {
      // Treasure Hunt: Mention 'map', 'gold', and 'island'
      const hasMap = /\bmap(s)?\b/i.test(trimmedText);
      const hasGold = /\bgold\b/i.test(trimmedText);
      const hasIsland = /\bisland(s)?\b/i.test(trimmedText);

      questDetails = [
        { name: "Adventure item: 'map'", score: hasMap ? 5 : 0 },
        { name: "Reward item: 'gold'", score: hasGold ? 5 : 0 },
        { name: "Location: 'island'", score: hasIsland ? 5 : 0 },
      ];
      break;
    }

    case 57: {
      // Movie Night: Use 'popcorn', 'movie', and 'screen'
      const hasPopcorn = /\bpopcorn\b/i.test(trimmedText);
      const hasMovie = /\bmovie(s)?\b/i.test(trimmedText);
      const hasScreen = /\bscreen(s)?\b/i.test(trimmedText);

      questDetails = [
        { name: "Snack choice: 'popcorn'", score: hasPopcorn ? 5 : 0 },
        { name: "Entertainment: 'movie'", score: hasMovie ? 5 : 0 },
        { name: "Setup: 'screen'", score: hasScreen ? 5 : 0 },
      ];
      break;
    }

    case 58: {
      // Rainbow: Mention colors red, blue, and green
      const hasRed = /\bred\b/i.test(trimmedText);
      const hasBlue = /\bblue\b/i.test(trimmedText);
      const hasGreen = /\bgreen\b/i.test(trimmedText);

      questDetails = [
        { name: "Primary color: 'red'", score: hasRed ? 5 : 0 },
        { name: "Primary color: 'blue'", score: hasBlue ? 5 : 0 },
        { name: "Secondary color: 'green'", score: hasGreen ? 5 : 0 },
      ];
      break;
    }

    case 59: {
      // Speed Run: Fewer than 15 words
      const totalWords = words.length;
      const isUnder15 = totalWords < 15 && totalWords > 0;

      // ÜBERSCHREIBEN: Die Quest verlangt extrem Kürze. Wenn der User unter 15 Wörtern bleibt,
      // ist das globale lengthRating automatisch eine glatte 5!
      if (isUnder15) {
        lengthRating = 5;
      }

      questDetails = [
        { name: "Text submission valid", score: totalWords > 0 ? 5 : 0 },
        {
          name: "Compression restraint achieved",
          score: totalWords <= 18 ? 5 : 0,
        }, // Kulanzbereich bis 18
        {
          name: "Exact precision (Fewer than 15 words)",
          score: isUnder15 ? 5 : 0,
        },
      ];
      break;
    }

    case 60: {
      // Double Space: At least 2 commas in your postcard
      const commaCount = (trimmedText.match(/,/g) || []).length;

      questDetails = [
        {
          name: "First comma separation found",
          score: commaCount >= 1 ? 5 : 0,
        },
        {
          name: "Second comma separation found",
          score: commaCount >= 2 ? 5 : 0,
        },
        { name: "Sentence structure complex", score: commaCount >= 2 ? 5 : 2 },
      ];
      break;
    }

    case 61: {
      // Pet Lover: Mention a cat and a dog
      const hasCat = /\bcat(s)?\b/i.test(trimmedText);
      const hasDog = /\bdog(s)?\b/i.test(trimmedText);

      questDetails = [
        { name: "Feline presence ('cat')", score: hasCat ? 5 : 0 },
        { name: "Canine presence ('dog')", score: hasDog ? 5 : 0 },
        { name: "Pet harmony achieved", score: hasCat && hasDog ? 5 : 0 },
      ];
      break;
    }

    case 62: {
      // Four Corners: Exactly 4 sentences (Logik analog zu Case 8)
      const actualSentences = (trimmedText.match(/[.!?]/g) || []).length;
      const isExactly4 = actualSentences === 4;

      if (isExactly4) {
        lengthRating = 5;
      }

      questDetails = [
        {
          name: "Has structural formatting (at least 2 sentences)",
          score: actualSentences >= 2 ? 5 : 0,
        },
        {
          name: "Story arc (at least 3 sentences)",
          score: actualSentences >= 3 ? 5 : 0,
        },
        {
          name: "Exact precision (exactly 4 sentences)",
          score: isExactly4
            ? 5
            : Math.max(1, 5 - Math.abs(4 - actualSentences)),
        },
      ];
      break;
    }

    case 63: {
      // Alphabet Soup: Use every vowel at least once (A, E, I, O, U)
      const hasA = /a/i.test(trimmedText);
      const hasE = /e/i.test(trimmedText);
      const hasI = /i/i.test(trimmedText);
      const hasO = /o/i.test(trimmedText);
      const hasU = /u/i.test(trimmedText);

      const count = [hasA, hasE, hasI, hasO, hasU].filter(Boolean).length;

      questDetails = [
        {
          name: "Basic vowel variety (3+ unique vowels)",
          score: count >= 3 ? 5 : 0,
        },
        {
          name: "Advanced vowel variety (4+ unique vowels)",
          score: count >= 4 ? 5 : 2,
        },
        {
          name: "Full phonetic alphabet (All 5 vowels)",
          score: count === 5 ? 5 : 0,
        },
      ];
      break;
    }

    case 64: {
      // Repeated Ending: End 3 sentences with the same word
      const sentenceArray = trimmedText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const lastWords = sentenceArray
        .map((s) => {
          const wordsInSentence = s.split(/\s+/);
          return wordsInSentence[wordsInSentence.length - 1]
            .replace(/[^a-zA-Z]/g, "")
            .toLowerCase();
        })
        .filter((w) => w.length > 0);

      const wordCounts = {};
      lastWords.forEach((w) => {
        wordCounts[w] = (wordCounts[w] || 0) + 1;
      });

      const maxRepetitions =
        Object.keys(wordCounts).length > 0
          ? Math.max(...Object.values(wordCounts))
          : 0;

      questDetails = [
        {
          name: "Sentence closure variety",
          score: sentenceArray.length >= 3 ? 5 : 0,
        },
        {
          name: "Rhyming rhythm blueprint",
          score: maxRepetitions >= 2 ? 5 : 0,
        },
        {
          name: "Exact precision (3 sentences end on the same word)",
          score: maxRepetitions >= 3 ? 5 : 0,
        },
      ];
      break;
    }

    case 65: {
      // The Counter: Use at least 25 words
      const totalWords = words.length;

      questDetails = [
        {
          name: "Short text barrier passed (>10 words)",
          score: totalWords > 10 ? 5 : 0,
        },
        {
          name: "Medium text barrier passed (>18 words)",
          score: totalWords > 18 ? 5 : 0,
        },
        {
          name: "Target length achieved (25+ words)",
          score: totalWords >= 25 ? 5 : 0,
        },
      ];
      break;
    }

    case 66: {
      // Excited Writer: Use at least 5 exclamation marks
      const exclamationCount = (trimmedText.match(/!/g) || []).length;

      questDetails = [
        {
          name: "Enthusiastic burst (1-2 marks)",
          score: exclamationCount >= 2 ? 5 : 0,
        },
        {
          name: "High expression density (3-4 marks)",
          score: exclamationCount >= 4 ? 5 : exclamationCount >= 2 ? 3 : 0,
        },
        {
          name: "Maximum energy (5+ exclamation marks)",
          score: exclamationCount >= 5 ? 5 : 0,
        },
      ];
      break;
    }

    case 67: {
      // Pairing Up: Use at least 4 words that rhyme
      const cleanWords = words
        .map((w) => w.replace(/[^a-zA-Z]/g, "").toLowerCase())
        .filter((w) => w.length > 1);

      let maxRhymeGroup = 0;
      const tailCounts = {};

      // Wir gruppieren Wörter nach ihren letzten 2 Buchstaben für einen einfachen Reim-Check
      cleanWords.forEach((w) => {
        const tail = w.slice(-2);
        if (tail.length === 2) {
          tailCounts[tail] = (tailCounts[tail] || 0) + 1;
        }
      });

      if (Object.keys(tailCounts).length > 0) {
        maxRhymeGroup = Math.max(...Object.values(tailCounts));
      }

      questDetails = [
        {
          name: "Found rhyming pair (2 words)",
          score: maxRhymeGroup >= 2 ? 5 : 0,
        },
        {
          name: "Found rhyming triplet (3 words)",
          score: maxRhymeGroup >= 3 ? 5 : 0,
        },
        {
          name: "Poetic mastery (4+ rhyming words)",
          score: maxRhymeGroup >= 4 ? 5 : 0,
        },
      ];
      break;
    }

    case 68: {
      // Tiny Sentence: Include a sentence with only 2 words
      const sentenceArray = trimmedText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const hasTwoWordSentence = sentenceArray.some(
        (s) => s.split(/\s+/).filter((w) => w.length > 0).length === 2,
      );

      questDetails = [
        {
          name: "Valid sentence layout",
          score: sentenceArray.length > 0 ? 5 : 0,
        },
        {
          name: "Varying sentence length rhythm",
          score: sentenceArray.some(
            (s) => s.split(/\s+/).filter((w) => w.length > 0).length <= 4,
          )
            ? 5
            : 0,
        },
        {
          name: "Exact micro-sentence (Exactly 2 words)",
          score: hasTwoWordSentence ? 5 : 0,
        },
      ];
      break;
    }

    case 69: {
      // Clock Watcher: Mention a specific time like 3:45 or 12:00
      // Findet Muster wie 12:00, 3:45, 23:15, 0:00 oder 4pm, 5am
      const timeRegex =
        /\b((?:[01]?\d|2[0-3]):[0-5]\d)|([1-9]|1[0-2])\s*(am|pm)\b/i;
      const hasTime = timeRegex.test(trimmedText);

      questDetails = [
        {
          name: "Numerical data inclusion",
          score: /\d/.test(trimmedText) ? 5 : 0,
        },
        { name: "Chronological timestamps format", score: hasTime ? 5 : 2 },
        { name: "Specific timeline anchor", score: hasTime ? 5 : 0 },
      ];
      break;
    }

    case 70: {
      // Direction Finder: Use north, south, east, and west
      const hasNorth = /\bnorth\b/i.test(trimmedText);
      const hasSouth = /\bsouth\b/i.test(trimmedText);
      const hasEast = /\beast\b/i.test(trimmedText);
      const hasWest = /\bwest\b/i.test(trimmedText);

      const count = [hasNorth, hasSouth, hasEast, hasWest].filter(
        Boolean,
      ).length;

      questDetails = [
        {
          name: "Axis locked (North & South)",
          score: hasNorth && hasSouth ? 5 : hasNorth || hasSouth ? 3 : 0,
        },
        {
          name: "Axis locked (East & West)",
          score: hasEast && hasWest ? 5 : hasEast || hasWest ? 3 : 0,
        },
        {
          name: "Full compass completion (All 4 directions)",
          score: count === 4 ? 5 : 0,
        },
      ];
      break;
    }
    default:
      questDetails = [{ name: questTitle || "Standard submission", score: 5 }];
      break;
  }

  const totalItems = questDetails.length;
  const maxPossiblePoints = totalItems * 5;
  const earnedPoints = questDetails.reduce((sum, item) => sum + item.score, 0);

  const maxNormalized = maxPossiblePoints - totalItems;
  const earnedNormalized = earnedPoints - totalItems;
  const successRate = maxNormalized > 0 ? earnedNormalized / maxNormalized : 0;

  const baseXP =
    Number(maxTotalXP) < 10 ? Math.floor(Number(maxTotalXP) * 0.3) : 10;

  const availableQuestXP =
    Number(maxTotalXP) > baseXP
      ? Number(maxTotalXP) - baseXP
      : Number(maxTotalXP);
  const earnedQuestXP = Math.round(successRate * availableQuestXP);
  const totalXP = baseXP + earnedQuestXP;

  return {
    ratings: {
      length: lengthRating,
      badWords: badWordsRating,
      capitalization: capitalizationRating,
      punctuation: punctuationRating,
    },
    questFulfillment: questDetails,
    xpCalculation: {
      baseXP: baseXP,
      questXP: earnedQuestXP,
      totalXP: totalXP,
      percentage: Math.round(successRate * 100),
    },
    labels: {
      questLabel: questTitle,
    },
  };
}
