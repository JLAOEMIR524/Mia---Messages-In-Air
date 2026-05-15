export interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
}

export const mockQuests: Quest[] = [
  {
    id: "1",
    title: "The Trinity",
    description: "Use these 3 specific words: sun, window, and train.",
    xp: 40,
  },
  {
    id: "2",
    title: "Nature's Call",
    description:
      "Incorporate the words 'tree', 'river', and 'mountain' in your message.",
    xp: 40,
  },
  {
    id: "3",
    title: "Urban Explorer",
    description: "Use the words 'street', 'coffee', and 'crowd' in your text.",
    xp: 30,
  },
  {
    id: "4",
    title: "Sweet Greetings",
    description: "Mention at least two different types of fruit.",
    xp: 20,
  },
  {
    id: "5",
    title: "Color Palette",
    description: "Include at least three different colors in your description.",
    xp: 30,
  },
  {
    id: "6",
    title: "Weather Report",
    description: "Use the words 'cloud', 'wind', and 'warmth'.",
    xp: 30,
  },
  {
    id: "7",
    title: "Time Traveler",
    description: "Mention 'yesterday', 'today', and 'tomorrow'.",
    xp: 50,
  },
  {
    id: "8",
    title: "Four-Part Tale",
    description: "Tell a complete story using exactly 4 sentences.",
    xp: 50,
  },
  {
    id: "9",
    title: "Double Curiosity",
    description: "Include at least 2 questions (sentences ending with '?').",
    xp: 30,
  },
  {
    id: "10",
    title: "Short & Sweet",
    description: "Write exactly 10 words in your entire postcard.",
    xp: 60,
  },
  {
    id: "11",
    title: "The Enthusiast",
    description: "End at least 3 sentences with an exclamation mark (!).",
    xp: 30,
  },
  {
    id: "12",
    title: "List Maker",
    description: "Include a list of 3 items separated by commas.",
    xp: 20,
  },
  {
    id: "13",
    title: "The Essayist",
    description: "Write a long message with more than 50 words.",
    xp: 40,
  },
  {
    id: "14",
    title: "One Breath",
    description: "Write your entire postcard in just one single sentence.",
    xp: 50,
  },
  {
    id: "15",
    title: "Shouting from Afar",
    description: "Write your entire postcard using ONLY CAPITAL LETTERS.",
    xp: 60,
  },
  {
    id: "16",
    title: "Quiet Whispers",
    description: "Write your entire postcard using only lowercase letters.",
    xp: 40,
  },
  {
    id: "17",
    title: "Numerical Order",
    description: "Start every sentence with a number (1., 2., 3., etc.).",
    xp: 70,
  },
  {
    id: "18",
    title: "First Impressions",
    description: "Every sentence must start with the same letter.",
    xp: 80,
  },
  {
    id: "19",
    title: "No E-Zone",
    description: "Write a message without using the letter 'e' at all.",
    xp: 100,
  },
  {
    id: "20",
    title: "Lucky Seven",
    description: "Use exactly 7 words that have 7 letters or more.",
    xp: 90,
  },
  {
    id: "21",
    title: "Alpha & Omega",
    description:
      "Start your first sentence with 'A' and your last sentence with 'Z'.",
    xp: 80,
  },
  {
    id: "22",
    title: "Rhyme Time",
    description:
      "Ensure the last words of your first and second sentence rhyme.",
    xp: 70,
  },
  {
    id: "23",
    title: "Lipogrammatic",
    description: "Do not use the word 'and' in your entire text.",
    xp: 50,
  },
  {
    id: "24",
    title: "The Haiku Spirit",
    description: "Write 3 sentences with roughly 5, 7 and 5 words each.",
    xp: 80,
  },
  {
    id: "25",
    title: "Action Packed",
    description: "Use at least 5 different verbs ending in '-ing'.",
    xp: 40,
  },
  {
    id: "26",
    title: "Vowel Hunter",
    description:
      "Include a word that contains at least 3 vowels in a row (e.g., 'beautiful').",
    xp: 60,
  },
  {
    id: "27",
    title: "Double Trouble",
    description:
      "Use at least 3 words that have double letters (e.g., 'look', 'street').",
    xp: 40,
  },
  {
    id: "28",
    title: "Mirror World",
    description: "Start and end your postcard with the exact same word.",
    xp: 50,
  },
  {
    id: "29",
    title: "Foreign Flair",
    description: "Include one word in a language other than English.",
    xp: 30,
  },
  {
    id: "30",
    title: "The Minimalist",
    description: "Write a message using only words with 4 letters or less.",
    xp: 90,
  },
];

export const fetchQuests = () => {
  return new Promise<Quest[]>((resolve) => {
    setTimeout(() => resolve(mockQuests), 500);
  });
};
