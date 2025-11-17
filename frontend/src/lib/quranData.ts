export interface QuranAyat {
  surah: number;
  ayat: number;
  arabic: string;
  english: string;
  bengali: string;
  reference: string;
}

export const quranAyats: QuranAyat[] = [
  {
    surah: 2,
    ayat: 186,
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    english: "And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
    bengali: "আর আমার বান্দারা যখন তোমার কাছে আমার সম্পর্কে জিজ্ঞেস করে, (তাদেরকে বলে দাও,) আমি তো কাছেই আছি। প্রার্থনাকারী যখন আমাকে ডাকে তখন আমি তার ডাকে সাড়া দেই।",
    reference: "Surah Al-Baqarah 2:186"
  },
  {
    surah: 94,
    ayat: 5,
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "For indeed, with hardship [will be] ease.",
    bengali: "নিশ্চয়ই কষ্টের সাথে স্বাচ্ছন্দ্য রয়েছে।",
    reference: "Surah Ash-Sharh 94:5"
  },
  {
    surah: 13,
    ayat: 28,
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    english: "Verily, in the remembrance of Allah do hearts find rest.",
    bengali: "জেনে রাখো, আল্লাহর স্মরণেই অন্তরসমূহ প্রশান্ত হয়।",
    reference: "Surah Ar-Ra'd 13:28"
  },
  {
    surah: 3,
    ayat: 159,
    arabic: "فَاعْفُ عَنْهُمْ وَاسْتَغْفِرْ لَهُمْ وَشَاوِرْهُمْ فِي الْأَمْرِ",
    english: "So pardon them and ask forgiveness for them and consult them in the matter.",
    bengali: "অতএব তাদেরকে ক্ষমা করে দাও এবং তাদের জন্য ক্ষমা প্রার্থনা করো এবং কাজে-কর্মে তাদের সাথে পরামর্শ করো।",
    reference: "Surah Al-Imran 3:159"
  },
  {
    surah: 2,
    ayat: 286,
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    english: "Allah does not burden a soul beyond that it can bear.",
    bengali: "আল্লাহ কাউকে তার সাধ্যের অতিরিক্ত দায়িত্ব চাপিয়ে দেন না।",
    reference: "Surah Al-Baqarah 2:286"
  },
  {
    surah: 39,
    ayat: 53,
    arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    english: "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah.'",
    bengali: "বলুন, 'হে আমার বান্দারা যারা নিজেদের উপর বাড়াবাড়ি করেছ, আল্লাহর রহমত থেকে নিরাশ হয়ো না।'",
    reference: "Surah Az-Zumar 39:53"
  },
  {
    surah: 65,
    ayat: 3,
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    english: "And whoever relies upon Allah - then He is sufficient for him.",
    bengali: "আর যে কেউ আল্লাহর উপর ভরসা করে, তার জন্য তিনিই যথেষ্ট।",
    reference: "Surah At-Talaq 65:3"
  },
  {
    surah: 29,
    ayat: 69,
    arabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا",
    english: "And those who strive for Us - We will surely guide them to Our ways.",
    bengali: "আর যারা আমার পথে সংগ্রাম করে, আমি অবশ্যই তাদেরকে আমার পথে পরিচালিত করব।",
    reference: "Surah Al-Ankabut 29:69"
  },
  {
    surah: 20,
    ayat: 25,
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي",
    english: "My Lord, expand for me my breast [with assurance].",
    bengali: "হে আমার প্রতিপালক! আমার বক্ষ প্রশস্ত করে দাও।",
    reference: "Surah Ta-Ha 20:25"
  },
  {
    surah: 16,
    ayat: 97,
    arabic: "مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً",
    english: "Whoever does righteousness, whether male or female, while he is a believer - We will surely cause him to live a good life.",
    bengali: "যে কেউ সৎকর্ম করে, পুরুষ হোক বা নারী, বিশ্বাসী অবস্থায়, আমি অবশ্যই তাকে উত্তম জীবন দান করব।",
    reference: "Surah An-Nahl 16:97"
  }
];

export function getRandomAyat(): QuranAyat {
  const randomIndex = Math.floor(Math.random() * quranAyats.length);
  return quranAyats[randomIndex];
}
