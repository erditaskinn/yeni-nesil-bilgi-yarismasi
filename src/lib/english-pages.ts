import type { Difficulty } from "./config";
import { CATEGORIES } from "./categories";
import { TOPIC_CATEGORIES, type TopicCategory } from "./category-pages";
export const ENGLISH_LEVEL_PAGES: Record<Difficulty, { slug: string; intro: string; details: string }> = {
  easy: { slug: "easy-trivia-quiz", intro: "Start with familiar facts from science, geography, art and history. Test what you know and discover new details in a relaxed general knowledge quiz.", details: "Attention matters as much as speed. Each round selects different easy questions according to your chosen round length. Every answer reveals the correct choice and a short explanation." },
  medium: { slug: "medium-trivia-quiz", intro: "Ready to connect what you know? Explore space, history, literature and science in a general knowledge quiz that asks you to think a little deeper.", details: "No specialist knowledge is required. You might recall an ancient capital, a scientist's field of work or a detail from world geography." },
  hard: { slug: "hard-trivia-quiz", intro: "A challenge for people who enjoy remembering details and comparing choices. Explore artworks, historic places and scientific facts more closely.", details: "Each explanation reveals more than the right choice: it adds context to the answer. An incorrect answer is a chance to learn for your next round." },
  expert: { slug: "very-hard-trivia-quiz", intro: "Follow your curiosity into the details. Discover less familiar facts about planets, archaeological periods, art history and the oceans.", details: "Every question has four choices and one correct answer. Even if time runs out, you see the answer and its explanation, so learning continues throughout the round." },
};
export const ENGLISH_CATEGORY_PAGES = Object.fromEntries(TOPIC_CATEGORIES.map(category => [category, { slug: CATEGORIES[category].slug[1] }])) as Record<TopicCategory, { slug: string }>;
