/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Hadith } from '../types';

/**
 * Remove Arabic diacritics (tashkeel) and normalize letters for robust search
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    // Remove diacritics / harakat
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
    // Normalize Alef forms (أ, إ, آ, ٱ -> ا)
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Taa Marbuta (ة -> ه)
    .replace(/ة/g, 'ه')
    // Normalize Yaa (ى -> ي)
    .replace(/ى/g, 'ي')
    // Remove tatweel (ـ)
    .replace(/ـ/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Check if a text haystack matches a search token, handling optional Arabic "ال" prefix
 */
function textMatchesToken(haystack: string, token: string): boolean {
  if (!haystack || !token) return false;
  if (haystack.includes(token)) return true;

  // If token starts with "ال" (Al-) and is longer than 3 letters, also test without "ال"
  if (token.startsWith('ال') && token.length > 3) {
    const withoutAl = token.slice(2);
    if (haystack.includes(withoutAl)) return true;
  }

  // If token doesn't start with "ال", test with "ال"
  if (!token.startsWith('ال')) {
    const withAl = 'ال' + token;
    if (haystack.includes(withAl)) return true;
  }

  return false;
}

/**
 * Filter hadiths based on search query, category, and favorite IDs
 */
export function filterHadiths(
  hadiths: Hadith[],
  options: {
    query?: string;
    category?: string;
    favoritesOnly?: boolean;
    favoriteIds?: number[];
  }
): Hadith[] {
  const { query = '', category = 'الكل', favoritesOnly = false, favoriteIds = [] } = options;
  const normalizedQuery = normalizeArabicText(query);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return hadiths.filter((hadith) => {
    // Favorites check
    if (favoritesOnly && !favoriteIds.includes(hadith.id)) {
      return false;
    }

    // Category check
    if (category && category !== 'الكل' && hadith.category !== category) {
      return false;
    }

    // Query search check
    if (queryTokens.length > 0) {
      const combinedText = normalizeArabicText(
        `${hadith.title} ${hadith.matn} ${hadith.narrator} ${hadith.source} ${hadith.reference} ${hadith.category} ${hadith.explanation || ''}`
      );

      // All tokens should match
      const allTokensMatch = queryTokens.every((token) => textMatchesToken(combinedText, token));
      if (!allTokensMatch) return false;
    }

    return true;
  });
}

/**
 * Get daily hadith based on calendar day (deterministic per day)
 */
export function getDailyHadith(hadiths: Hadith[], date: Date = new Date()): Hadith | null {
  if (!hadiths || hadiths.length === 0) return null;

  // Derive a day number from year, month, date
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const index = Math.abs(dayOfYear % hadiths.length);
  return hadiths[index] || hadiths[0];
}

/**
 * Pick another random hadith excluding current one if possible
 */
export function getAnotherHadith(hadiths: Hadith[], currentId?: number): Hadith | null {
  if (!hadiths || hadiths.length === 0) return null;
  if (hadiths.length === 1) return hadiths[0];

  const pool = currentId ? hadiths.filter((h) => h.id !== currentId) : hadiths;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
